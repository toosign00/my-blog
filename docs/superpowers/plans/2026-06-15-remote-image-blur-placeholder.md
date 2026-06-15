# Remote Image Blur Placeholder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render remote MDX body images with cached image-derived blur placeholders while retaining the existing shimmer fallback.

**Architecture:** Replace the dimension-only Cloudflare KV utility with a server-only placeholder utility that caches `width`, `height`, and `blurDataURL` under a versioned key. The MDX renderer passes this metadata to `LazyImage`, which uses Next.js blur placeholders when available and keeps the current shimmer behavior only for failures.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Sharp, Cloudflare KV REST API

---

### Task 1: Remote Image Placeholder Utility

**Files:**
- Create: `src/utils/image-placeholder-util.ts`

- [ ] **Step 1: Implement the placeholder loader**

Create `src/utils/image-placeholder-util.ts` with:

- `RemoteImagePlaceholder`
- Runtime validation for cached JSON
- Exact HTTPS host validation for `files.toosign.me`
- Versioned cache key `image-placeholder:v1:<url>`
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

### Task 3: Final Verification

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1: Run repository checks**

Run:

```bash
pnpm check
```

Expected: Biome and TypeScript exit with code 0.

- [ ] **Step 2: Inspect the final diff**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors and no unintended files.
