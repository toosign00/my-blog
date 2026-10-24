# 디자인 인벤토리와 마이그레이션 매핑

토큰화 이전(2026-10) 코드에 있던 모든 시각 값과, 그 값이 어떤 토큰으로 바뀌는지 정리한 표다.
정규화(값을 정해진 단계로 맞춤)로 생기는 시각 차이는 의도된 것이다.
토큰 정의는 `src/styles/tokens/`, 사용 규칙은 `DESIGN.md`를 본다.

## 1. 색상

### 1.1 텍스트

| 이전 클래스 / 변수 | 라이트 | 다크 | 새 클래스 | 비고 |
| --- | --- | --- | --- | --- |
| `text-gray-accent`, `--color-ink` | #1d1d30 | #ffffff | `text-primary` | |
| `text-gray-bold` | #393960 | #dddddd | `text-secondary` | |
| `text-gray-mid`, `--alert-icon` | #6b6b87 | #b2b2b2 | `text-tertiary` | |
| `text-gray-light`, `placeholder:text-gray-light` | #b5b5c3 | #888888 | `text-muted` | |
| `text-license` | #b5b5c3 | #b2b2b2 | `text-muted` | 다크 #b2b2b2 → #888888 |
| `text-background` (반전 칩 위 글자) | #fcfcfd | #0f0f0f | `text-inverse` | |
| `text-primary`, `--color-primary` | #3182f6 | #63a9ff | `text-accent` | |
| `--color-primary-focus`, `--color-profile-title` | #2997ff | #8ec2ff | `text-accent-strong` | |
| `text-alert-warning` / `-description` | #b45309 | #fbbf24 | `text-warning` / `text-warning-muted` | |
| `text-alert-destructive` / `-description` | #dc2626 | #f87171 | `text-danger` / `text-danger-muted` | |
| `text-{yellow,blue,green,purple,red}-900/300` | Tailwind 팔레트 | | `text-highlight-{yellow,blue,green,purple,red}` | |

### 1.2 배경

| 이전 | 라이트 | 다크 | 새 클래스 | 비고 |
| --- | --- | --- | --- | --- |
| `bg-background`, `--color-canvas` | #fcfcfd | #0f0f0f | `bg-canvas` | |
| `bg-surface-strong`, `bg-toggle`, `ui-*` 배경 | #ffffff | #101010 / #010101 | `bg-surface` | 다크 값을 #0f0f0f로 통일 |
| `--color-profile-card` | #ffffff | #1b1b1b | `bg-elevated` | |
| `bg-gray-hover`, `--color-surface-muted` | #f9f9fc | #141414 | `bg-muted` | |
| `bg-border` (active 눌림) | #f4f4f8 | #1b1b1b | `bg-pressed` | |
| `bg-gray-bold` (반전 칩) | #393960 | #dddddd | `bg-inverse` | |
| `bg-background02` | 검정 2% | 흰색 2% | `bg-fill-weak` | |
| `bg-background03`, `bg-background04`, `bg-background05`, `bg-background06` | 3–6% | | `bg-fill` (4%) | 정규화 |
| `bg-background08`, `::selection` | 8% | | `bg-fill-strong` | |
| `--color-overlay` | rgba(15,15,15,.35) | rgba(0,0,0,.5) | `bg-scrim` | |
| `bg-alert-warning-bg` / `bg-alert-destructive-bg` | | | `bg-warning` / `bg-danger` | 다크 빨강 배경 7.5% → 6% |
| `bg-alert-bg` | 2% / 3% | | `bg-fill-weak` | |
| `bg-{hue}-100/80`, `dark:bg-{hue}-400/15` | | | `bg-highlight-{hue}` | `dark:` 변형 불필요 |
| `--activity-0..4` | | | `bg-heatmap-0..4` | |
| `--color-ink` 배경(툴팁) | #1d1d30 | #ffffff | `bg-inverse` + `text-inverse` | 툴팁 색이 반전 칩과 같아짐 |

