# SEO 감사 보고서: toosign.me

**작성일:** 2026-05-18  
**대상 사이트:** https://toosign.me  
**사이트 유형:** 개인 블로그 / 포트폴리오 (한국어, QA 엔지니어)  
**플랫폼:** Next.js on Vercel

---

## 종합 SEO 건강 점수: **52 / 100**

| 카테고리 | 가중치 | 점수 | 가중 점수 |
|----------|--------|------|---------|
| 기술 SEO | 22% | 38/100 | 8.4 |
| 콘텐츠 품질 | 23% | 58/100 | 13.3 |
| 온페이지 SEO | 20% | 62/100 | 12.4 |
| 스키마 / 구조화 데이터 | 10% | 0/100 | 0.0 |
| 성능 (CWV) | 10% | 65/100 | 6.5 |
| AI 검색 대응력 | 10% | 30/100 | 3.0 |
| 이미지 SEO | 5% | 45/100 | 2.3 |
| **합계** | **100%** | | **52** |

---

## 요약

### 5대 핵심 문제
1. **캐노니컬/도메인 불일치** — 모든 페이지가 `https://www.toosign.me`를 캐노니컬로 선언하지만 실제 서빙 도메인은 `https://toosign.me`(non-www)임. www는 non-www로 307 리다이렉트.
2. **구조화 데이터(JSON-LD) 전무** — 사이트 전체에 스키마 마크업이 없음. 리치 결과 불가.
3. **필름 로그 포스트 이미지 16개 alt="" 비어있음** — 사진 중심 포스트임에도 대부분 alt 텍스트 없음.
4. **`llms.txt` 없음** — ChatGPT, Perplexity, Claude 등 AI 검색 엔진의 구조적 진입점 없음.
5. **viewport가 사용자 확대 차단** (`user-scalable=no`) — Google 모바일 유용성 기준 위반, WCAG 접근성 위반.

### 5대 빠른 개선 항목
1. 캐노니컬 도메인을 non-www로 수정 (설정 1줄)
2. 블로그 포스트에 `Article` 스키마 추가
3. viewport에서 `user-scalable=no` 제거 (코드 1줄)
4. `llms.txt` 파일 추가 (정적 파일)
5. About 페이지 메타 설명 고유화

---

## 1. 기술 SEO (38/100)

### 1.1 도메인 & 캐노니컬 불일치 🔴 즉시 수정

| 항목 | 값 |
|------|-----|
| 실제 서빙 도메인 | `https://toosign.me` (non-www) |
| 모든 페이지의 캐노니컬 | `https://www.toosign.me/…` |
| `www.toosign.me` 동작 | 307 임시 리다이렉트 → `toosign.me` |
| `robots.txt` 사이트맵 URL | `https://www.toosign.me/sitemap` (307 발생) |
| 사이트맵 `<loc>` 항목 | 전부 `https://www.toosign.me/…` |

**문제:** 사이트는 `toosign.me`에서 제공되지만 모든 캐노니컬은 `www.toosign.me`를 가리킴. 구글봇이 캐노니컬을 따라가면 307 리다이렉트 루프가 발생해 인덱싱 신호가 분산됨.

**수정 방법:** Next.js 메타데이터 baseUrl에서 `www.` 제거.

```js
// 예시: metadata 설정
const siteUrl = 'https://toosign.me'; // 'www.' 제거
```

### 1.2 robots.txt 🟡 중간 우선순위

```
User-Agent: *
Allow: /
Sitemap: https://www.toosign.me/sitemap  ← 잘못된 도메인
```

- 사이트맵 URL이 `www` 도메인을 가리켜 307 리다이렉트 발생
- 사이트맵 경로가 `/sitemap.xml`이 아닌 `/sitemap` (HTML 응답)

**수정:** `Sitemap: https://toosign.me/sitemap`으로 변경

### 1.3 사이트맵 🟡 중간 우선순위

`https://toosign.me/sitemap`에 **28개 URL** 포함. 문제점:

- 모든 `<loc>`이 `www.toosign.me` 사용 (1.1과 같은 문제)
- 대부분 URL에 `<lastmod>` 없음
- 페이지네이션 URL(`/posts/p/1`, `/categories/dev/p/1`)이 포함됨 — 캐노니컬이 상위 페이지를 가리키므로 사이트맵에서 제외 권장
- `/categories`, `/tags` 인덱스 페이지가 크롤 예산 소비

### 1.4 보안 헤더 🟡 중간 우선순위

| 헤더 | 상태 | 값 |
|------|------|-----|
| `Strict-Transport-Security` | ✅ | `max-age=63072000` (includeSubDomains, preload 없음) |
| `X-Content-Type-Options` | ✅ | `nosniff` |
| `X-Frame-Options` | ✅ | `SAMEORIGIN` |
| `Referrer-Policy` | ✅ | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | ❌ | 없음 |
| `Permissions-Policy` | ❌ | 없음 |

### 1.5 캐시 설정 🔴 높은 우선순위

```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
```

정적 블로그임에도 **모든 페이지가 캐시 없이** 제공됨. Vercel 엣지 캐시도 `MISS` 상태. TTFB 및 성능에 직접 영향.

**수정:** `next.config.js`에서 정적 페이지에 `s-maxage` 설정 추가.

```js
// next.config.js
headers: async () => [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    ],
  },
]
```

