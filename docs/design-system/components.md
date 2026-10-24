# 컴포넌트 카탈로그

각 컴포넌트가 쓰는 토큰과 변형(variant)을 정리했다. 토큰의 값과 규칙은 [`DESIGN.md`](../../DESIGN.md)에 있다.
공용 패턴(`ui-card`, `ui-button`, `ui-chip` 등)은 `src/design-system/patterns/`에 정의돼 있다.

## 공용 패턴 (`src/design-system/patterns/`)

| 유틸리티 | 구성 | 쓰는 곳 |
| --- | --- | --- |
| `ui-card` | `border-default` 헤어라인, `rounded-lg`, `bg-surface` | 카드, 표, 링크 임베드, 태그/카테고리 목록 |
| `ui-button` | 높이 `h-10`, `border-default`, `rounded-md`, `bg-surface`, 배경 전환 `duration-fast` | 메뉴 버튼, 테마 토글, 에러 페이지 버튼 |
| `ui-chip` | `border-default`, `rounded-sm`, `bg-muted` | 글 태그, 스킬 배지, 링크 멘션 |
| `section-heading` | `text-body` 600, `leading-none`, `tracking-tight`, `text-muted` | 모든 섹션 제목 |
| `section-action-chip` | 높이 `h-8`, `px-3`, `text-caption` 500, `text-muted`, hover `bg-fill-weak` | 홈 "Expand" |
| `focus-ring` | 포커스 시 `--spacing(0.5)` 두께의 `--focus-ring` | 링크·버튼 전반 |
| `hover-fade` | hover 시 불투명도 `--opacity-hover-value`(0.7), `duration-fast` | 텍스트 링크, 뒤로가기/공유 |
| `press` | 눌림 시 `--scale-press`(0.98) | 홈 프로필 카드 |
| `skeleton-shimmer` | `bg-fill-weak` ↔ `border-default` 그라데이션 애니메이션 | LazyImage 로딩 |
| `divider-gradient` | `--divider-gradient` 방사형 그라데이션 | Divider |
| `toc-panel` | 고정 위치, 본문 오른쪽 `--spacing(8)`, 너비 `--spacing(44)` | 글 목차 |
| `subtle-scrollbar` | `--length-scrollbar`, hover 시 `fg-muted` 썸 | 목차 |

## 레이아웃

| 컴포넌트 | 토큰 | 비고 |
| --- | --- | --- |
| `layout/Sidebar` | `w-sidebar`, `border-default`, `bg-canvas`, 저작권 `text-micro text-muted` | `tablet` 이상에서 표시 |
| `layout/Header` (모바일) | `h-header`, `z-header`, 메뉴 `top-header`, 오버레이 `bg-scrim backdrop-blur-md z-overlay` | `tablet` 미만에서 표시 |
| `layout/NavigateMenu` | 항목 `h-10 rounded-md text-label font-medium`, 기본 `text-tertiary`, 활성/hover `bg-fill-weak text-primary` | |
| `layout/Root` | 본문 `pt-10 tablet:pt-24 pb-16` | |
| `(default)/layout` | `max-w-app`, `tablet:max-w-app-with-sidebar tablet:pl-sidebar` | |

## 목록과 카드

| 컴포넌트 | 토큰 | 변형 |
| --- | --- | --- |
| `ui/postGrid`, `ui/postList` | 썸네일 `aspect-cover rounded-lg border-default`, 제목 `text-body font-medium`, 메타 `text-caption(-sm) text-muted` | hover `bg-muted`, active `bg-pressed` (`POST_CARD_INTERACTION_CLASS`) |
| `project/ProjectCard` | 썸네일 `aspect-cover`, 태그 `rounded-full text-caption-sm`, 수상 배지 `bg-surface backdrop-blur-sm z-raised` | hover/active는 postGrid와 같음 |
| `project/ProjectSection` | 필터 칩 `rounded-full text-label`, 입력/셀렉트 `rounded-lg border-default bg-canvas text-label` | 선택됨 `bg-inverse text-inverse`, 기본 `bg-fill text-tertiary`, 포커스 `border-strong` |
| `ProfileGrid` | `ui-card` + `bg-elevated`, 아바타 `size-24 rounded-md border-media shadow-media`, 라벨 `text-micro text-accent-strong`, 값 `text-caption` | |
| `ViewsWidget` | 라벨 `text-caption-sm text-muted`, 숫자 `text-heading-lg font-semibold`, 오늘 `text-accent-strong` + 점 `bg-accent` | |
| `ActivityHeatmap` | 셀 `--heatmap-0..4`, 범례 `bg-heatmap-*`, 툴팁 `bg-inverse text-inverse text-micro shadow-popover z-tooltip` | |
| `ui/linkEmbed` | 카드 `ui-card rounded-lg`, 제목 `text-body font-semibold`, 설명 `text-label text-tertiary` | `card`, `mention`(`ui-chip rounded-full`), 로딩(`animate-pulse bg-fill`) |
| `ui/pagination` | `size-8 rounded-full text-label` | 기본 `bg-surface border-default`, 현재 `bg-inverse text-inverse` |