### 1.3 테두리

| 이전 | 새 클래스 |
| --- | --- |
| `border-border`, `border-hairline`, `--color-profile-divider`(라이트) | `border-default` |
| `focus:border-gray-mid` | `focus:border-strong` |
| `border-background04`, `border-background06`, `--alert-border` | `border-fill` (`--alert-border`는 `border-default`) |
| `--color-profile-divider`(다크 흰색 16%) | `border-elevated` |
| `--color-profile-image-border` | `border-media` |
| `border-alert-warning-border` / `border-alert-destructive-border` | `border-warning` / `border-danger` |

### 1.4 그 밖의 색

| 이전 | 새 토큰 |
| --- | --- |
| `--color-focus-ring` (rgba 70%/80%) | `--focus-ring` (75%) |
| `--color-gradient-sidebar-divider` | `--divider-gradient` → `divider-gradient` 유틸 |
| `--color-profile-image-shadow` + `0px 10px 39px` | `shadow-media` |
| `shadow-lg` (툴팁) | `shadow-popover` |
| `--shiki-token-*` hex | 같은 이름, 값은 `--code-light-*` / `--code-dark-*` primitive 참조 |
| `global-error.tsx`의 `--ge-*` hex 12개 | 일반 semantic 클래스 (globals.css import) |
| 외부 링크 아이콘 data URI의 `%23393960`, `%23DDDDDD` | `mask` + `background-color: var(--fg-secondary)` |
| `src/components/icons/*` hex 69개 | **예외**: 브랜드 고유색이라 토큰화하지 않음 |

## 2. 타이포그래피

### 2.1 크기 스케일

| 새 클래스 | 크기 | line-height | tracking | 대체한 것 |
| --- | --- | --- | --- | --- |
| `text-display` | 8.8rem | 1 | -0.03em | `tablet:text-[8.8rem]` |
| `text-display-sm` | 6.4rem | 1 | -0.03em | `text-[6.4rem]` |
| `text-title-lg` | 28px | 1.25 | -0.01em | `text-3xl`(30px), `text-xxxl` |
| `text-title` | 24px | 1.3 | -0.01em | `text-2xl`, `.post-title`, `text-xxl` |
| `text-heading-lg` | 20px | 1.4 | -0.01em | `text-xl`, ViewsWidget 인라인 `1.25rem` |
| `text-heading` | 18px | 1.35 | -0.01em | `text-lg`, `text-[17px]` |
| `text-body-lg` | 16px | 1.8 | | `text-md` (MDX 목록 항목) |
| `text-body` | 15px | 1.6 | | `text-base`, `.h3`, `.post-subtitle`, `.section-heading` 크기 |
| `text-label` | 14px | 1.5 | | `text-sm`, `.a` |
| `text-caption` | 13px | 1.5 | | `.h4`, `.profile-name`, `.profile-title`, `.post-description`(12.5px) |
| `text-caption-sm` | 12px | 1.5 | | `text-xs`, `.h5` |
| `text-micro` | 11px | 1.6 | | `.h6`, `.h7`(10px), `.profile-sub`, `text-[11px]` |

### 2.2 이전 타이포 클래스 → 새 조합

| 이전 | 새 조합 |
| --- | --- |
| `.h3` | `text-body font-semibold leading-none tracking-tight` |
| `.h4` | `text-caption font-medium` |
| `.h5` | `text-caption-sm font-medium` |
| `.h6`, `.h7` | `text-micro font-medium` |
| `.a` | `text-label font-medium` |
| `.post-title` | `text-title font-semibold` |
| `.post-subtitle` | `text-body font-medium` |
| `.post-description` | `text-caption font-medium` |
| `.post-body` (+ `text-md`, 실제로는 `.post-body`가 이겨 15px로 렌더됨) | `text-body leading-loose` (본문 `P`) |
| `.profile-sub` | `text-micro font-medium` |
| `.profile-name` | `text-caption font-medium leading-none` |
| `.profile-title` | `text-caption font-medium` |
| `.section-heading` | 유지 (토큰 기반 `@utility`로 재작성) |

