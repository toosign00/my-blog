import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import tls from 'node:tls';
import { requestPinnedUrl } from '../../src/utils/link-preview-request-util.ts';

let certificates;
let directory;

before(() => {
  directory = mkdtempSync(join(tmpdir(), 'my-blog-test-tls-'));
  const openssl = (...args) => execFileSync('openssl', args, { cwd: directory, stdio: 'ignore' });
  openssl(
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-days',
    '1',
    '-subj',
    '/CN=my-blog integration test CA',
    '-keyout',
    'ca.key',
    '-out',
    'ca.pem',
    '-addext',
    'basicConstraints=critical,CA:TRUE',
    '-addext',
    'keyUsage=critical,keyCertSign,cRLSign'
  );
  openssl(
    'req',
    '-new',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-subj',
    '/CN=preview.test',
    '-keyout',
    'server.key',
    '-out',
    'server.csr'
  );
  writeFileSync(
    join(directory, 'server.ext'),
    [
      'subjectAltName=DNS:preview.test',
      'extendedKeyUsage=serverAuth',
      'basicConstraints=CA:FALSE',
      'keyUsage=digitalSignature,keyEncipherment',
    ].join('\n')
  );
  openssl(
    'x509',
    '-req',
    '-in',
    'server.csr',
    '-CA',
    'ca.pem',
    '-CAkey',
    'ca.key',
    '-CAcreateserial',
    '-out',
    'server.pem',
    '-days',
    '1',
    '-extfile',
    'server.ext'
  );
  certificates = {
    key: readFileSync(join(directory, 'server.key')),
    cert: readFileSync(join(directory, 'server.pem')),
    ca: readFileSync(join(directory, 'ca.pem')),
  };
});

after(() => {
  if (directory) rmSync(directory, { recursive: true, force: true });
});

async function startServer(t, respond, trusted = true) {
  const previousAgent = https.globalAgent;
  const agent = new https.Agent({ ca: trusted ? certificates.ca : [], keepAlive: false });
  https.globalAgent = agent;
  t.after(() => {
    agent.destroy();
    https.globalAgent = previousAgent;
  });
  const servernames = [];
  const requests = [];
  const sockets = new Set();
  const secureContext = tls.createSecureContext(certificates);
  const server = tls.createServer(
    {
      key: certificates.key,
      cert: certificates.cert,
      SNICallback(servername, callback) {
        servernames.push(servername);
        callback(null, secureContext);
      },
    },
    (socket) => {
      socket.once('data', (data) => {
        requests.push(data.toString());
        respond(socket);
      });
    }
  );
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  t.after(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    url: new URL(`https://preview.test:${server.address().port}/preview?q=1`),
    servernames,
    requests,
  };
}

const loopback = { address: '127.0.0.1', family: 4 };

test('verifies HTTPS while preserving the original Host and TLS SNI over a pinned IP', {
  timeout: 5000,
}, async (t) => {
  const { url, servernames, requests } = await startServer(t, (socket) =>
    socket.end('HTTP/1.1 200 OK\r\nContent-Length: 17\r\n\r\n<title>OK</title>')
  );
  const response = await requestPinnedUrl(url, loopback, AbortSignal.timeout(2000));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<title>OK</title>');
  assert.deepEqual(servernames, ['preview.test']);
  assert.match(requests[0], /^GET \/preview\?q=1 HTTP\/1\.1\r\n/);
  assert.ok(requests[0].includes(`Host: ${url.host}\r\n`));
});

test('rejects an untrusted HTTPS certificate before sending an HTTP request', {
  timeout: 5000,
}, async (t) => {
  const { url, requests } = await startServer(t, (socket) => socket.end(), false);
  await assert.rejects(requestPinnedUrl(url, loopback, AbortSignal.timeout(2000)), {
    code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  });
  assert.equal(requests.length, 0);
});

test('rejects a trusted certificate issued for a different hostname', {
  timeout: 5000,
}, async (t) => {
  const { url, requests, servernames } = await startServer(t, (socket) => socket.end());
  url.hostname = 'wrong.test';
  await assert.rejects(requestPinnedUrl(url, loopback, AbortSignal.timeout(2000)), {
    code: 'ERR_TLS_CERT_ALTNAME_INVALID',
  });
  assert.deepEqual(servernames, ['wrong.test']);
  assert.equal(requests.length, 0);
});

test('rejects HTTPS 600 before abort and closes the failed TLS response', {
  timeout: 5000,
}, async (t) => {
  const { promise: closed, resolve: onClose } = Promise.withResolvers();
  const { url } = await startServer(t, (socket) => {
    socket.on('close', onClose);
    socket.write('HTTP/1.1 600 Invalid\r\nContent-Length: 100\r\n\r\n');
  });
  const signal = AbortSignal.timeout(2000);
  await assert.rejects(requestPinnedUrl(url, loopback, signal), RangeError);
  assert.equal(signal.aborted, false);
  await closed;
});
