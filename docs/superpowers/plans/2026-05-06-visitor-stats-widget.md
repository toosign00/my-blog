# Visitor Stats Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈 페이지 Activity 섹션을 제거하고 오늘 방문자 / 전체 방문자 / 포스트 수를 보여주는 통계 위젯으로 교체한다.

**Architecture:** 서버 컴포넌트(`StatsWidget/index.tsx`)가 포스트 수를 빌드 타임에 가져와 클라이언트 컴포넌트(`StatsWidget/Client.tsx`)에 전달한다. 클라이언트는 마운트 시 `/api/stats`로 GET(읽기) + POST(카운트 증가)를 병렬 호출한다. 방문자 수는 Cloudflare D1에 날짜별로 저장되며, Vercel에서 D1 REST API를 직접 fetch로 호출한다.

**Tech Stack:** Next.js 16 App Router, TypeScript, Cloudflare D1 REST API, Tailwind CSS v4

---

## File Map

| 파일 | 역할 |
|------|------|
| `src/utils/d1-util.ts` | 신규 — D1 REST API 호출 헬퍼 |
| `src/app/api/stats/route.ts` | 신규 — GET(읽기) / POST(upsert) |
| `src/components/StatsWidget/index.tsx` | 신규 — 서버 컴포넌트, 포스트 수 전달 |
| `src/components/StatsWidget/Client.tsx` | 신규 — 클라이언트 컴포넌트, 카운팅 애니메이션 |
| `src/components/ProfileGrid/index.tsx` | 수정 — RecentActivity → StatsWidget 교체 |
| `.env.local` | 수정 — Cloudflare 환경 변수 3개 추가 |

삭제 대상 (교체 후 미사용):
- `src/components/RecentActivity/` (디렉토리 전체)
- `src/utils/github-activity-util.ts`
- `src/app/api/github/route.ts`

---

## Task 1: Cloudflare D1 세팅 (수동 작업)

> 이 태스크는 Cloudflare 대시보드에서 직접 진행한다. 코드 작업 없음.

**Files:** 없음

- [ ] **Step 1: D1 데이터베이스 생성**

  Cloudflare 대시보드 → Workers & Pages → D1 → Create database
  - Name: `blog-stats` (아무 이름이나 가능)
  - 생성 후 **Database ID** 복사해둘 것

- [ ] **Step 2: 테이블 생성**

  D1 대시보드 → Console 탭에서 아래 SQL 실행:

  ```sql
  CREATE TABLE IF NOT EXISTS page_views (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    date     TEXT NOT NULL,
    pathname TEXT NOT NULL,
    count    INTEGER NOT NULL DEFAULT 0,
    UNIQUE(date, pathname)
  );
  ```

  실행 후 Tables 탭에서 `page_views` 확인

- [ ] **Step 3: API Token 발급**

  Cloudflare 대시보드 → My Profile → API Tokens → Create Token
  - "Create Custom Token" 선택
  - Permissions: `Account` → `D1` → `Edit`
  - Account Resources: 본인 계정 선택
  - 생성 후 **Token 값** 복사 (다시 볼 수 없음)

- [ ] **Step 4: Account ID 확인**

  Cloudflare 대시보드 → 우측 사이드바 → Account ID 복사

- [ ] **Step 5: 값 3개 메모**

  ```
  CLOUDFLARE_ACCOUNT_ID=<Account ID>
  CLOUDFLARE_D1_DATABASE_ID=<Database ID>
  CLOUDFLARE_API_TOKEN=<API Token>
  ```

---

## Task 2: 환경 변수 등록

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: .env.local에 추가**

  `.env.local` 파일에 아래 3줄 추가 (기존 내용 유지):

  ```
  CLOUDFLARE_ACCOUNT_ID=여기에_account_id
  CLOUDFLARE_D1_DATABASE_ID=여기에_database_id
  CLOUDFLARE_API_TOKEN=여기에_api_token
  ```

- [ ] **Step 2: .env.local이 .gitignore에 있는지 확인**

  ```bash
  grep ".env.local" .gitignore
  ```

  Expected: `.env.local` 한 줄이 출력됨. 없으면 추가:
  ```bash
  echo ".env.local" >> .gitignore
  ```