### 2.3 굵기, 행간, 자간

- 굵기: `font-normal` 400, `font-medium` 500, `font-semibold` 600, `font-bold` 700 (값은 그대로, 토큰으로 정의).
- 행간: `leading-none` 1, `leading-tight` 1.25, `leading-snug` 1.4 (이전 1.375), `leading-normal` 1.5, `leading-relaxed` 1.6 (이전 1.625), `leading-loose` 1.8 (이전 `180%`), `leading-5` → `leading-normal`.
- 자간: `tracking-tighter` -0.03em, `tracking-tight` -0.01em (`tracking-[-0.01em]`, `tracking-[-0.022em]`, `-0.375px` 대체), `tracking-wide` 0.025em.
- 폰트: `--font-sans`(Pretendard 스택), `--font-mono`(Geist Mono). `--font-display`, `--font-body`, `--font-pretendard` 별칭은 제거.

## 3. 간격

허용 단계는 Tailwind v3 기본 간격 스케일(`--spacing` = 4px의 배수)이다:
`0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48`

| 이전 | 새 값 |
| --- | --- |
| 1.25 | 1 |
| 2.25 | 2 |
| 3.25 | 3 |
| 4.25, 4.5 | 4 |
| 4.75 | 5 |
| 6.25 | 6 |
| 7.5 | 8 |
| 8.75 | 9 |
| 10.75, 11.25 | 11 |
| 15 | 16 |
| 16.25 | 16 |
| 17.5 | 16 |
| 24.25, 25 | 24 |
| 30 (`w-30`) | 28 |
| 30.5 | 32 |
| 35 | 36 |
| 36.5 (TOC top) | 36 (`toc-panel`) |
| 45.75 (프로필 카드 높이) | 48 |
| 86.5 (목록 썸네일 너비) | `w-post-thumb` (21.625rem) |
| 16.75, `pt-[2.65625rem]` (모바일 헤더) | `h-header`/`top-header`/`pt-header` (4rem), 본문 상단 `pt-10` |
| `pt-25` (태블릿 본문 상단) | `pt-24` |

이름 있는 길이: `app`(47.375rem), `sidebar`(13.125rem), `inline`(1.5rem), `header`(4rem), `post-thumb`, `grid-min`(12.5rem), `app-with-sidebar`, `app-expanded`, `divider`(0.5px), `hairline`(1px).
없는 변수를 가리키던 `max-w-(--app-width)`는 `max-w-app`으로 고친다.

## 4. 모서리, 그림자, 블러, 비율

| 이전 | 새 값 |
| --- | --- |
| `rounded` (4px) | `rounded-xs` |
| `rounded-sm` 8px, `rounded-md` 10px, `rounded-lg` 14px | 그대로 |
| `rounded-xl` (12px), `rounded-2xl` (16px) | `rounded-lg` (14px) |
| `rounded-[1px]` | `rounded-none` |
| `backdrop-blur` (8px) | `backdrop-blur-sm` |
| `backdrop-blur-[11px]` | `backdrop-blur-md` (12px) |
| `aspect-[1.8/1]` | `aspect-cover` |
| `tablet:aspect-3/1` | `tablet:aspect-hero` |
| `--shadow-inset-soft` | 미사용, 삭제 |

## 5. 모션, 레이어, 불투명도

