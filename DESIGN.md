# 디자인 시스템

블로그 디자인 시스템의 원칙, 구조, 규칙을 정리한 문서다.
**값은 적지 않는다.** 색, 크기, 시간 같은 실제 값은 `src/styles/tokens/`에만 있고, 이 문서는
어떤 이름을 언제 쓰는지만 다룬다. 값이 궁금하면 해당 토큰 파일을 연다.

## 원칙

- 읽기가 우선이다. 본문은 넉넉한 행간을 쓰고, 한글 줄바꿈은 `word-break: keep-all`.
- 강조색은 파랑 하나뿐이다. 링크, 포커스, 방문 수처럼 "살아 있는" 정보에만 쓴다.
- 깊이는 헤어라인 테두리와 옅은 채움(`fill`)으로 만든다. 그림자는 미디어와 툴팁에만 쓴다.
- 라이트는 푸른 기가 도는 slate, 다크는 순수 회색이다. 두 테마 모두 같은 역할 이름을 쓴다.

## 구조

```
src/styles/
├── index.css            유일한 CSS 진입점 (tailwindcss → tokens → utilities → base)
├── tokens/              디자인 값의 유일한 출처
│   ├── index.css        import 순서 (reset.css가 가장 먼저)
│   ├── reset.css        Tailwind 기본 스케일 제거
│   ├── colors.css       팔레트 → 라이트/다크 역할 이름 → Tailwind 색
│   ├── typography.css   폰트, 타입 스케일, 굵기, 행간, 자간
│   ├── spacing.css      4px 단계, 레이아웃 길이, 브레이크포인트
│   ├── effects.css      모서리, 그림자, 블러, 비율, z-index
│   ├── motion.css       duration, easing, keyframes
│   ├── fonts.ts         next/font 로더
│   └── icon.ts          ICON_SIZE
├── utilities.css        토큰으로 만든 공용 @utility
└── base.css             요소 기본값과 앱 전역 스타일

src/components/
├── ui/                  도메인을 모르는 컴포넌트 (Button, Chip, Card, Pagination …)
├── features/            여러 페이지에서 쓰는 도메인 컴포넌트 (post, project, about, home, content, mdx)
├── layout/  icons/  providers/
src/app/**/_components/  한 페이지에서만 쓰는 컴포넌트
src/utils/tw-merge-util.ts  타입 스케일을 아는 twMerge
```

## 토큰 계층

각 토큰 파일은 안에서 같은 순서로 쌓는다.

```
Primitives  원시 값      --slate-900, --blue-500, --time-fast …   (컴포넌트에서 직접 쓰지 않음)
    ↓
Semantic    역할 이름    --fg-primary, --bg-surface …             (:root / .dark)
    ↓
Tailwind    클래스       text-primary, bg-surface, text-body, rounded-lg …
    ↓
utilities.css, components/ui
```

- 앱 코드는 Tailwind 클래스, `utilities.css`의 유틸리티, `components/ui`의 컴포넌트만 쓴다.
- CSS에서 값이 필요하면 역할 변수(`var(--fg-primary)`)나 `--spacing(n)`을 쓴다.
- 리터럴 값(hex, px, ms 등)은 `src/styles/tokens/` 안에만 둔다.
- `reset.css`가 Tailwind 기본 스케일을 지우므로 `bg-blue-500`, `rounded-xl`, `text-3xl` 같은 클래스는 CSS를 만들지 않는다.
- 값은 CSS 토큰이 기본이다. TS 토큰(`icon.ts`)은 JS가 숫자를 요구할 때만 두고, 같은 값을 CSS와 TS에 중복하지 않는다.

## 쓸 수 있는 이름

### 색

| 클래스 | 쓰임 |
| --- | --- |
| `text-primary` / `secondary` / `tertiary` / `muted` | 제목·본문 / 부제 / 설명·메타·아이콘 / 날짜·섹션 제목·placeholder |
| `text-inverse` + `bg-inverse` | 선택된 칩, 현재 페이지, 툴팁 |
| `text-accent`, `text-accent-strong`, `bg-accent` | 링크, 프로필 라벨, 방문 수 |
| `bg-canvas`, `bg-surface`, `bg-elevated` | 페이지 배경, 카드, 프로필 카드 |
| `bg-muted`, `bg-pressed` | 카드 hover, active |
| `bg-fill-weak`, `bg-fill`, `bg-fill-strong` | 코드 배경·버튼 hover, 스켈레톤, 선택 영역 |
| `border-default`, `border-strong`, `border-fill`, `border-elevated`, `border-media` | 헤어라인, 포커스된 입력, 링크 밑줄, 프로필 카드, 이미지 |
| `*-warning`, `*-danger` (`text`, `text-*-muted`, `bg`, `border`) | MDX `<Alert>` |
| `bg-highlight-{color}` + `text-highlight-{color}` | MDX `<Highlight>` |
| `bg-heatmap-0..4` | GitHub 기여 그래프 |

### 타이포그래피

| 클래스 | 쓰임 |
| --- | --- |
| `text-display`, `text-display-sm` | 404·에러 페이지의 큰 글자 |
| `text-title-lg`, `text-title` | 프로젝트 제목 / 글·페이지 제목 |
| `text-heading-lg`, `text-heading` | MDX h1·지표 숫자 / MDX h2·경력 항목 제목 |
| `text-body-lg`, `text-body` | MDX 목록 항목 / 글 본문(`leading-loose`)·카드 제목·버튼 라벨 |
| `text-label`, `text-caption`, `text-caption-sm`, `text-micro` | 메뉴·표·폼 / 메타 정보·작은 버튼 / 날짜·태그·코드 / 저작권 |

