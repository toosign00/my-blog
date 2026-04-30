# semantic

Next.js (App Router) + MDX blog starter. Content lives in `src/app/**` with MDX articles and static routes for RSS/sitemap.

## Structure

```
./
├── src/
│   ├── app/                      # Next.js App Router pages/routes + content
│   ├── assets/                   # bundled static assets
│   │   ├── images/posts/         # per-post images (slug folders)
│   │   └── font/                 # next/font (Pretendard local + Geist Mono)
│   ├── components/               # UI + icons + client-only helpers
│   ├── constants/                # site metadata/menu/profile constants
│   ├── styles/                   # global styles (Tailwind)
│   ├── types/                    # shared TS types
│   └── utils/                    # text/post helpers
├── public/                       # public static assets
├── next.config.ts                # MDX + Next config
├── mdx-components.tsx            # MDX component mapping
├── biome.json                    # Biome config
└── package.json                  # scripts + deps (pnpm)
```

## Where To Look

| Task | Location | Notes |
| --- | --- | --- |
| Add/edit a post | `src/app/posts/_articles/*.mdx` | Each MDX exports `metadata` (title/subtitle/dates/coverImage/category/tags/comments). |
| Post images | `src/assets/images/posts/<slug>/...` | `coverImage` in MDX points here (e.g. `posts/<slug>/cover.webp`). |
| About page | `src/app/about/page.tsx`, `src/components/about/` | About route + 전용 섹션 컴포넌트. |
| Site shell + providers | `src/app/layout.tsx` | ThemeProvider (next-themes), global styles, fonts. |
| Home/posts/category/tag pages | `src/app/**/page.tsx` | App Router route segments live here. |
| RSS feed | `src/app/rss/route.ts` | Generates RSS XML from posts. |
| Sitemap | `src/app/sitemap/route.ts` | Generates sitemap XML. |
| MDX component styling | `mdx-components.tsx` | Delegates to `src/components/ui/mdxComponent.tsx`. |
| Navigation + metadata | `src/constants/*` | `*.constants.ts` files (menu, metadata, profile, giscus). |

## Commands

```bash
pnpm install            # Install dependencies
pnpm dev               # Next dev server on http://localhost:3000 (default)
pnpm build             # Build for production
pnpm start             # Start production server

# Lint & format (Biome)
pnpm lint              # Run `biome check --write`
pnpm type-check        # TypeScript (`tsc --noEmit`)
pnpm check             # `type-check` + `lint`
```

## Conventions (Project-Specific)

### Package Management
- **Package manager**: `pnpm@10.33.2` (configured in `package.json`).
- Use `pnpm` for all dependency operations (install, add, remove).
- `pnpm-lock.yaml` is committed; regenerate via `pnpm install`.

### TypeScript
- **Configuration**: strict mode, noEmit (`tsconfig.json`).
- **Path aliases**: `@/*`, `@assets/*`, `@components/*`, `@constants/*`, `@hooks/*`, `@styles/*`, `@utils/*`.
- **Type imports**: Import types directly from their source (e.g., `@/types/content.types`), not from utility re-exports.

### MDX
- **Framework**: `@next/mdx` (configured in `next.config.ts`).
- **Components**: MDX components mapped in `mdx-components.tsx`.
- **GFM support**: `remark-gfm` plugin enabled for GitHub Flavored Markdown.

### Styling
- **Framework**: Tailwind CSS v4 via PostCSS plugin (`postcss.config.js`).
- **Global styles**: `@src/styles/globals.css`.
- **Font**: Geist Mono (code), Pretendard (body) via `src/assets/font` (`layout.tsx` imports `@src/assets/font`).
- **Asset placement**: `next/image`에서 import해서 쓰는 로컬 이미지는 `src/assets/images/**`, URL로 직접 참조되는 정적 파일(`favicon`, `robots`, `manifest`)은 `public/**`.

### Code Quality (Biome)
- **Engine**: `@biomejs/biome` with project config in `biome.json`.
- **Pre-commit**: `lint-staged` runs `biome check --write` on staged files.
- **Exceptions**: `noUnknownTypeSelector` and `useFilenamingConvention` rules disabled in `biome.json`.

## Anti-Patterns (This Repo)

- **Never bypass lint/format**: Run `pnpm lint` before committing when needed.
- **No type suppression**: Avoid `as any`, `@ts-ignore`, `@ts-expect-error`.
- **Image handling**: Use Next `<Image>` component instead of raw `<img>` for content.
- **Type imports**: Don't import types from utility re-exports; import from source directly.

## Code Standards

### General
- Prefer explicit, type-safe code; avoid `any` and implicit types.
- Use `unknown` instead of `any` when type is genuinely unknown.
- Leverage TypeScript's type narrowing instead of type assertions.
- Extract constants for magic numbers with descriptive names.

### React
- Call hooks only at top level, never conditionally.
- Specify all dependencies correctly in hook dependency arrays.
- Use semantic HTML (`<button>`, `<nav>`) instead of divs with ARIA roles.
- Provide meaningful alt text for images and proper heading hierarchy.
- Use `key` prop with unique IDs (not array indices) for iterables.

### Next.js
- Prefer App Router metadata APIs over legacy `<head>` manipulation.
- Use Server Components for async data fetching (avoid async Client Components).
- Use `next/image` for optimized images with proper `sizes` and `quality`.

### Error Handling
- Remove `console.log`, `debugger`, `alert` from production code.
- Throw `Error` objects with descriptive messages, not strings.
- Use `try-catch` blocks meaningfully; prefer early returns over nested conditionals.

### Performance
- Avoid spread syntax in accumulators within loops.
- Use top-level regex literals instead of creating them in loops.
- Prefer specific imports over namespace imports (tree-shaking).
- Avoid barrel files that re-export everything unnecessarily.