### 1.6 viewport 모바일 접근성 🔴 높은 우선순위

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
```

`user-scalable=no`와 `maximum-scale=1`은:
- Google 모바일 친화성 테스트 실패
- WCAG 2.1 SC 1.4.4 위반 (텍스트 크기 조정)
- Search Console 모바일 유용성 경고 유발 가능

**수정:** `content="width=device-width, initial-scale=1"` 으로 변경

---

## 2. 콘텐츠 품질 (58/100)

### 2.1 블로그 포스트 현황

| 포스트 | 언어 | 단어 수 | H1 | 유형 |
|--------|------|---------|-----|------|
| Cloudflare D1 블로그 조회수 | 한국어 | ~2,292 | ✅ | 기술 튜토리얼 |
| ISTQB CTFL 합격 후기 | 한국어 | ~1,773 | ✅ | 경험/후기 |
| Film Log 02 | 한국어 | ~548 | ✅ | 사진 로그 |
| Film Log 01 | 한국어 | ~532 | ✅ | 사진 로그 |

현재 포스트 4개. 콘텐츠 볼륨이 적어 검색 노출 표면적이 제한적.

### 2.2 E-E-A-T 신호

- **경험(Experience):** ✅ 실제 경험 기반 포스트 (ISTQB 시험 응시, Cloudflare D1 직접 구현)
- **전문성(Expertise):** 🟡 QA 엔지니어로서 관련성 있으나 작성자 바이오 스키마 미적용
- **권위성(Authoritativeness):** 🟡 About 페이지에 LinkedIn/GitHub 링크, 경력 사항 포함 — 단, 검색 엔진이 인식할 수 있는 구조화 데이터 없음
- **신뢰성(Trustworthiness):** 🟡 HTTPS, 광고 없음, 연락처 이메일 노출 — 긍정적 신호

### 2.3 콘텐츠 깊이

- **ISTQB 포스트** (~1,773단어): "ISTQB CTFL 합격 후기" 쿼리에서 경쟁력 있는 내용. H2/H3 구조 양호.
- **Cloudflare D1 포스트** (~2,292단어): 코드 포함 기술적 깊이. 틈새 기술 쿼리에 경쟁력.
- **Film Log 포스트** (~530단어 각각): 텍스트 콘텐츠 빈약. 사진 위주 포맷은 자연스러우나 유기적 검색 노출 가능성 낮음.

### 2.4 About 페이지 문제 🟡

- `meta description`이 홈페이지와 동일 (`"노현수의 블로그입니다"`) — 중복
- 전화번호가 HTML에 평문 노출 (`+8210-8514-8477`) — 개인정보/스팸 우려
- 실제 About 콘텐츠 양은 충분하나 검색 엔진이 읽을 수 있는 구조화 마크업 없음

---

## 3. 온페이지 SEO (62/100)

### 3.1 타이틀 태그

| 페이지 | 타이틀 | 문제 |
|--------|--------|------|
| 홈 | `Hyunsoo Ro` | 너무 짧음; 키워드 없음 |
| 포스트 목록 | `Posts` | 매우 짧음; 사이트명 없음 |
| About | `About` | 매우 짧음; 키워드 없음 |
| ISTQB 포스트 | `ISTQB CTFL 합격 후기 및 공부 방법` | ✅ 양호 |
| Cloudflare D1 포스트 | `Cloudflare D1으로 블로그 조회수 기능 만들기` | ✅ 양호 |
| Film Log 포스트 | `Film Log 01`, `Film Log 02` | 설명력 부족 |

### 3.2 메타 설명

| 페이지 | 설명 | 문제 |
|--------|------|------|
| 홈 | `노현수의 블로그입니다` | 너무 짧고 모호 |
| 포스트 목록 | `글 목록을 확인할 수 있습니다.` | 일반적 |
| About | `노현수의 블로그입니다` | 홈과 동일 — 중복 |
| 카테고리/태그 | 템플릿 생성 (`X 카테고리의 글 목록입니다.`) | 기능적이지만 빈약 |
| 블로그 포스트 | 포스트별 고유 설명 | ✅ 양호 |

### 3.3 헤딩 구조

| 페이지 | H1 | 문제 |
|--------|-----|------|
| 홈페이지 | ❌ 없음 | **H1 완전 누락 — 중대한 문제** |
| 포스트 목록 | ❌ 없음 | 누락 |
| About | ✅ `About` | 있으나 너무 일반적 |
| 블로그 포스트 | ✅ 포스트 제목 | 정상 |

### 3.4 내부 링크

- 사이드바 네비게이션: Home, About, Posts
- **포스트 본문 내 내부 링크 없음** — 관련 포스트 간 연결 없음
- 카테고리/태그로 주제별 구성은 존재
- 브레드크럼 네비게이션 없음
- RSS, 사이트맵 링크 푸터에 있음 (긍정적 신호)

### 3.5 소셜 메타 태그

- ✅ OG 태그 완비 (title, description, image 1200×630, type, site_name)
- ✅ Twitter Card `summary_large_image` 적용
- ✅ 블로그 포스트에 `article:published_time`, `article:modified_time`, `article:author`, `article:tag` 포함
- ⚠️ `twitter:site`, `twitter:creator` 핸들 없음
- ⚠️ RSS 피드 링크가 `www.toosign.me` 도메인 사용 (리다이렉트 경유)

---

## 4. 스키마 / 구조화 데이터 (0/100) 🔴 즉시 수정

**사이트 전체에 JSON-LD 스키마 없음.**

| 스키마 타입 | 필요 위치 | 우선순위 |
|-------------|----------|---------|
| `WebSite` | 홈페이지 | 높음 — 사이트링크 검색창 활성화 가능 |
| `Person` | 홈 + About | 높음 — E-E-A-T, 지식 패널 |
| `BlogPosting` / `Article` | 모든 블로그 포스트 | 즉시 — 리치 결과, AI 인용 |
| `BreadcrumbList` | 모든 페이지 | 중간 — SERP 표시 개선 |

### 홈페이지 추천 스키마

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://toosign.me/#website",
      "url": "https://toosign.me",
      "name": "Hyunsoo Ro",
      "description": "노현수의 블로그",
      "inLanguage": "ko-KR"
    },
    {
      "@type": "Person",
      "@id": "https://toosign.me/#person",
      "name": "노현수",
      "alternateName": "Hyunsoo Ro",
      "url": "https://toosign.me",
      "sameAs": [
        "https://www.linkedin.com/in/hyunsooro",
        "https://github.com/toosign00"
      ],
      "jobTitle": "QA Engineer",
      "email": "hello@toosign.me"
    }
  ]
}
```