- 굵기 `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- 행간 `leading-none` … `leading-loose`, 자간 `tracking-tighter` … `tracking-wide`
- 글꼴 `font-sans`(Pretendard), `font-mono`(Geist Mono)

### 간격, 레이아웃, 효과, 모션

- 간격은 4px(`--spacing`)의 배수 중 허용된 단계만 쓴다. 허용 단계는 `scripts/check-tokens.mjs`의 `SPACING_STEPS`에 있다.
- 레이아웃 치수: `max-w-app`, `w-sidebar`, `px-inline`, `h-header`, `w-post-thumb`, `max-w-app-with-sidebar`, `grid-cols-auto-fill`
- 브레이크포인트: `mobile`, `tablet`, `desktop`, `wide`. Tailwind 기본 `sm`/`md`/`lg`는 없다.
- 모서리 `rounded-xs` … `rounded-lg`, `rounded-full` / 그림자 `shadow-media`, `shadow-popover` / 블러 `backdrop-blur-sm`, `backdrop-blur-md`
- 모션 `duration-fast`, `duration-base`, `duration-slow`, `ease-in-out`, `ease-out`, 그리고 `hover-fade`, `press`
- 레이어 `z-raised` < `z-overlay` < `z-header` < `z-tooltip`
- 아이콘 크기 `ICON_SIZE.xs` … `ICON_SIZE.lg`

## 컴포넌트

`components/ui`에는 데이터나 도메인을 모르고 토큰만 쓰는 컴포넌트를 둔다.
각 컴포넌트는 같은 스타일을 다른 요소에 입히는 클래스 함수도 내보낸다.
링크를 버튼처럼 보이게 할 때는 `<Link className={buttonClass(...)}>`를 쓴다.

| 컴포넌트 | 옵션 | 쓰는 곳 |
| --- | --- | --- |
| `Button` / `buttonClass` | `variant`: `outline`(기본), `ghost` / `size`: `sm`, `md`(기본), `lg` (`outline`에만 적용) | 에러 페이지, 테마 토글, 모바일 메뉴, 프로젝트 링크, 연락처, 뒤로가기·공유 |
| `Chip` / `chipClass` | `tone`: `soft`(기본), `outline`, `solid` / `size`: `sm`(기본), `md`, `lg` | 글·프로젝트 태그, 스킬 배지, 링크 멘션, MDX `<Badge>` |
| `Card` / `cardClass` | `padding`: `none`(기본), `md`, `lg` / `interactive` / `as`: `div`, `section`, `article` | 정책 페이지, 태그·카테고리 목록, 프로필 카드, 링크 임베드, MDX 표·카드·탭 |

- 클래스 합성은 `@/utils/tw-merge-util`의 `twMerge`로 한다. `tailwind-merge`를 직접 쓰면 `text-label` 같은
  타입 스케일 클래스가 색으로 오인돼 사라진다. Biome가 직접 import를 막는다.
- 새 컴포넌트는 같은 클래스 묶음이 세 곳 이상 반복될 때 만든다.

## 규칙과 검사

`pnpm check-tokens`(`scripts/check-tokens.mjs`)가 다음을 실패로 처리한다.
`pnpm check`, lint-staged, CI에서 실행된다.

1. Tailwind 임의값: `p-[13px]`, `z-(--x)`, `[counter-reset:x]`
2. CSS를 만들지 않는 클래스: 리셋된 `bg-blue-500`, 오타
3. 허용 단계 밖의 간격: `pt-4.25`
4. 숫자로 쓴 모션·레이어·불투명도: `duration-200`, `z-10`, `opacity-70`
5. 소스 안의 raw 색상: hex, `rgb()`, `hsl()`, `oklch()`
6. 인라인 스타일 객체 `style={{ … }}`
7. 숫자로 쓴 아이콘 크기 `size={16}`
8. `src/styles/` 안의 리터럴 길이·시간·색 (`tokens/` 제외)

### 예외

| 대상 | 이유 |
| --- | --- |
| `src/components/icons/*` | 브랜드 로고의 공식 색 |
| `src/components/ui/lazyImage.tsx`의 인라인 style | 이미지 크기에서 계산한 `aspect-ratio` |
| `title`, `subtitle`, `description`, `hoverable-surface`, `group` 등 | 선택자로만 쓰는 마커 클래스 |

새 예외는 `scripts/check-tokens.mjs` 상단 목록에 이유와 함께 추가하고, 이 표도 갱신한다.

### 새 값이 필요할 때

1. 기존 토큰으로 표현할 수 있는지 먼저 확인한다.
2. 없으면 해당 카테고리 파일의 Primitives 블록에 원시 값을 추가한다.
3. 테마마다 다르면 같은 파일의 Semantic 블록에서 `:root`와 `.dark` 양쪽에 역할 이름을 추가한다.
4. 같은 파일의 Tailwind 블록(`@theme`)에 이름을 등록한다. 반복되는 조합이면 `utilities.css`에 `@utility`를 만든다.
5. 새 이름이 생겼으면 이 문서의 "쓸 수 있는 이름"에 추가한다.
