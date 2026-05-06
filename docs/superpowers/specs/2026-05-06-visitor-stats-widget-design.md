# Visitor Stats Widget — Design Spec

**Date:** 2026-05-06
**Status:** Approved (brainstorming)

---

## Overview

홈 페이지의 Activity 섹션(Profile 옆 카드)을 제거하고, 방문자 통계 위젯으로 교체한다.
위젯은 **오늘 방문자 수 / 전체 방문자 수 / 포스트 수** 3가지 숫자를 보여준다.

---

## UI

**선택된 디자인: D (Action Blue 포인트형)**

- 카드 크기: `h-45.75` (183px) × 전체 너비 — 기존 Activity 카드와 동일
- 레이아웃: 세로 리스트, hairline divider로 항목 구분
- Today 숫자만 `#2997ff` (Sky Link Blue)로 강조, 나머지는 흰색
- Today 앞에 `#0066cc` (Action Blue) 점(dot) 인디케이터
- 숫자 진입 시 카운팅 애니메이션 (count-up)
- DESIGN.md 기준: SF Pro 폰트, near-black surface, hairline divider

---

## 데이터

### 저장소: Cloudflare D1 (SQLite)

이미 Cloudflare를 도메인/저장소로 사용 중이므로 추가 계정 없이 활용.

### 테이블 스키마

```sql
CREATE TABLE IF NOT EXISTS page_views (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  date      TEXT NOT NULL,        -- 'YYYY-MM-DD' (UTC)
  pathname  TEXT NOT NULL,        -- '/' or '/posts/xxx'
  count     INTEGER NOT NULL DEFAULT 0,
  UNIQUE(date, pathname)
);
```

### 집계 쿼리

```sql
-- 오늘 방문자 (홈 기준)
SELECT COALESCE(SUM(count), 0) FROM page_views
WHERE date = '2026-05-06';

-- 전체 방문자
SELECT COALESCE(SUM(count), 0) FROM page_views;
```

### 포스트 수

D1이 아닌 기존 `getAllPosts()` 유틸로 빌드 타임에 가져옴. DB 불필요.

---

## 아키텍처

```
브라우저 로드
  → Client Component (StatsWidget)
      → 마운트 시 GET /api/stats 호출 (방문자 수 읽기)
      → 마운트 시 POST /api/stats 호출 (오늘 카운트 +1)

Next.js API Routes
  GET  /api/stats  → D1에서 today/total 읽어서 반환
  POST /api/stats  → D1에 오늘 날짜 pathname=/ count+1 upsert

Cloudflare D1
  → REST API로 호출 (fetch + Authorization 헤더)
  → Workers 불필요, Vercel에서 직접 HTTP 호출
```

### D1 REST API 호출 방식

Cloudflare D1은 Workers 없이도 REST API로 직접 쿼리 가능:

```
POST https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query
Authorization: Bearer {CLOUDFLARE_API_TOKEN}
Content-Type: application/json

{ "sql": "...", "params": [...] }
```

---

## 환경 변수

```
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_DATABASE_ID=
CLOUDFLARE_API_TOKEN=        # D1 read+write 권한
```

---

## 컴포넌트 구조

```
src/
  app/
    api/
      stats/
        route.ts             # GET (읽기) + POST (카운트 증가)
  components/
    StatsWidget/
      index.tsx              # 서버 컴포넌트 — 포스트 수 가져와서 Client에 전달
      Client.tsx             # 클라이언트 컴포넌트 — API 호출, 카운팅 애니메이션
  utils/
    d1-util.ts               # D1 REST API 호출 헬퍼
```

---

## 구현 단계

### Step 1 — Cloudflare D1 세팅
1. Cloudflare 대시보드에서 D1 데이터베이스 생성
2. `page_views` 테이블 생성 (SQL 직접 실행)
3. API Token 발급 (D1 read + write 권한)
4. Account ID, Database ID, API Token 확인

### Step 2 — 환경 변수 등록
1. `.env.local`에 3개 환경 변수 추가
2. Vercel 대시보드 Environment Variables에도 동일하게 추가

### Step 3 — D1 유틸 작성
- `src/utils/d1-util.ts` — `queryD1(sql, params)` 헬퍼 함수

### Step 4 — API Route 작성
- `GET /api/stats` — today/total 읽기
- `POST /api/stats` — 오늘 count upsert (`INSERT ... ON CONFLICT DO UPDATE`)

### Step 5 — 컴포넌트 작성
- `StatsWidget/Client.tsx` — GET으로 숫자 fetch, POST로 카운트 증가, 카운팅 애니메이션
- `StatsWidget/index.tsx` — `getAllPosts()`로 포스트 수 가져와서 Client에 props로 전달

### Step 6 — ProfileGrid에 연결
- `ProfileGrid/index.tsx`에서 `RecentActivity` 제거, `StatsWidget` 교체
- `github-activity-util.ts` 관련 import 제거

### Step 7 — 검증
- 로컬에서 실제 D1 REST API 호출 확인
- 새로고침마다 Today 카운트 증가 확인
- Vercel 배포 후 환경 변수 동작 확인

---

## 고려 사항

- **봇 트래픽**: 별도 필터링 없음. 규모가 작은 블로그 수준에서는 무시.
- **중복 카운트**: 새로고침마다 +1. IP 기반 중복 제거는 하지 않음 (개인 블로그 수준).
- **D1 REST API 한도**: 무료 플랜 쓰기 10만/일, 읽기 500만/일 — 충분.
- **revalidate**: StatsWidget은 Client Component라 매 방문마다 최신 데이터 노출.
- **포스트 수**: 빌드 타임 정적 데이터라 DB 불필요.
