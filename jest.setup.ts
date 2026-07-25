import '@testing-library/jest-dom';

if (globalThis.CSS && !globalThis.CSS.supports) {
  Object.defineProperty(globalThis.CSS, 'supports', {
    configurable: true,
    value: () => true,
  });
}

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string): MediaQueryList => ({
      addEventListener: () => undefined,
      addListener: () => undefined,
      dispatchEvent: () => false,
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: () => undefined,
      removeListener: () => undefined,
    }),
    writable: true,
  });
}
