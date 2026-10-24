---
version: alpha
name: toosign blog
description: Pretendard 기반의 조용한 읽기 중심 블로그 인터페이스. 차가운 slate 회색(라이트)과 순수 회색(다크) 위에 단 하나의 파란 강조색(#3182f6)을 쓴다. 장식은 헤어라인 테두리와 미디어 아래 그림자 하나로 제한한다.

colors:
  fg-primary: "#1d1d30"
  fg-primary-dark: "#ffffff"
  fg-secondary: "#393960"
  fg-secondary-dark: "#dddddd"
  fg-tertiary: "#6b6b87"
  fg-tertiary-dark: "#b2b2b2"
  fg-muted: "#b5b5c3"
  fg-muted-dark: "#888888"
  fg-inverse: "#fcfcfd"
  fg-inverse-dark: "#0f0f0f"
  fg-accent: "#3182f6"
  fg-accent-dark: "#63a9ff"
  fg-accent-strong: "#2997ff"
  fg-accent-strong-dark: "#8ec2ff"
  bg-canvas: "#fcfcfd"
  bg-canvas-dark: "#0f0f0f"
  bg-surface: "#ffffff"
  bg-surface-dark: "#0f0f0f"
  bg-elevated: "#ffffff"
  bg-elevated-dark: "#1b1b1b"
  bg-muted: "#f9f9fc"
  bg-muted-dark: "#141414"
  bg-pressed: "#f4f4f8"
  bg-pressed-dark: "#1b1b1b"
  bg-inverse: "#393960"
  bg-inverse-dark: "#dddddd"
  bg-fill-weak: "rgba(0, 0, 0, 0.02)"
  bg-fill-weak-dark: "rgba(255, 255, 255, 0.02)"
  bg-fill: "rgba(0, 0, 0, 0.04)"
  bg-fill-dark: "rgba(255, 255, 255, 0.04)"
  bg-fill-strong: "rgba(0, 0, 0, 0.08)"
  bg-fill-strong-dark: "rgba(255, 255, 255, 0.08)"
  bg-scrim: "rgba(15, 15, 15, 0.35)"
  bg-scrim-dark: "rgba(0, 0, 0, 0.5)"
  border-default: "#f4f4f8"
  border-default-dark: "#1b1b1b"
  border-strong: "#6b6b87"
  border-strong-dark: "#b2b2b2"
  warning-fg: "#b45309"
  warning-fg-dark: "#fbbf24"
  danger-fg: "#dc2626"
  danger-fg-dark: "#f87171"

typography:
  display:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 8.8rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.03em
  display-sm:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 6.4rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.03em
  title-lg:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  title:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  heading-lg:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  heading:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.01em
  body-lg:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.8
  body:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
  caption-sm:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
  micro:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.6
  code:
    fontFamily: "Geist Mono, Courier New, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.25

rounded:
  xs: 4px
  sm: 8px
  md: 10px
  lg: 14px
  full: 9999px

spacing:
  base: 4px
  steps: "0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48 (× base)"
  inline: 24px
  header: 64px
  app: 758px
  sidebar: 210px

components:
  ui-card:
    backgroundColor: "{colors.bg-surface}"
    borderColor: "{colors.border-default}"
    rounded: "{rounded.lg}"
  ui-button:
    backgroundColor: "{colors.bg-surface}"
    borderColor: "{colors.border-default}"
    textColor: "{colors.fg-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    height: 40px
  ui-chip:
    backgroundColor: "{colors.bg-muted}"
    borderColor: "{colors.border-default}"
    rounded: "{rounded.sm}"
  section-action-chip:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 0 12px
  section-heading:
    textColor: "{colors.fg-muted}"
    typography: "{typography.body}"
  pagination-item:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    size: 32px
  pagination-item-current:
    backgroundColor: "{colors.bg-inverse}"
    textColor: "{colors.fg-inverse}"
    rounded: "{rounded.full}"
    size: 32px
  text-link:
    textColor: "{colors.fg-accent}"
    typography: "{typography.body}"
---

# 디자인 시스템

이 문서는 블로그 디자인 시스템의 단일 기준이다. 위 frontmatter의 이름과 값은
`src/styles/tokens/`의 토큰과 1:1로 대응한다. 둘이 다르면 코드가 기준이고, 이 문서를 고친다.

- 토큰 정의: `src/styles/tokens/primitives.css`, `semantic.css`, `theme.css`, `icon.ts`
- 공용 유틸리티: `src/styles/utilities.css`
- 컴포넌트 목록: [`docs/design-system/components.md`](docs/design-system/components.md)

## 원칙

- 읽기가 우선이다. 본문은 15–16px, 넉넉한 행간(1.6–1.8), 한글 줄바꿈은 `word-break: keep-all`.
- 강조색은 파랑 하나뿐이다. 링크, 포커스, 방문 수 같은 "살아 있는" 정보에만 쓴다.
- 깊이는 헤어라인 테두리와 옅은 채움(`fill`)으로 만든다. 그림자는 미디어(`shadow-media`)와 툴팁(`shadow-popover`)에만 쓴다.
- 라이트는 푸른 기가 도는 slate, 다크는 순수 회색이다. 두 테마 모두 같은 semantic 이름을 쓴다.

## 토큰 계층

```
primitives.css   원시 값       --slate-900, --blue-500, --length-header, --time-fast …
      ↓
semantic.css     역할 이름     --fg-primary, --bg-surface, --border-default … (:root / .dark)
      ↓
theme.css        Tailwind 노출 text-primary, bg-surface, border-default, text-body, rounded-lg …
      ↓
utilities.css    공용 패턴     ui-card, ui-button, hover-fade, z-header, toc-panel …
```

- 컴포넌트는 **theme.css와 utilities.css가 만든 클래스만** 쓴다. primitive 변수를 직접 참조하지 않는다.
- CSS에서 값이 필요하면 semantic 변수(`var(--fg-primary)`)나 `--spacing(n)`을 쓴다.
- 리터럴 값(hex, px, ms 등)은 `src/styles/tokens/` 안에서만 허용된다.
- theme.css는 Tailwind 기본 스케일을 모두 리셋한다. 그래서 `bg-blue-500`, `rounded-xl`, `text-3xl`, `shadow-lg` 같은 클래스는 CSS를 만들지 않는다.

## 색

| 역할 | 클래스 | 용도 |
| --- | --- | --- |
| 본문/제목 | `text-primary` | 제목, 본문, 활성 메뉴 |
| 보조 | `text-secondary` | 부제, 강조된 보조 텍스트 |
| 3차 | `text-tertiary` | 설명, 메타 정보, 아이콘 |
| 흐림 | `text-muted` | 날짜, 섹션 제목, 저작권, placeholder |
| 반전 | `text-inverse` + `bg-inverse` | 선택된 칩, 현재 페이지, 툴팁 |
| 강조 | `text-accent`, `text-accent-strong`, `bg-accent` | 링크, 프로필 라벨, 방문 수 |
| 캔버스/표면 | `bg-canvas`, `bg-surface`, `bg-elevated` | 페이지 배경, 카드, 프로필 카드 |
| 상태 배경 | `bg-muted`(hover), `bg-pressed`(active) | 카드 hover/active |
| 채움 | `bg-fill-weak`, `bg-fill`, `bg-fill-strong` | 코드 배경, 버튼 hover, 스켈레톤, 선택 영역 |
| 테두리 | `border-default`, `border-strong`, `border-fill`, `border-elevated`, `border-media` | 헤어라인, 포커스된 입력, 링크 밑줄, 프로필 카드, 이미지 |
| 상태 | `text-warning(-muted)`, `bg-warning`, `border-warning`, `danger` 동일 | MDX `<Alert>` |
| 하이라이트 | `bg-highlight-{yellow,blue,green,purple,red}` + 같은 이름의 `text-` | MDX `<Highlight>` |
| 히트맵 | `bg-heatmap-0..4` | GitHub 기여 그래프 |
| 코드 | `--shiki-token-*` | shiki css-variables 테마 |

## 타이포그래피

| 클래스 | 크기 / 행간 | 쓰임 |
| --- | --- | --- |
| `text-display`, `text-display-sm` | 8.8rem, 6.4rem / 1 | 404·에러 큰 숫자 |
| `text-title-lg` | 28px / 1.25 | 프로젝트 제목 |
| `text-title` | 24px / 1.3 | 글 제목, 페이지 제목, 이름 |
| `text-heading-lg` | 20px / 1.4 | MDX h1, 지표 숫자 |
| `text-heading` | 18px / 1.35 | MDX h2, 경력·학력 항목 제목 |
| `text-body-lg` | 16px / 1.8 | MDX 목록 항목 |
| `text-body` | 15px / 1.6 | 글 본문(`leading-loose`), 카드 제목, 버튼 라벨, 섹션 제목 |
| `text-label` | 14px / 1.5 | 메뉴, 표, 폼, 칩 |
| `text-caption` | 13px / 1.5 | 메타 정보, 작은 버튼 |
| `text-caption-sm` | 12px / 1.5 | 날짜, 태그, 코드 |
| `text-micro` | 11px / 1.6 | 저작권, 프로필 라벨 |

굵기는 `font-normal`(400), `font-medium`(500), `font-semibold`(600), `font-bold`(700) 네 단계다.
행간은 `leading-none/tight/snug/normal/relaxed/loose`, 자간은 `tracking-tighter/tight/normal/wide`만 쓴다.
글꼴은 `font-sans`(Pretendard)와 `font-mono`(Geist Mono) 두 가지다.

## 간격과 레이아웃

- 간격은 4px(`--spacing`)의 배수이고, 허용 단계는
  `0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48`이다.
- 레이아웃 치수는 이름 있는 토큰을 쓴다: `max-w-app`, `w-sidebar`, `px-inline`, `h-header`, `w-post-thumb`,
  `max-w-app-with-sidebar`, `w-app-expanded`, `grid-cols-auto-fill`.
- 브레이크포인트: `mobile` 40rem, `tablet` 60rem, `desktop` 80rem, `wide` 100rem.
  Tailwind 기본 `sm/md/lg`는 정의돼 있지 않다.

## 모서리, 그림자, 모션, 레이어

- 모서리: `rounded-xs` 4px, `rounded-sm` 8px, `rounded-md` 10px, `rounded-lg` 14px, `rounded-full`.
- 그림자: `shadow-media`, `shadow-popover` 두 가지만 있다.
- 블러: `backdrop-blur-sm` 8px, `backdrop-blur-md` 12px.
- 모션: `duration-fast` 150ms, `duration-base` 200ms, `duration-slow` 300ms, `ease-in-out`, `ease-out`.
  자주 쓰는 패턴은 `hover-fade`(hover 시 불투명도 0.7)와 `press`(눌림 시 0.98배)다.
- 레이어: `z-raised` < `z-overlay` < `z-header` < `z-modal` < `z-tooltip`.
- 아이콘 크기: `ICON_SIZE.xs|sm|md|lg` = 14/16/18/20px (`src/styles/tokens/icon.ts`).

## 규칙과 검사

`pnpm check-tokens`(`scripts/check-tokens.mjs`)가 다음을 실패로 처리한다.
이 검사는 `pnpm check`, lint-staged, CI에서 실행된다.

1. Tailwind 임의값: `p-[13px]`, `z-(--x)`, `[counter-reset:x]` 등
2. 정의되지 않은 클래스: CSS를 만들지 않는 클래스 (예: 리셋된 `bg-blue-500`, 오타)
3. 허용 단계 밖의 간격: `pt-4.25`
4. 숫자 그대로 쓴 모션/레이어/불투명도: `duration-200`, `z-10`, `opacity-70`
5. 소스 안의 raw 색상: hex, `rgb()`, `hsl()`, `oklch()` …
6. 인라인 스타일 객체 `style={{ … }}`
7. 숫자 그대로 쓴 아이콘 크기 `size={16}`
8. `src/styles/` 안의 리터럴 길이·시간·색 (`tokens/` 제외)

### 예외

| 대상 | 이유 |
| --- | --- |
| `src/components/icons/*` | 브랜드 로고의 공식 색 |
| `src/components/ui/lazyImage.tsx` 인라인 style | 이미지 크기에서 계산한 `aspect-ratio` |
| `title`, `subtitle`, `description`, `hoverable-surface`, `group` 등 | 선택자로만 쓰는 마커 클래스 |

새 예외가 필요하면 `scripts/check-tokens.mjs` 상단 목록에 이유와 함께 추가하고, 이 표도 갱신한다.

### 새 값이 필요할 때

1. 기존 토큰으로 표현할 수 있는지 먼저 확인한다.
2. 없으면 `primitives.css`에 원시 값을 추가한다.
3. 테마마다 다르면 `semantic.css`의 `:root`와 `.dark` 양쪽에 역할 이름을 추가한다.
4. `theme.css`에 Tailwind 이름을 등록하거나, 반복 패턴이면 `utilities.css`에 `@utility`를 만든다.
5. 이 문서의 frontmatter와 표를 갱신한다.
