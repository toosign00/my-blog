import posthog from 'posthog-js';

export type AnalyticsProperties = Record<string, boolean | number | string>;

const sanitizeUrl = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;

  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
};

export const sanitizeAnalyticsEvent = <T extends { properties?: Record<string, unknown> }>(
  event: T | null
): T | null => {
  if (!event?.properties) return event;

  for (const property of ['$current_url', '$referrer']) {
    event.properties[property] = sanitizeUrl(event.properties[property]);
  }

  return event;
};

export const track = (event: string, properties?: AnalyticsProperties) => {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
};

const getAnalyticsProperties = (element: HTMLElement): AnalyticsProperties => {
  const properties: AnalyticsProperties = {};

  for (const [key, value] of Object.entries(element.dataset)) {
    if (!key.startsWith('analytics') || key === 'analyticsEvent' || value === undefined) continue;

    const property = key
      .slice('analytics'.length)
      .replace(/^[A-Z]/, (letter) => letter.toLowerCase())
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    properties[property] = value;
  }

  return properties;
};

export const captureAnalyticsClick = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return;

  const explicitTarget = target.closest<HTMLElement>('[data-analytics-event]');
  if (explicitTarget?.dataset.analyticsEvent) {
    track(explicitTarget.dataset.analyticsEvent, getAnalyticsProperties(explicitTarget));
    return;
  }

  const link = target.closest<HTMLAnchorElement>('a[href]');
  if (!link) return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin === window.location.origin) return;

  track('external_link_click', {
    destination_host: destination.hostname,
    location: link.dataset.analyticsLocation ?? 'content',
  });
};