### 블로그 포스트 추천 스키마

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "포스트 제목",
  "description": "포스트 설명",
  "datePublished": "2026-01-13T00:00:00Z",
  "dateModified": "2026-01-13T00:00:00Z",
  "author": {
    "@type": "Person",
    "name": "노현수",
    "url": "https://toosign.me/about"
  },
  "publisher": {
    "@type": "Person",
    "name": "노현수",
    "url": "https://toosign.me"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://toosign.me/posts/[슬러그]"
  },
  "image": "https://toosign.me/covers/[슬러그]/cover.webp",
  "inLanguage": "ko-KR"
}
```

---

## 5. 성능 (65/100 — 추정치)

*PageSpeed API 할당량 초과로 리소스 분석 기반 추정.*

| 항목 | 값 | 평가 |
|------|-----|------|
| HTTP/2 | ✅ | 양호 |
| HTTPS | ✅ | 양호 |
| CSS | 1개 | ✅ 최소화 |
| JS 번들 | 14개 비동기 스크립트 | ⚠️ 청크 수 많음 |
| 폰트 preload | 2개 (Pretendard + Geist Mono) | ✅ 있음 |
| 이미지 포맷 | WebP (`/_next/image`) | ✅ 최적화됨 |
| Cache-Control | `no-store` | 🔴 캐시 없음 |
| Vercel 엣지 캐시 | `MISS` | ⚠️ 엣지 캐시 미활용 |
| 서버 위치 | `icn1` (서울) | ✅ 한국 독자에 유리 |

---

## 6. 이미지 SEO (45/100)

| 항목 | 내용 |
|------|------|
| Film Log 02 — alt 비어있음 | 22개 이미지 중 16개 `alt=""` |
| Film Log 01 — alt 비어있음 | 유사한 문제 |
| 블로그 포스트 커버 이미지 | ✅ 설명적 alt 텍스트 있음 |
| 이미지 포맷 | ✅ Next.js WebP 최적화 |
| OG 이미지 | ✅ 1200×630 있음 |
| 반응형 이미지 | ✅ `imageSrcSet` 정상 |

필름 로그 포스트는 사진이 콘텐츠의 핵심임에도 대부분 alt 텍스트가 비어있음. 접근성과 이미지 검색 SEO 모두 손해.

**수정 예시:**
```html
<!-- 이전 -->
<img alt="" src="...taipei-photo.webp" />

<!-- 수정 후 -->
<img alt="대만 타이베이, 펜탁스 에스피오 P로 촬영한 거리 풍경" src="...taipei-photo.webp" />
```

---

## 7. AI 검색 대응력 / GEO (30/100)

| 항목 | 상태 |
|------|------|
| `llms.txt` | ❌ 없음 (404) |
| 구조화 데이터 (AI 인용용) | ❌ 없음 |
| 작성자 엔티티 | 🟡 메타 태그에 이름 있으나 스키마 없음 |
| 문단 수준 헤딩 | 🟡 기술 포스트에는 있음 |
| AI 인용 가능 콘텐츠 | 🟡 ISTQB 포스트에 인용 가능한 사실 포함 |

**추천 `llms.txt` 내용** (`https://toosign.me/llms.txt`에 추가):

```
# Hyunsoo Ro - QA 엔지니어 블로그
> 노현수의 한국어 기술 블로그. 경기도 안산 거주 QA 엔지니어.

## 소개
- 자기소개: https://toosign.me/about
- 포스트 목록: https://toosign.me/posts

## 포스트
- ISTQB CTFL 합격 후기: https://toosign.me/posts/istqb-ctfl-pass-review
- Cloudflare D1 블로그 조회수: https://toosign.me/posts/cloudflare-d1-blog-views
- Film Log 02: https://toosign.me/posts/filmlog-02
- Film Log 01: https://toosign.me/posts/filmlog-01
```

---

## 우선순위별 액션 플랜

### 🔴 즉시 수정 (Critical)

| # | 문제 | 영향 | 작업량 |
|---|------|------|--------|
| C1 | 캐노니컬 base URL을 `www.toosign.me` → `toosign.me`로 수정 | 인덱싱 혼란, 링크 에쿼티 분산 | 낮음 (설정 1개) |
| C2 | `robots.txt` 사이트맵 URL을 non-www로 수정 | 구글봇 사이트맵 접근 | 낮음 (1줄) |
| C3 | 사이트맵 `<loc>` 전체를 non-www로 수정 | 크롤 예산, 인덱싱 | 낮음 (설정 1개) |
| C4 | 블로그 포스트 전체에 `BlogPosting` JSON-LD 추가 | 리치 결과, AI 인용, E-E-A-T | 중간 |