## 글/프로젝트 상세

| 컴포넌트 | 토큰 |
| --- | --- |
| 글 헤더 | 커버 `aspect-cover`, 제목 `text-title font-semibold`, 부제 `text-body font-medium text-secondary`, 메타 `text-caption-sm text-muted`, 태그 `ui-chip text-caption-sm` |
| 프로젝트 헤더 | 커버 `aspect-cover tablet:aspect-hero`, 제목 `text-title-lg font-bold`, 링크 버튼 `min-w-36 rounded-md border-default hover:bg-muted` |
| `ui/backButton`, `ui/contentFooter` | `text-body font-semibold leading-none tracking-tight`, `hover-fade`, 아이콘 `ICON_SIZE.md` |
| `ui/divider` | `h-divider divider-gradient` |
| 목차 (`toc`) | `toc-panel`, 항목 `text-caption-sm`, 활성 `text-primary font-medium`, 기본 `text-muted` |

## MDX (`src/components/ui/mdx`)

| 컴포넌트 | 토큰 | 변형 |
| --- | --- | --- |
| `H1`–`H4` | `text-heading-lg`, `text-heading`, `text-body`, `font-semibold text-primary`, `mt-12 mb-6` | |
| `P` | `text-body leading-loose text-primary mt-6` | |
| `UL`/`OL`/`LI` | `gap-2 pl-5`, 항목 `text-body-lg leading-relaxed` | |
| `A` | `text-secondary` → hover `text-primary`, `underline-offset-3` | |
| `Blockquote` | `quote-rule rounded-md border-default bg-fill-weak p-4 pl-6` | |
| `Pre`/`Code` | `--shiki-token-*`, `text-caption-sm`, 인라인 코드는 `globals.css`의 `border-default bg-fill-weak rounded-xs` | |
| `Alert` | `grid-cols-leading-icon rounded-lg border px-4 py-3.5`, 제목 `text-label font-semibold`, 본문 `text-label text-tertiary` | `note`/`tip`(`bg-fill-weak border-default`), `warning`(`*-warning`), `destructive`(`*-danger`) |
| `Steps`/`Step` | `steps-counter border-l border-default pl-6`, 마커 `step-marker size-6 rounded-full border-default bg-canvas text-caption-sm` | |
| `Table` | `ui-card rounded-lg`, 헤더 `bg-fill-weak text-tertiary font-medium`, 셀 `px-4 py-2.5 text-secondary` | |
| `Highlight` | `bg-highlight-{color} text-highlight-{color} rounded-xs` | `yellow`, `blue`, `green`, `purple`, `red` |
| `Badge` | `rounded-full border px-2 py-0.5 text-caption-sm font-medium leading-normal` | `default`(`bg-inverse text-inverse`), `muted`(`bg-fill-weak text-tertiary`), `outline`(`bg-transparent text-secondary`) |
| `Card`/`CardGrid` | `rounded-lg border-default bg-fill-weak p-4`, 그리드 `gap-3 mobile:grid-cols-2` | |
| `Tabs` | 컨테이너 `rounded-lg border-default bg-fill-weak`, 탭 `rounded-lg px-3 py-1.5 text-label` | 선택됨 `bg-surface text-primary` |
| `Accordion` | 항목 `px-4 py-3 text-label font-medium`, 본문 `transition-collapse grid-rows-expanded/collapsed` | 열림 `bg-fill` |

## About

| 컴포넌트 | 토큰 |
| --- | --- |
| `ProfileCard` | `bg-elevated rounded-lg border-default`, 이미지 `size-24 tablet:size-28 border-media shadow-media`, 이름 `text-title font-bold text-accent-strong`, 다운로드 버튼 hover `bg-fill-weak` / active `bg-fill`, 구분선 `bg-fill-strong` |
| `ContactBtn` | `ui-card rounded-lg hover:bg-fill-weak`, `text-label font-medium text-secondary`, 아이콘 `ICON_SIZE.lg` |
| `TimelineSection`, `EducationSection`, `CertificateSection` | 항목 제목 `text-heading font-bold text-secondary`, 기간 `font-mono text-label text-tertiary`, 세로 구분선 `w-px h-3 bg-pressed` |
| `SkillsSection`, `SkillBadge` | `ui-chip px-3 py-2 text-label font-medium text-secondary`, 아이콘 `ICON_SIZE.lg` |

## 에러 페이지

| 컴포넌트 | 토큰 |
| --- | --- |
| `not-found`, `error`, `global-error` | `min-h-status-page`, `text-display-sm tablet:text-display`, 제목 `text-body font-semibold`, 버튼 `ui-button text-caption font-medium min-w-20` |
