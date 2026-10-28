import assert from 'node:assert/strict';
import net from 'node:net';
import test from 'node:test';
import { requestPinnedUrl } from '../../src/utils/link-preview-request-util.ts';

async function startServer(t, respond) {
  const sockets = new Set();
  const server = net.createServer((socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.once('data', () => respond(socket));
  });
  t.after(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return new URL(`http://example.test:${server.address().port}/preview`);
}

const loopback = { address: '127.0.0.1', family: 4 };

test('reads a real HTTP response through the pinned transport', { timeout: 5000 }, async (t) => {
  const url = await startServer(t, (socket) =>
    socket.end('HTTP/1.1 200 OK\r\nContent-Length: 17\r\n\r\n<title>OK</title>')
  );
  const response = await requestPinnedUrl(url, loopback, AbortSignal.timeout(2000));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<title>OK</title>');
});

test('rejects HTTP 600 before abort and closes the failed response socket', {
  timeout: 5000,
}, async (t) => {
  const { promise: closed, resolve: onClose } = Promise.withResolvers();
  const url = await startServer(t, (socket) => {
    socket.on('close', onClose);
    socket.write('HTTP/1.1 600 Invalid\r\nContent-Length: 100\r\n\r\n');
  });
  const signal = AbortSignal.timeout(2000);
  await assert.rejects(requestPinnedUrl(url, loopback, signal), RangeError);
  assert.equal(signal.aborted, false);
  await closed;
});

test('closes an aborted request and allows the next request to succeed', {
  timeout: 5000,
}, async (t) => {
  const { promise: received, resolve: onRequest } = Promise.withResolvers();
  const { promise: closed, resolve: onClose } = Promise.withResolvers();
  let first = true;
  const url = await startServer(t, (socket) => {
    if (first) {
      first = false;
      socket.on('close', onClose);
      onRequest();
    } else {
      socket.end('HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK');
    }
  });
  const controller = new AbortController();
  const rejected = assert.rejects(requestPinnedUrl(url, loopback, controller.signal), {
    name: 'AbortError',
  });
  await received;
  controller.abort();
  await rejected;
  await closed;
  const response = await requestPinnedUrl(url, loopback, AbortSignal.timeout(2000));
  assert.equal(await response.text(), 'OK');
});

test('times out an unresponsive upstream and closes its socket', { timeout: 5000 }, async (t) => {
  const { promise: received, resolve: onRequest } = Promise.withResolvers();
  const { promise: closed, resolve: onClose } = Promise.withResolvers();
  const url = await startServer(t, (socket) => {
    socket.on('close', onClose);
    onRequest();
  });
  const controller = new AbortController();
  const rejected = assert.rejects(requestPinnedUrl(url, loopback, controller.signal), {
    name: 'AbortError',
  });
  await received;
  const timeout = AbortSignal.timeout(100);
  timeout.addEventListener('abort', () => controller.abort(timeout.reason), { once: true });
  await rejected;
  assert.equal(timeout.aborted, true);
  await closed;
});
