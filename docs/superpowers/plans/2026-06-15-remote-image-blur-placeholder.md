# Remote Image Blur Placeholder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render remote MDX body images with cached image-derived blur placeholders while retaining the existing shimmer fallback.

**Architecture:** Replace the dimension-only Cloudflare KV utility with a server-only placeholder utility that caches `width`, `height`, and `blurDataURL` under a versioned key. The MDX renderer passes this metadata to `LazyImage`, which uses Next.js blur placeholders when available and keeps the current shimmer behavior only for failures.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Sharp, Cloudflare KV REST API, Node.js test runner

---

### Task 1: Remote Image Placeholder Utility

**Files:**
- Create: `src/utils/image-placeholder-util.ts`
- Create: `src/utils/image-placeholder-util.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Add a test command**

Add this script to `package.json`:

```json
"test": "node --test --experimental-strip-types src/utils/image-placeholder-util.test.ts"
```

- [ ] **Step 2: Write failing tests for cache and generation behavior**

Create `src/utils/image-placeholder-util.test.ts` using `node:test` and
`node:assert/strict`. Test these public behaviors through injected dependencies:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createRemoteImagePlaceholderLoader,
  type RemoteImagePlaceholder,
} from './image-placeholder-util.ts';

const cachedPlaceholder: RemoteImagePlaceholder = {
  width: 1200,
  height: 800,
  blurDataURL: 'data:image/webp;base64,cached',
};

test('returns a valid KV placeholder without fetching the source image', async () => {
  let sourceFetches = 0;
  const loader = createRemoteImagePlaceholderLoader({
    readCache: async () => cachedPlaceholder,
    writeCache: async () => {},
    fetchSource: async () => {
      sourceFetches += 1;
      return Buffer.from('source');
    },
    createPlaceholder: async () => {
      throw new Error('must not generate');
    },
  });

  assert.deepEqual(
    await loader('https://files.toosign.me/image/post/photo.jpg'),
    cachedPlaceholder
  );
  assert.equal(sourceFetches, 0);
});

test('generates and stores a placeholder after a cache miss', async () => {
  const generated = {
    width: 1920,
    height: 1080,
    blurDataURL: 'data:image/webp;base64,generated',
  };
  let stored: RemoteImagePlaceholder | null = null;
  let sourceFetches = 0;
  const loader = createRemoteImagePlaceholderLoader({
    readCache: async () => null,
    writeCache: async (_key, value) => {
      stored = value;
    },
    fetchSource: async () => {
      sourceFetches += 1;
      return Buffer.from('source');
    },
    createPlaceholder: async () => generated,
  });

  assert.deepEqual(await loader('https://files.toosign.me/image/post/photo.jpg'), generated);
  assert.deepEqual(stored, generated);
  assert.equal(sourceFetches, 1);
});

test('treats a legacy dimensions-only cache value as a cache miss', async () => {
  let generated = false;
  const loader = createRemoteImagePlaceholderLoader({
    readCache: async () => ({ width: 1200, height: 800 }),
    writeCache: async () => {},
    fetchSource: async () => Buffer.from('source'),
    createPlaceholder: async () => {
      generated = true;
      return cachedPlaceholder;
    },
  });

  assert.deepEqual(await loader('https://files.toosign.me/image/post/photo.jpg'), cachedPlaceholder);
  assert.equal(generated, true);
});

test('returns generated data when the KV write fails', async () => {
  const loader = createRemoteImagePlaceholderLoader({
    readCache: async () => null,
    writeCache: async () => {
      throw new Error('KV unavailable');
    },
    fetchSource: async () => Buffer.from('source'),
    createPlaceholder: async () => cachedPlaceholder,
  });

  assert.deepEqual(
    await loader('https://files.toosign.me/image/post/photo.jpg'),
    cachedPlaceholder
  );
});

test('rejects unsupported remote hosts without fetching them', async () => {
  let sourceFetches = 0;
  const loader = createRemoteImagePlaceholderLoader({
    readCache: async () => null,
    writeCache: async () => {},
    fetchSource: async () => {
      sourceFetches += 1;
      return Buffer.from('source');
    },
    createPlaceholder: async () => cachedPlaceholder,
  });

  assert.equal(await loader('https://example.com/photo.jpg'), null);
  assert.equal(sourceFetches, 0);
});

test('returns null when source processing fails', async () => {
  const loader = createRemoteImagePlaceholderLoader({
    readCache: async () => null,
    writeCache: async () => {},
    fetchSource: async () => {
      throw new Error('source unavailable');
    },
    createPlaceholder: async () => cachedPlaceholder,
  });

  assert.equal(await loader('https://files.toosign.me/image/post/photo.jpg'), null);
});
```