| 이전 | 새 값 |
| --- | --- |
| `duration-150` | `duration-fast` |
| `duration-200`, `duration-250` | `duration-base` (200ms) |
| `duration-300` | `duration-slow` |
| `ease-in-out`, `ease-out` | 같은 이름 (토큰 정의) |
| `opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70`, `hover:opacity-80` | `hover-fade` |
| `transition-transform duration-150 ease-out active:scale-[0.98]` | `press` |
| `z-[var(--z-overlay)]`, `z-(--z-header)`, `z-10`, `z-9999` | `z-overlay`, `z-header`, `z-raised`, `z-tooltip` |
| `transition-[grid-template-rows,border-color] duration-200 ease-out` | `transition-collapse` |
| `grid-rows-[1fr]` / `grid-rows-[0fr]` | `grid-rows-expanded` / `grid-rows-collapsed` |

## 6. 인라인 스타일과 임의값 정리

| 위치 | 이전 | 새 방식 |
| --- | --- | --- |
| Header 오버레이 | `style={{ backgroundColor: var(--color-overlay) }}` | `bg-scrim` |
| Divider | `h-[0.03125rem]`, `style={{ background }}` | `h-divider divider-gradient` |
| Blockquote | `style={{ borderLeftWidth: '3px' }}`, 죽은 `sm:`/`md:` 클래스 | `quote-rule`, `-ml-6 pl-6` |
| ProfileGrid / ProfileCard | 상수 `PROFILE`, `ABOUT.profile` 색 필드 + 인라인 style | 클래스 (`bg-elevated`, `border-media`, `shadow-media`, ...), 색 필드 삭제 |
| ProfileGrid `Card.Content` | `gap` prop + `style={{ gap }}` | 호출처가 없어 prop 삭제 |
| ViewsWidget | `metricNumberStyle`, 인라인 색 | `text-heading-lg tracking-tight`, `bg-accent`, `text-accent-strong` |
| ActivityHeatmap | 툴팁/범례 인라인 style, `z-9999`, `text-[11px]` | `bg-inverse text-inverse shadow-popover`, `bg-heatmap-*`, `z-tooltip`, `text-micro` |
| TOC | `top-36.5`, `max-h-[calc(...)]`, `style={{ left: calc(...) }}` | `toc-panel` |
| Steps | `[counter-reset:steps]`, `before:content-[counter(steps)]` | `steps-counter`, `step-marker` |
| Alert | `grid-cols-[auto_1fr]`, `alert-*` 색 | `grid-cols-leading-icon`, `warning`/`danger` 토큰 |
| tags/categories 목록 | `grid-cols-[repeat(auto-fill,minmax(200px,1fr))]` | `grid-cols-auto-fill` |
| 404/에러 | `min-h-[calc(100dvh-14rem)]`, `text-[6.4rem]` | `min-h-status-page`, `text-display-sm tablet:text-display` |
| 레이아웃 | `tablet:max-w-[calc(app+sidebar)]` | `tablet:max-w-app-with-sidebar` |
| 프로젝트 수상 배지 | `max-w-[calc(100%-1.5rem)]` | `left-3 right-3 w-fit` |
| LazyImage 스켈레톤 | `bg-[linear-gradient(...)] bg-size-[200%_100%]` | `skeleton-shimmer` |
| 코드 블록 | 죽은 `md:` 클래스 | 삭제 (`md` 브레이크포인트가 정의돼 있지 않아 원래 적용되지 않았음) |

## 7. 아이콘 크기

`size={14|16|18|20}` → `ICON_SIZE.xs|sm|md|lg` (`src/constants/style.constants.ts`).

## 8. 제거한 것

- `src/styles/theme.css` (→ `src/styles/tokens/{primitives,semantic,theme}.css`)
- 미사용: `.ui-surface`, `.ui-surface-lg`, `.section-action-chip-strong`, `.image-wrapper`, `.video-wrapper`, `.post-image-description`, `.center-x`, `.column-center-x`, `.column-center-y`, `--shadow-inset-soft`, `--color-primary-on-dark`, `--color-gray-click`
- 이전 타이포 클래스 `.h3`–`.h7`, `.a`, `.post-*`, `.profile-*`