- [ ] **Step 3: Vercel 환경 변수 등록 (배포용)**

  Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
  - `CLOUDFLARE_ACCOUNT_ID` 추가
  - `CLOUDFLARE_D1_DATABASE_ID` 추가
  - `CLOUDFLARE_API_TOKEN` 추가
  - Environment: Production + Preview + Development 모두 체크

---

## Task 3: D1 유틸 작성

**Files:**
- Create: `src/utils/d1-util.ts`

- [ ] **Step 1: 파일 생성**

  `src/utils/d1-util.ts`:

  ```typescript
  interface D1Result<T = Record<string, unknown>> {
    results: T[];
    success: boolean;
    errors: { message: string }[];
  }

  export async function queryD1<T = Record<string, unknown>>(
    sql: string,
    params: (string | number)[] = []
  ): Promise<T[]> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !databaseId || !apiToken) {
      throw new Error('Missing Cloudflare D1 environment variables');
    }

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      }
    );

    if (!res.ok) {
      throw new Error(`D1 request failed: ${res.status}`);
    }

    const data = (await res.json()) as D1Result<T>;

    if (!data.success) {
      throw new Error(`D1 query error: ${data.errors.map((e) => e.message).join(', ')}`);
    }

    return data.results;
  }
  ```

- [ ] **Step 2: 타입 체크**

  ```bash
  pnpm type-check
  ```

  Expected: 에러 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/utils/d1-util.ts
  git commit -m "feat: add Cloudflare D1 REST API helper"
  ```

---

## Task 4: API Route 작성

**Files:**
- Create: `src/app/api/stats/route.ts`

- [ ] **Step 1: 파일 생성**

  `src/app/api/stats/route.ts`:

  ```typescript
  import { NextResponse } from 'next/server';
  import { queryD1 } from '@/utils/d1-util';

  interface CountRow {
    total: number;
  }

  export async function GET() {
    try {
      const today = new Date().toISOString().slice(0, 10);

      const [todayRows, totalRows] = await Promise.all([
        queryD1<CountRow>(
          'SELECT COALESCE(SUM(count), 0) as total FROM page_views WHERE date = ?',
          [today]
        ),
        queryD1<CountRow>(
          'SELECT COALESCE(SUM(count), 0) as total FROM page_views',
          []
        ),
      ]);

      return NextResponse.json({
        today: todayRows[0]?.total ?? 0,
        total: totalRows[0]?.total ?? 0,
      });
    } catch {
      return NextResponse.json({ today: 0, total: 0 }, { status: 500 });
    }
  }

  export async function POST() {
    try {
      const today = new Date().toISOString().slice(0, 10);

      await queryD1(
        `INSERT INTO page_views (date, pathname, count)
         VALUES (?, '/', 1)
         ON CONFLICT(date, pathname) DO UPDATE SET count = count + 1`,
        [today]
      );

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }
  ```

- [ ] **Step 2: 타입 체크**

  ```bash
  pnpm type-check
  ```

  Expected: 에러 없음

- [ ] **Step 3: 로컬에서 GET 동작 확인**

  개발 서버 실행 후:

  ```bash
  curl http://localhost:3000/api/stats
  ```

  Expected: `{"today":0,"total":0}` (D1 환경 변수가 설정돼 있으면 실제 값)

- [ ] **Step 4: 커밋**

  ```bash
  git add src/app/api/stats/route.ts
  git commit -m "feat: add /api/stats GET and POST route"
  ```

---

## Task 5: StatsWidget 클라이언트 컴포넌트 작성

**Files:**
- Create: `src/components/StatsWidget/Client.tsx`

- [ ] **Step 1: 파일 생성**

  `src/components/StatsWidget/Client.tsx`:

  ```typescript
  'use client';

  import { useEffect, useRef, useState } from 'react';

  interface StatsWidgetClientProps {
    postCount: number;
  }

  interface Stats {
    today: number;
    total: number;
  }

  function useCountUp(target: number, duration = 1200) {
    const [value, setValue] = useState(0);

    useEffect(() => {
      if (target === 0) return;
      let start = 0;
      const step = Math.ceil(target / (duration / 16));
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        setValue(start);
        if (start >= target) clearInterval(timer);
      }, 16);
      return () => clearInterval(timer);
    }, [target, duration]);

    return value;
  }

  export const StatsWidgetClient = ({ postCount }: StatsWidgetClientProps) => {
    const [stats, setStats] = useState<Stats>({ today: 0, total: 0 });
    const hasCounted = useRef(false);

    useEffect(() => {
      if (hasCounted.current) return;
      hasCounted.current = true;

      void Promise.all([
        fetch('/api/stats').then((r) => r.json() as Promise<Stats>),
        fetch('/api/stats', { method: 'POST' }),
      ]).then(([data]) => {
        setStats(data);
      });
    }, []);

    const todayCount = useCountUp(stats.today);
    const totalCount = useCountUp(stats.total);
    const postCountAnimated = useCountUp(postCount, 800);

    return (
      <div className='flex h-full w-full flex-col justify-center px-5 py-5'>
        <div className='flex items-baseline justify-between border-b border-border py-3'>
          <div className='flex items-center gap-2'>
            <div className='h-1.5 w-1.5 rounded-full bg-[#0066cc]' />
            <span className='text-xs text-gray-light'>Today</span>
          </div>
          <span
            className='font-semibold tabular-nums'
            style={{ color: '#2997ff', fontSize: '20px', letterSpacing: '-0.374px' }}
          >
            {todayCount.toLocaleString()}
          </span>
        </div>

        <div className='flex items-baseline justify-between border-b border-border py-3'>
          <span className='text-xs text-gray-light'>Total Visitors</span>
          <span
            className='font-semibold tabular-nums text-foreground'
            style={{ fontSize: '20px', letterSpacing: '-0.374px' }}
          >
            {totalCount.toLocaleString()}
          </span>
        </div>

        <div className='flex items-baseline justify-between py-3'>
          <span className='text-xs text-gray-light'>Posts</span>
          <span
            className='font-semibold tabular-nums text-foreground'
            style={{ fontSize: '20px', letterSpacing: '-0.374px' }}
          >
            {postCountAnimated.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };
  ```

- [ ] **Step 2: 타입 체크**

  ```bash
  pnpm type-check
  ```

  Expected: 에러 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/StatsWidget/Client.tsx
  git commit -m "feat: add StatsWidget client component with count-up animation"
  ```

---

## Task 6: StatsWidget 서버 컴포넌트 작성

**Files:**
- Create: `src/components/StatsWidget/index.tsx`

- [ ] **Step 1: 파일 생성**

  `src/components/StatsWidget/index.tsx`:

  ```typescript
  import { getAllPosts } from '@/utils/post-util';
  import { StatsWidgetClient } from './Client';

  export const StatsWidget = async () => {
    const posts = await getAllPosts();
    return <StatsWidgetClient postCount={posts.length} />;
  };
  ```

- [ ] **Step 2: 타입 체크**

  ```bash
  pnpm type-check
  ```

  Expected: 에러 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/StatsWidget/index.tsx
  git commit -m "feat: add StatsWidget server component"
  ```

---

## Task 7: ProfileGrid 교체

**Files:**
- Modify: `src/components/ProfileGrid/index.tsx`

- [ ] **Step 1: ProfileGrid 수정**

  `src/components/ProfileGrid/index.tsx`에서:
  1. `fetchRecentGitHubActivities` import 제거
  2. `ActivityItem` type import 제거
  3. `RecentActivity` import 제거, `StatsWidget` import 추가
  4. `activities` 관련 로직 제거
  5. `<RecentActivity initialActivities={activities} />` → `<StatsWidget />` 교체
  6. `h3` 텍스트 `"Activity"` → `"Stats"` 변경

  수정 후 전체 파일:

  ```typescript
  import Image from 'next/image';
  import { METADATA } from '@/constants/metadata.constants';
  import { PROFILE } from '@/constants/profile.constants';
  import { createBlur } from '@/utils/blur-util';
  import { StatsWidget } from '../StatsWidget';
  import Card from './Card';

  const authorProfileDetails = [
    {
      title: 'Studying',
      content: METADATA.AUTHOR.STUDYING.replace(/,\s+/g, '\n'),
    },
    {
      title: 'Location',
      content: METADATA.AUTHOR.LOCATION,
    },
  ] as const;

  export const ProfileGrid = async () => {
    const blurDataURL = await createBlur(METADATA.AUTHOR.PROFILE_IMAGE);

    return (
      <section
        aria-label={`${METADATA.AUTHOR.NAME}'s profile and stats`}
        className='grid w-full grid-cols-1 gap-16.25 tablet:grid-cols-2'
      >
        <div className='column w-full'>
          <h3 className='h3 text-gray-light' id='profile-heading'>
            Profile
          </h3>
          <Card.Root style={{ backgroundColor: PROFILE.cardBackgroundColor }}>
            <Card.Content>
              <fieldset
                aria-labelledby='profile-heading'
                className='column m-0 items-start gap-3 self-start border-0 p-0'
              >
                <div
                  className='relative h-24.25 w-24.25 select-none overflow-hidden rounded-md border'
                  style={{
                    borderColor: PROFILE.profileImageBorderColor,
                    boxShadow: `0px 10px 39px ${PROFILE.profileImageShadowColor}`,
                    filter: PROFILE.profileImageFilter,
                  }}
                >
                  <Image
                    alt={`${METADATA.AUTHOR.NAME} profile image`}
                    blurDataURL={blurDataURL}
                    className='h-full w-full rounded-none border-0 object-cover'
                    draggable={false}
                    fill
                    placeholder='blur'
                    priority
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    src={PROFILE.profileImage}
                  />
                </div>

                <p
                  className='profile-name w-full text-center'
                  style={{ color: PROFILE.authorTextColor }}
                >
                  {METADATA.AUTHOR.NAME}
                </p>
              </fieldset>

              <dl className='row-between h-3/4 flex-col items-start'>
                {authorProfileDetails.map((item) => (
                  <div className='w-full' key={item.title}>
                    <dt className='profile-sub w-full' style={{ color: PROFILE.titleTextColor }}>
                      {item.title}
                    </dt>
                    <dd
                      className='profile-title whitespace-pre-wrap'
                      style={{ color: PROFILE.contentTextColor }}
                    >
                      {item.content}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card.Content>
          </Card.Root>
        </div>

        <div className='column w-full'>
          <h3 className='h3 text-gray-light'>Stats</h3>
          <Card.Root>
            <StatsWidget />
          </Card.Root>
        </div>
      </section>
    );
  };
  ```

- [ ] **Step 2: 타입 체크**

  ```bash
  pnpm type-check
  ```

  Expected: 에러 없음

- [ ] **Step 3: 개발 서버에서 시각적으로 확인**

  ```bash
  pnpm dev
  ```

  브라우저에서 `http://localhost:3000` 열어서:
  - Profile 카드 옆에 Stats 카드 보이는지 확인
  - Today / Total Visitors / Posts 세 줄 보이는지 확인
  - Today 숫자가 `#2997ff` 파란색인지 확인
  - 카운팅 애니메이션 동작하는지 확인
  - 새로고침 시 Today 숫자 증가하는지 확인 (D1 연결된 경우)

- [ ] **Step 4: 커밋**

  ```bash
  git add src/components/ProfileGrid/index.tsx
  git commit -m "feat: replace RecentActivity with StatsWidget in ProfileGrid"
  ```

---

## Task 8: 미사용 파일 제거

**Files:**
- Delete: `src/components/RecentActivity/` (디렉토리 전체)
- Delete: `src/utils/github-activity-util.ts`
- Delete: `src/app/api/github/route.ts`

- [ ] **Step 1: 파일 삭제**

  ```bash
  rm -rf src/components/RecentActivity
  rm src/utils/github-activity-util.ts
  rm src/app/api/github/route.ts
  ```

- [ ] **Step 2: 타입 체크 — 잔여 import 없는지 확인**

  ```bash
  pnpm type-check
  ```

  Expected: 에러 없음. 에러가 있으면 해당 파일에서 삭제된 모듈 import를 제거한다.

- [ ] **Step 3: 커밋**

  ```bash
  git add -A
  git commit -m "chore: remove RecentActivity and github-activity-util"
  ```

---

## Task 9: 최종 검증

- [ ] **Step 1: 전체 빌드 통과 확인**

  ```bash
  pnpm build
  ```

  Expected: 에러 없이 빌드 완료

- [ ] **Step 2: 브라우저에서 최종 확인**

  `http://localhost:3000` 에서:
  - Stats 카드 크기가 Profile 카드와 동일한지 (183px)
  - Today / Total Visitors / Posts 항목 순서 확인
  - Today 파란색 dot + 파란 숫자 확인
  - 카운팅 애니메이션 확인
  - D1 연결 시 새로고침마다 Today +1 확인

- [ ] **Step 3: Vercel 배포**

  ```bash
  git push origin develop
  ```

  Vercel 대시보드에서 배포 완료 후 실제 도메인에서 동작 확인