- [ ] **Step 3: Run the tests and confirm RED**

Run:

```bash
pnpm test
```

Expected: FAIL because `image-placeholder-util.ts` and its exports do not exist.

- [ ] **Step 4: Implement the minimal placeholder loader**

Create `src/utils/image-placeholder-util.ts` with:

- `RemoteImagePlaceholder`
- Runtime validation for cached JSON
- Exact HTTPS host validation for `files.toosign.me`
- Versioned cache key `image-placeholder:v1:<url>`
- Dependency-injected loader for tests
- Default KV REST read/write implementations
- Default source fetch implementation
- Sharp metadata and 10px WebP LQIP generation
- Public cached `getRemoteImagePlaceholder(url)` function

Use one source `Buffer` for both Sharp metadata and output generation:

```ts
const createPlaceholder = async (buffer: Buffer): Promise<RemoteImagePlaceholder> => {
  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Image dimensions are unavailable');
  }

  const data = await sharp(buffer)
    .resize(10, 10, { fit: 'inside' })
    .blur(2)
    .webp({ quality: 40 })
    .toBuffer();

  return {
    width: metadata.width,
    height: metadata.height,
    blurDataURL: `data:image/webp;base64,${data.toString('base64')}`,
  };
};
```

Treat KV read failures as cache misses. Swallow KV write failures after
generation. Return `null` for host validation, source fetch, metadata, or Sharp
processing failures.

- [ ] **Step 5: Run the tests and confirm GREEN**

Run:

```bash
pnpm test
```

Expected: six tests pass.

- [ ] **Step 6: Commit the server utility**

```bash
git add package.json src/utils/image-placeholder-util.ts src/utils/image-placeholder-util.test.ts
git commit -m "feat: cache remote image blur placeholders"
```

### Task 2: Remote MDX Image Rendering

**Files:**
- Modify: `src/components/ui/mdxComponent.tsx`
- Modify: `src/components/ui/lazyImage.tsx`
- Delete: `src/utils/image-size-util.ts`

- [ ] **Step 1: Replace the MDX size lookup**

In `src/components/ui/mdxComponent.tsx`, replace `getImageSize` with
`getRemoteImagePlaceholder` and pass all returned fields:

```tsx
const placeholder = await getRemoteImagePlaceholder(src);

return (
  <LazyImage
    alt={alt ?? ''}
    blurDataURL={placeholder?.blurDataURL}
    className={twMerge('h-auto max-w-full', props.className)}
    draggable={props.draggable === true || props.draggable === 'true'}
    height={placeholder?.height}
    src={src}
    style={props.style}
    title={props.title}
    width={placeholder?.width}
  />
);
```

- [ ] **Step 2: Add the blur path to LazyImage**

Add `blurDataURL?: string` to `LazyImageProps`. When present:

- Do not render the shimmer overlay.
- Do not apply `opacity-0`.
- Pass `placeholder='blur'` and `blurDataURL` to Next.js `Image`.

When absent, preserve the current shimmer and 300ms fade-in behavior.

- [ ] **Step 3: Remove the old utility**

Delete `src/utils/image-size-util.ts` and confirm no references remain:

```bash
rg -n "image-size-util|getImageSize" src
```

Expected: no matches.

- [ ] **Step 4: Run focused and static verification**

Run:

```bash
pnpm test
pnpm type-check
```

Expected: tests pass and TypeScript exits with code 0.

- [ ] **Step 5: Commit the rendering integration**

```bash
git add src/components/ui/mdxComponent.tsx src/components/ui/lazyImage.tsx src/utils/image-size-util.ts
git commit -m "feat: blur remote MDX images"
```

### Task 3: Final Verification

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1: Run repository checks**

Run:

```bash
pnpm check
```

Expected: Biome and TypeScript exit with code 0.

- [ ] **Step 2: Run a production build**

Run:

```bash
pnpm build
```

Expected: Next.js production build exits with code 0. If Cloudflare credentials
are unavailable, verify that remote placeholder failures fall back without
failing the build.

- [ ] **Step 3: Inspect the final diff**

Run:

```bash
git diff HEAD~2 --check
git status --short
```

Expected: no whitespace errors and no unintended files.

- [ ] **Step 4: Verify in the browser**

Start the app and open a post containing a `files.toosign.me` body image.
Throttle or disable the image request long enough to confirm:

- The image-derived blur appears when KV/generation succeeds.
- The layout reserves the correct aspect ratio.
- The original image replaces the blur without a hidden or blank interval.

- [ ] **Step 5: Commit verification fixes if required**

Only if verification required code changes:

```bash
git add <changed-files>
git commit -m "fix: finalize remote image blur placeholders"
```
