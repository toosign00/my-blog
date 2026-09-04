# Unit Test Coverage Roadmap

이 문서는 Jest 유닛 테스트 작업을 다른 세션에서 이어가기 위한 진행 현황과 우선순위를
정리합니다. 실제 테스트 작성 규칙은 [`unit-testing.md`](./unit-testing.md)를 따르며,
커버리지 수집 대상과 기준값의 최종 기준은 `jest.config.ts`입니다.

## 현재 기준선

2026년 9월 4일 기준입니다.

- 테스트 스위트: 36개
- 테스트: 307개
- Statements: 100%
- Branches: 99.81%
- Functions: 100%
- Lines: 100%

위 수치는 `jest.config.ts`의 `collectCoverageFrom` 대상 파일에 대한 값입니다. 참고로
`src/**` 전체를 수집 대상으로 삼아 측정하면 Statements 33.46%, Branches 85.33%,
Functions 55.39%입니다.

다음 두 분기는 수치상 남아 있으며, 의도적으로 덮지 않습니다.

- `ViewsWidgetClient.tsx`의 중복 방문 기록 방지 가드. Strict Mode에서 방문 기록이 한 번만
  발생하는 공개 동작을 이미 검증하고 있으므로 내부 Hook이나 ref를 조작하지 않습니다.
- `view-counter.tsx`의 같은 가드. Strict Mode 이중 실행은 테스트 파일의 첫 `render()`
  호출에서만 발생하므로, 이 분기를 덮으려면 테스트 선언 순서에 의존해야 합니다. 따라서
  테스트는 유지하되 파일을 `collectCoverageFrom`에 추가하지 않았습니다.

## 완료한 범위

### Home

- GitHub 활동 데이터 변환과 활동 히트맵
- 히트맵의 라이트·다크 테마, tooltip, 빈 데이터
- `AfterMount`의 서버 fallback과 브라우저 마운트
- 전체·게시글 조회수 표시와 조회 Hook
- 상대 시간과 날짜 처리

### Project

- 프로젝트 검색과 정렬
- 추천 프로젝트 선택
- 프로젝트 카드, 목록, 필터 초기화
- 프로젝트 섹션의 빈 상태와 결과 상태

### 공통 UI

- 이전 페이지·홈 이동 버튼
- Web Share, Clipboard, legacy 복사 fallback
- 페이지네이션 범위와 이전·다음 링크
- 게시글·프로젝트 상세 footer의 공유 URL
- 링크 미리보기 카드와 mention의 로딩·성공·실패 상태와 이미지 fallback
- MDX Tabs와 Accordion의 선택 상태와 ARIA 속성
- 목차의 활성 heading 갱신과 부드러운 스크롤

### About

- 재직 기간 계산과 클라이언트 재계산
- 연락처 복사 성공·실패 toast와 외부 링크 속성

### 순수 콘텐츠 유틸리티

- 빈 문자열, 문자열 배열, 날짜, URL 판별과 cover 경로 생성
- slug 생성과 잘못 인코딩된 URL segment fallback
- 최신 게시글·프로젝트 날짜 선택과 ISO 변환, 파싱할 수 없는 날짜 무시
- XML escape와 CDATA 분할
- 기본 metadata와 article metadata 생성

### API 경계에서 분리된 유틸리티

- 링크 미리보기 URL과 DNS 주소 검증
- 사설 IPv4·IPv6 및 잘못된 IPv4-mapped IPv6 차단
- 링크 미리보기 HTML 파싱, 본문 크기 상한, 리다이렉트 홉별 주소 재검증
- HTML Content-Type과 조회수 pathname 검증
- 조회수 배치 중복 제거, 최대 개수 제한, 결과 매핑
- D1 쿼리의 환경변수 누락, HTTP 실패, API 오류, statement 오류 처리
- 조회수 조회의 기본값과 Asia/Seoul 기준 날짜

## 다음 우선순위

한 번에 한 묶음만 진행합니다. 각 묶음이 끝날 때 관련 파일을 `collectCoverageFrom`에 추가하고
커버리지 기준선을 갱신합니다.

### 1. 탐색과 사용자 동작 UI

대상:

- `src/components/ThemeToggle/index.tsx`
- `src/components/layout/NavigateMenu.tsx`
- `src/components/ResumeBtn/index.tsx`
- `src/components/ui/lazyImage.tsx`

