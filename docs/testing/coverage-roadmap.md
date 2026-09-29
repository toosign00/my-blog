# Unit Test Coverage Roadmap

이 문서는 Jest 유닛 테스트 작업을 다른 세션에서 이어가기 위한 진행 현황과 우선순위를
정리합니다. 실제 테스트 작성 규칙은 [`unit-testing.md`](./unit-testing.md)를 따르며,
커버리지 수집 대상과 기준값의 최종 기준은 `jest.config.ts`입니다.

## 현재 기준선

2026년 9월 30일, 원격 main의 테스트와 로컬 UI·서버 연동 테스트를 통합한 기준입니다.

- 테스트 스위트: 46개
- 테스트: 399개
- 커버리지 수집 대상: 48개 파일 (프로젝트 전체 커버리지가 아님)
- Statements: 100%
- Branches: 99.87%
- Functions: 100%
- Lines: 100%

`ViewsWidgetClient.tsx`의 중복 방문 기록 방지 가드 한 분기가 수치상 남아 있습니다. 이미
Strict Mode에서 방문 기록이 한 번만 발생하는 공개 동작을 검증하고 있으므로, 내부 Hook이나
ref를 조작해 해당 분기만 실행하는 테스트는 추가하지 않습니다.

## 완료한 범위

원격 main에서 추가한 링크 미리보기 비즈니스 로직의 순수 테스트, ViewCounter 테스트,
활동 히트맵 fallback 검증과 잘못된 sitemap 날짜 회귀 테스트를 함께 유지합니다.
동일 파일에 중복 작성된 테스트는 로컬 확장 테스트를 기준으로 통합했습니다.

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

아래 묶음은 완료한 작업 기록입니다. 각 묶음이 끝날 때 관련 파일을 `collectCoverageFrom`에 추가하고
커버리지 기준선을 갱신합니다.

### 1. 재직 기간 — 완료

16개 테스트를 추가했고, 아래 두 파일의 Statements, Branches, Functions, Lines가 모두
100%입니다. 커버리지 수집 대상에 두 파일을 추가했습니다.

대상:

- `src/utils/employment-period-util.ts`
- `src/components/about/EmploymentPeriod.tsx`

검증할 공개 동작:

- 1년 미만, 정확히 1년, 1년과 남은 개월 수 표시
- 종료일이 없는 재직 기간을 고정된 기준 날짜로 계산
- 잘못된 시작일 또는 종료일이면 기간만 표시
- 종료일이 시작일보다 빠르면 음수가 아닌 `0개월` 표시
- Client Component가 초기 label을 표시하고 입력 변경 후 다시 계산

### 2. 링크 미리보기 UI — 완료

12개 테스트를 추가했고 Statements, Branches, Functions, Lines가 모두 100%입니다.
수동 metadata, 로딩 후 표시, API 오류 fallback, 이미지 오류와 외부 링크 속성을 검증했습니다.
로딩 skeleton은 접근 가능한 문구가 없어 CSS 구조 대신 완료 전 링크가 없는 동작을 검증합니다.
다음 묶음인 3번 탐색과 사용자 동작 UI도 완료했습니다.

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

### 3. 탐색과 사용자 동작 UI — 완료

테스트 17개를 추가했고 전체 28개 스위트, 186개 테스트가 통과했습니다.
타입 검사와 변경 파일의 Biome 검사도 통과했습니다.
네 파일을 커버리지 수집 대상에 추가한 결과 Statements, Functions, Lines는 100%,
Branches는 99.75%입니다. 분기 기준도 99.75%로 높였으며 커버리지 검증을 통과했습니다.

네 대상 파일 모두 모든 지표가 100%입니다.
ResumeDownloadButton은 사용자 승인 후 동기 window.open 전후에 설정·해제되던 로딩 상태와
표시 코드를 정리했습니다. 새 창 열기, 실패 알림, 재시도와 disabled 동작은 유지합니다.
다음 묶음인 4번 순수 콘텐츠 유틸리티도 완료했습니다.

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

### 4. 순수 콘텐츠 유틸리티 — 완료