### 🟠 1주 이내 수정 (High)

| # | 문제 | 영향 | 작업량 |
|---|------|------|--------|
| H1 | viewport에서 `user-scalable=no, maximum-scale=1` 제거 | 모바일 유용성 실패, 접근성 위반 | 낮음 (1줄) |
| H2 | 홈페이지에 `Person` + `WebSite` JSON-LD 추가 | E-E-A-T, 지식 패널 | 낮음 |
| H3 | `llms.txt` 파일 추가 | AI 검색 가시성 | 낮음 (정적 파일) |
| H4 | 정적 페이지 캐시 설정 추가 | TTFB, 성능, Vercel 엣지 캐시 | 중간 |
| H5 | 필름 로그 포스트 이미지 alt 텍스트 추가 | 접근성, 이미지 SEO | 중간 |

### 🟡 1개월 이내 수정 (Medium)

| # | 문제 | 영향 | 작업량 |
|---|------|------|--------|
| M1 | 홈페이지 타이틀 개선 (`Hyunsoo Ro — QA 엔지니어 블로그`) | CTR, 브랜드 인지도 | 낮음 |
| M2 | 홈페이지 메타 설명 내용 보강 (현재 10자) | SERP CTR | 낮음 |
| M3 | About 페이지 메타 설명 고유화 | 중복 설명 해소 | 낮음 |
| M4 | 홈페이지에 H1 추가 | 주제 관련성 신호 | 낮음 |
| M5 | 포스트 목록 페이지에 H1 추가 | 관련성 신호 | 낮음 |
| M6 | 사이트맵에서 페이지네이션 URL 제거 | 크롤 예산 효율 | 낮음 |
| M7 | CSP, Permissions-Policy 헤더 추가 | 보안 강화 | 중간 |
| M8 | 포스트 간 내부 링크 추가 | 링크 에쿼티 흐름 | 낮음 |
| M9 | `BreadcrumbList` 스키마 추가 | SERP 표시 개선 | 중간 |

### 🔵 백로그 (Low)

| # | 문제 | 영향 | 작업량 |
|---|------|------|--------|
| L1 | 한국어 타이틀 포맷 고려 (`제목 | 노현수 블로그`) | 한국 SERP CTR | 낮음 |
| L2 | Person 스키마에 `sameAs` LinkedIn/GitHub 추가 | 지식 그래프 신호 | 낮음 |
| L3 | 전화번호 HTML 평문 노출 제거 또는 난독화 | 개인정보 보호 | 낮음 |
| L4 | HSTS에 `includeSubDomains; preload` 추가 | 보안 | 낮음 |
| L5 | `og:locale` (`ko_KR`) 추가 | 국제화 명확성 | 낮음 |
| L6 | 필름 로그에 카메라/필름 메타데이터 본문 추가 | 틈새 검색 노출 | 낮음 |
| L7 | 포스트 발행 수 늘리기 (현재 4개) | 유기적 성장 | 높은 노력 필요 |

---

## 항목별 점수 요약

```
도메인/캐노니컬:    ████░░░░░░  35/100  🔴
robots & 사이트맵:  █████░░░░░  50/100  🟡
보안 헤더:          ███████░░░  70/100  🟡
모바일 유용성:      ████░░░░░░  40/100  🔴
스키마/구조화 데이터: ░░░░░░░░░░  0/100  🔴
온페이지 메타:      ██████░░░░  62/100  🟡
콘텐츠 품질:        ██████░░░░  58/100  🟡
이미지 SEO:         █████░░░░░  45/100  🟡
AI 검색 대응력:     ███░░░░░░░  30/100  🔴
성능 (추정):        ███████░░░  65/100  🟡

종합 SEO 건강 점수: █████░░░░░  52/100
```

---

## 한 줄 총평

기반 구조는 탄탄하나 캐노니컬 도메인 불일치, 구조화 데이터 전무, 모바일 접근성 위반 세 가지가 검색 성과를 가장 크게 제한하고 있으며, 세 항목 모두 코드 변경량 대비 SEO 효과가 큰 수정 사항입니다.