검증할 공개 동작:

- 현재 테마에 맞는 버튼 문구와 반대 테마로 전환
- 루트, 정확한 경로, 하위 경로에서 현재 메뉴에 `aria-current="page"` 적용
- 이력서 창 열기 성공과 popup 차단 시 오류 toast
- blur 이미지 유무에 따른 placeholder, 이미지 로드 완료, 전달받은 `onLoad` 실행

스타일 클래스 자체보다 role, label, 링크, 표시 문구와 사용자 동작을 우선 검증합니다.

### 2. 오류 경계

대상:

- `src/app/error.tsx`
- `src/app/global-error.tsx`

검증할 공개 동작:

- 오류 문구 표시와 `reset` 호출

### 3. 콘텐츠 메타데이터 검증

대상:

- `src/utils/post-util.ts`의 `validatePostMetadata`
- `src/utils/project-util.ts`의 `validateProjectMetadata`

두 함수는 현재 export되지 않아 그대로는 테스트할 수 없습니다. 진행하려면 export를 추가하거나
별도 검증 유틸리티로 분리해야 하므로, 착수 전에 변경 이유와 범위를 먼저 밝히고 승인받습니다.

검증할 공개 동작:

- 필수 필드 누락, 잘못된 날짜, 잘못된 URL, 태그 형식 오류에 대한 오류 메시지
- 여러 오류가 한 번에 보고되는지

### 4. 외부 경계가 있는 나머지 서버 유틸리티

후순위 대상:

- `src/utils/link-preview-request-util.ts`
- `src/utils/blur-util.ts`
- `src/utils/image-placeholder-util.ts`
- `src/utils/post-util.ts`
- `src/utils/project-util.ts`

진행 기준:

- Route Handler나 Server Component를 렌더링하지 않습니다.
- D1, DNS, HTTP, 파일 시스템, 이미지 처리처럼 테스트 환경 밖의 경계만 mock합니다.
- SQL 문자열이나 mock 호출만 확인하지 않고, 최종 반환값과 오류·기본값을 검증합니다.
- 파일 로딩 유틸리티는 작은 fixture로 공개 결과를 검증할 수 있을 때만 진행합니다.
- 테스트를 위해 Next.js 런타임 전체를 mock해야 한다면 Jest 대상에서 제외합니다.
- `image-placeholder-util.ts`는 `parseRemoteImageUrl`과 `isRemoteImagePlaceholder`처럼 sharp
  없이 검증 가능한 순수 로직부터 다룹니다.

## Jest에서 제외할 범위

다음 항목은 이 로드맵에서 유닛 테스트 대상으로 올리지 않습니다.

- `src/app/**/page.tsx`와 layout의 Server Component 렌더링
- `src/app/api/**/route.ts`
- sitemap, RSS, IndexNow Route Handler 자체
- 실제 서버 요청, middleware, 인증, redirect
- 브라우저 전체 흐름

위 동작은 E2E 기준 문서와 도구가 도입되기 전까지 임의로 테스트하지 않습니다. Route
Handler에서 독립된 순수 함수나 비즈니스 로직만 Jest 대상으로 선택합니다.

## 다음 세션 작업 절차

1. `docs/testing/README.md`, `unit-testing.md`, 이 문서를 읽습니다.
2. `git status --short`로 사용자 변경사항을 확인하고 테스트와 무관한 파일은 건드리지
   않습니다.
3. 위 우선순위에서 한 묶음을 선택하고 공개 동작과 성공 조건을 먼저 정합니다.
4. 대상 코드 옆에 `.test.ts` 또는 `.test.tsx`를 작성합니다.
5. 관련 테스트만 실행합니다.
6. 대상 프로덕션 파일을 `jest.config.ts`의 `collectCoverageFrom`에 추가합니다.
7. 전체 테스트와 커버리지를 실행하고, 상승한 기준값만 반영합니다.
8. 타입 검사와 변경 파일의 Biome 검사를 실행합니다.
9. 테스트와 직접 관련된 파일만 커밋합니다.

검증 명령:

```bash
pnpm test -- path/to/file.test.ts
pnpm test:coverage
pnpm type-check
pnpm exec biome check path/to/changed-file.ts path/to/changed-file.test.ts
git diff --check
```

빌드 명령은 실행하지 않습니다.