재직 기간 유틸리티를 제외한 다섯 파일에 테스트 60개를 추가했습니다.
각 파일의 Statements, Branches, Functions, Lines가 모두 100%입니다.
전체 246개 테스트와 타입·정적 검사가 통과했고 전역 분기 기준을 99.77%로 높였습니다.
프로덕션 코드 변경은 없습니다. 다음 묶음인 5번 서버 유틸리티도 완료했습니다.

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

### 5. 외부 경계가 있는 서버 유틸리티 — 완료

아래 일곱 파일에 테스트 106개를 추가했습니다. 각 파일의 Statements, Branches,
Functions, Lines가 모두 100%입니다. 전체 352개 테스트와 타입·정적 검사가 통과했습니다.
전역 분기 기준은 99.85%로 높였습니다. 이번 묶음의 프로덕션 코드 변경은 없습니다.

검증한 공개 동작:

- D1 환경 설정, 쿼리 파라미터, 응답·빈 결과·HTTP/API 오류
- 서울 날짜 경계, 페이지·사이트 조회수와 배치 조회 결과
- HTTP/HTTPS IP 고정, Host와 SNI, 응답 스트림·헤더·본문 없는 상태·취소와 전송 실패
- 로컬·원격 이미지 로딩, blur 옵션, 이미지 처리 오류
- 이미지 KV 캐시 적중·누락·손상·읽기/쓰기 실패와 미설정, 이미지 생성 실패
- 게시글·프로젝트 메타데이터 검증, 누락 파일, 정렬, cover/hero fallback, 목차 추출

HTTP, 파일 시스템, sharp 경계만 대체하며 실제 외부 요청은 하지 않습니다.
콘텐츠 모듈은 기존 MDX 경로를 테스트용 metadata와 content로 대체합니다.
실제 MDX 컴파일·렌더링과 React 서버 캐시 동작은 이 테스트 범위에 포함되지 않습니다.

완료 대상:

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

### 6. 남은 사용자 동작 UI — 완료

17개 테스트를 추가했습니다. 아래 다섯 파일의 모든 커버리지 지표는 100%이며,
프로덕션 컴포넌트 변경 없이 공개 동작을 검증합니다.

- MDX Tabs/Accordion: 기본 선택, 키보드 활성화, 패널 연결, 접기·펼치기, 빈 항목
- ContactButtons: 전화·메일 복사, 권한 오류 알림, 외부 링크
- Toc: 표시 중인 제목 강조, 클릭 스크롤, 누락된 제목, observer 해제
- ErrorPage/GlobalErrorPage: 재시도, 홈 링크, 내부 오류 내용 비노출

### 7. 브라우저·서버 연동 — 완료

`e2e/`의 Chromium 테스트 15개가 통과했습니다. 다음 경계를 검증하며 실행 방법과 격리 규칙은
[`e2e-testing.md`](./e2e-testing.md)를 따릅니다.

- 실제 게시글 목록 → MDX 상세 → 목록 이동, canonical과 구조화 데이터
- 테마 변경과 새로고침 후 유지, 프로젝트 상세, 404
- Giscus 스크립트 연결, 테마 메시지·대상 origin, 중복 iframe 방지와 이동 후 제거
- RSS·사이트맵 XML 파싱, IndexNow 키, 로컬 이미지 최적화
- 링크 미리보기 metadata, 상대 리다이렉트, 사설 주소·반복 리다이렉트 차단,
  HTML 유형·크기 제한, 외부 서버 오류
- 조회수 단건·배치·전체 조회, 잘못된 경로, 쿠키, 기록·중복 방지, 외부 서버 실패

실제 Cloudflare DB의 SQL 실행·동시성, Giscus 서비스 자체, 배포 환경·CDN은 대체 응답을
사용하는 이번 테스트 범위 밖입니다. 단순 정적 레이아웃·아이콘을 수치만 높이기 위해
Jest에 추가하지 않습니다.

## Jest에서 제외할 범위

다음 항목은 이 로드맵에서 유닛 테스트 대상으로 올리지 않습니다.

- `src/app/**/page.tsx`와 layout의 Server Component 렌더링
- `src/app/api/**/route.ts`
- sitemap, RSS, IndexNow Route Handler 자체
- 실제 서버 요청, middleware, 인증, redirect
- 브라우저 전체 흐름

위 동작은 Playwright로 검증합니다. Route Handler에서 독립된 순수 함수나 비즈니스
로직만 Jest 대상으로 선택합니다.

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
