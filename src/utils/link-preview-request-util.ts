import { request as httpRequest, type RequestOptions } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { Readable } from 'node:stream';
import type { ResolvedAddress } from '@/utils/api-validation-util';

const NO_BODY_STATUSES = new Set([204, 205, 304]);

export type PinnedRequestOptions = RequestOptions & {
  servername?: string;
};

export const createPinnedRequestOptions = (
  url: URL,
  resolvedAddress: ResolvedAddress,
  signal: AbortSignal
): PinnedRequestOptions => ({
  protocol: url.protocol,
  hostname: resolvedAddress.address,
  family: resolvedAddress.family,
  port: url.port || undefined,
  path: `${url.pathname}${url.search}`,
  method: 'GET',
  headers: {
    Host: url.host,
    'User-Agent': 'my-blog-link-preview-bot/1.0',
  },
  ...(url.protocol === 'https:' && { servername: url.hostname }),
  signal,
});

export const requestPinnedUrl = (
  url: URL,
  resolvedAddress: ResolvedAddress,
  signal: AbortSignal
): Promise<Response> =>
  new Promise((resolve, reject) => {
    const request = url.protocol === 'https:' ? httpsRequest : httpRequest;
    const outgoing = request(
      createPinnedRequestOptions(url, resolvedAddress, signal),
      (incoming) => {
        const status = incoming.statusCode ?? 500;
        const headers = new Headers();

        for (const [name, value] of Object.entries(incoming.headers)) {
          if (Array.isArray(value)) {
            for (const item of value) {
              headers.append(name, item);
            }
          } else if (value !== undefined) {
            headers.set(name, value);
          }
        }

        const body = NO_BODY_STATUSES.has(status)
          ? null
          : (Readable.toWeb(incoming) as ReadableStream<Uint8Array>);
        resolve(new Response(body, { status, headers }));
      }
    );

    outgoing.on('error', reject);
    outgoing.end();
  });
