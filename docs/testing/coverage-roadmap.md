# Unit Test Coverage Roadmap

이 문서는 Jest 유닛 테스트 작업을 다른 세션에서 이어가기 위한 진행 현황과 우선순위를
정리합니다. 실제 테스트 작성 규칙은 [`unit-testing.md`](./unit-testing.md)를 따르며,
커버리지 수집 대상과 기준값의 최종 기준은 `jest.config.ts`입니다.

## 현재 기준선

2026년 7월 26일, 커밋 `c25c47f` 이후 기준입니다.

- 테스트 스위트: 21개
- 테스트: 141개
- Statements: 100%
- Branches: 99.69%
- Functions: 100%
- Lines: 100%

`ViewsWidgetClient.tsx`의 중복 방문 기록 방지 가드 한 분기가 수치상 남아 있습니다. 이미
Strict Mode에서 방문 기록이 한 번만 발생하는 공개 동작을 검증하고 있으므로, 내부 Hook이나
ref를 조작해 해당 분기만 실행하는 테스트는 추가하지 않습니다.

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

### API 경계에서 분리된 유틸리티

- 링크 미리보기 URL과 DNS 주소 검증
- 사설 IPv4·IPv6 및 잘못된 IPv4-mapped IPv6 차단
- HTML Content-Type과 조회수 pathname 검증
- 조회수 배치 중복 제거, 최대 개수 제한, 결과 매핑

## 다음 우선순위

한 번에 한 묶음만 진행합니다. 각 묶음이 끝날 때 관련 파일을 `collectCoverageFrom`에 추가하고
커버리지 기준선을 갱신합니다.

### 1. 재직 기간

대상:

- `src/utils/employment-period-util.ts`
- `src/components/about/EmploymentPeriod.tsx`

검증할 공개 동작:

- 1년 미만, 정확히 1년, 1년과 남은 개월 수 표시
- 종료일이 없는 재직 기간을 고정된 기준 날짜로 계산
- 잘못된 시작일 또는 종료일이면 기간만 표시
- 종료일이 시작일보다 빠르면 음수가 아닌 `0개월` 표시
- Client Component가 초기 label을 표시하고 입력 변경 후 다시 계산

### 2. 링크 미리보기 UI

대상:

- `src/components/ui/linkEmbed.tsx`

검증할 공개 동작:

- 필요한 수동 metadata가 있으면 API를 호출하지 않고 card 또는 mention 표시
- metadata를 불러오는 동안 variant에 맞는 loading 상태 표시
- API 성공 시 제목, 설명, 이미지, hostname 표시
- API 실패 시 안전한 일반 링크로 fallback
- thumbnail 또는 favicon 로드 실패 시 깨진 이미지를 숨기고 fallback 표시
- 모든 외부 링크에 새 창과 `noopener noreferrer` 적용

`fetch`와 `next/image`만 외부 경계로 최소 mock하고, mock 호출 여부만으로 테스트를 끝내지
않습니다.

### 3. 탐색과 사용자 동작 UI

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

### 4. 순수 콘텐츠 유틸리티

대상:

- `src/utils/content-util.ts`
- `src/utils/text-util.ts`
- `src/utils/employment-period-util.ts`
- `src/utils/sitemap-util.ts`
- `src/utils/xml-util.ts`
- `src/utils/metadata-util.ts`

검증할 공개 동작:

- 빈 문자열, 문자열 배열, 날짜, URL 판별
- 원격 이미지와 로컬 cover 경로 생성
- slug 생성과 잘못 인코딩된 URL segment fallback
- 최신 게시글·프로젝트 날짜 선택과 ISO 변환
- XML escape와 CDATA 분할
- 기본 metadata와 article metadata 생성

1번에서 `employment-period-util.ts`를 완료했다면 이 묶음에서는 중복 작업하지 않습니다.

### 5. 외부 경계가 있는 서버 유틸리티

후순위 대상:

- `src/utils/views-util.ts`
- `src/utils/link-preview-request-util.ts`
- `src/utils/d1-util.ts`
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
