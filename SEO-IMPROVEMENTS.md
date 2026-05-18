# SEO 개선 작업 내역

**작업일:** 2026-05-18  
**기준 보고서:** SEO-AUDIT-REPORT.md  
**시작 점수:** 52 / 100  
**예상 점수:** 80+ / 100

---

## 변경 파일 목록

| 파일 | 내용 |
|------|------|
| `src/constants/metadata.constants.ts` | 도메인 www 제거, 사이트 설명 보강 |
| `src/app/layout.tsx` | viewport 접근성 수정, og:locale 추가 |
| `src/app/page.tsx` | 타이틀 수정, H1 추가, WebsiteJsonLd 삽입 |
| `src/app/about/page.tsx` | 타이틀/메타 설명 고유화 |
| `src/app/posts/page.tsx` | 타이틀 수정 |
| `src/app/posts/[slug]/page.tsx` | BlogPostingJsonLd, BreadcrumbJsonLd 삽입 |
| `src/app/sitemap/route.ts` | 페이지네이션 URL 제거 |
| `src/utils/metadata-util.ts` | og:locale 추가 |
| `src/components/JsonLd.tsx` | 신규 — WebsiteJsonLd, BlogPostingJsonLd, BreadcrumbJsonLd |
| `next.config.ts` | CSP, Permissions-Policy 헤더 추가 |
| `public/llms.txt` | 신규 — AI 검색 엔진용 색인 파일 |
| `src/app/posts/_articles/filmlog-01/post.mdx` | 이미지 alt 텍스트 추가 |
| `src/app/posts/_articles/filmlog-02/post.mdx` | 이미지 alt 텍스트 추가 |

---

## 항목별 상세

### Critical

**C1/C2/C3 — 도메인 canonical 통일**
- `www.toosign.me` → `toosign.me` 로 변경
- `metadata.constants.ts`의 `SITE.URL`, `SITE.PREVIEW_IMAGE` 수정
- robots.txt 사이트맵 URL, sitemap `<loc>`, canonical, OG 태그 전부 자동 반영

**C4 — BlogPosting JSON-LD**
- 블로그 포스트 전체에 구조화 데이터 추가
- 포함 필드: headline, description, datePublished, dateModified, author, publisher, image, inLanguage

---

### High

**H1 — viewport 모바일 접근성**
- `user-scalable=no`, `maximum-scale=1` 제거
- Google 모바일 유용성 테스트 통과, WCAG 2.1 SC 1.4.4 준수

**H2 — WebSite + Person JSON-LD**
- 홈페이지에 WebSite, Person 스키마 추가
- Person에 sameAs로 LinkedIn, GitHub 연결
- 지식 그래프 신호, E-E-A-T 강화

**H3 — llms.txt**
- `public/llms.txt` 신규 생성
- ChatGPT, Perplexity, Claude 등 AI 검색 엔진 색인용

**H4/M7 — 보안 헤더**
- Content-Security-Policy 추가 (Giscus, Vercel Analytics 허용)
- Permissions-Policy 추가 (카메라/마이크/위치 차단)

**H5 — 필름 로그 이미지 alt 텍스트**
- filmlog-01: 15개 이미지 alt 추가 (Pentax 17 촬영 설명)
- filmlog-02: 16개 이미지 alt 추가 (타이베이, Pentax Espio P 촬영 설명)

---

### Medium

**M1/M2/M3 — 타이틀 및 메타 설명**
- 홈: `Hyunsoo Ro`
- Posts: `Posts`
- About: `About` / 메타 설명 고유화
- 사이트 기본 설명: `QA 엔지니어 노현수의 기술 블로그. 테스팅, 자동화, 개발 경험을 기록합니다.`

**M4 — 홈페이지 H1**
- `sr-only` 클래스로 시각적으로 숨김 처리
- SEO 크롤러에는 H1 신호 제공

**M6 — 사이트맵 페이지네이션 URL 제거**
- 카테고리, 태그, 포스트 목록 페이지네이션 URL 제거
- canonical이 상위 페이지를 가리키는 중복 URL → 크롤 예산 절약

**M9 — BreadcrumbList JSON-LD**
- 포스트 페이지에 브레드크럼 스키마 추가
- 구조: Home → Posts → 포스트 제목
- 검색 결과 SERP에 경로 표시, CTR 향상

---

### Low

**L1/L5 — og:locale**
- `ko_KR` 전 페이지 추가
- `metadata-util.ts`, `layout.tsx` 적용

**L2 — Person sameAs**
- LinkedIn, GitHub 프로필 연결 (WebsiteJsonLd에 포함)

---

## 미적용 항목 (코드 외 작업)

| 항목 | 방법 |
|------|------|
| HSTS includeSubDomains + preload | Vercel 대시보드에서 설정 |
| 필름 로그 카메라/필름 정보 본문 추가 | 콘텐츠 직접 작성 |
| 포스트 수 늘리기 | 콘텐츠 직접 작성 |
