# Cloudflare Workers Migration Design

## 목표

Vercel에 배포된 Next.js 블로그를 Cloudflare Workers로 이전한다. DNS, CDN, WAF,
R2, KV, D1, Images, Web Analytics를 Cloudflare에서 통합하고
`www.toosign.me`의 DNS-only 외부 CNAME을 제거한다.

마이그레이션은 배포 플랫폼 변경과 데이터 접근 방식 변경을 분리한다. 1차에서는
기존 기능을 Workers에서 동일하게 재현하고, 안정화 후 2차에서 D1과 KV를 네이티브
바인딩으로 전환한다.

## 결정 사항

- 배포 대상은 Cloudflare Pages가 아니라 Cloudflare Workers다.
- Next.js 런타임은 공식 권장 경로인 `@opennextjs/cloudflare`를 사용한다.
- 1차에서는 기존 D1 및 KV REST API 호출을 유지한다.
- 이미지 최적화는 OpenNext의 `next/image` 통합과 Cloudflare Images 바인딩을
  사용한다.
- 이미지 원본은 Workers Static Assets와 기존 R2 공개 도메인에 유지한다.
- Vercel Analytics와 Speed Insights는 제거하고 Cloudflare Web Analytics로
  교체한다.
- Workers 프리뷰 검증이 끝나기 전에는 Vercel 프로덕션 배포와 DNS를 변경하지
  않는다.

## 아키텍처

```text
사용자
  |
  v
Cloudflare DNS / CDN / WAF
  |
  v
Cloudflare Worker
  |
  +-- OpenNext 기반 Next.js 16
  +-- Workers Static Assets: JS, CSS, 로컬 이미지
  +-- Cloudflare Images: next/image 변환
  +-- R2: OpenNext 증분 캐시
  +-- 기존 R2 공개 도메인: 콘텐츠 원본 이미지
  +-- D1 REST API: 조회수, 1차에서 유지
  +-- KV REST API: 이미지 크기 캐시, 1차에서 유지
```

Cloudflare가 직접 HTTP 요청을 처리하므로 Cloudflare 앞에 Vercel CDN을 중첩하지
않는다. 이를 통해 `www.toosign.me`의 DNS-only CNAME 경고를 해소하고 캐시 및
보안 정책의 책임을 Cloudflare로 일원화한다.

## 1차 마이그레이션 범위

### Workers 및 OpenNext

- `@opennextjs/cloudflare`와 Wrangler를 추가한다.
- `open-next.config.ts`와 `wrangler.jsonc`를 추가한다.
- Worker 진입점은 `.open-next/worker.js`, 정적 자산 경로는
  `.open-next/assets`를 사용한다.
- `nodejs_compat` 호환성 플래그와 Workers 관측 기능을 활성화한다.
- 로컬 Next.js 개발과 별도로 `workerd` 기반 preview 명령을 제공한다.
- 빌드, preview, deploy, Workers 타입 생성 명령을 패키지 스크립트에 추가한다.

### 이미지

`wrangler.jsonc`에 `IMAGES` 바인딩을 선언하고 OpenNext의 기본 이미지 최적화
통합을 사용한다.

```jsonc
{
  "images": {
    "binding": "IMAGES"
  }
}
```

기존 `<Image>` 컴포넌트와 `next.config.ts`의 `remotePatterns`, `qualities`,
`minimumCacheTTL` 설정은 유지한다. 원본은 다음 위치에 둔다.

- 로컬 커버, 히어로, 프로필 이미지: Workers Static Assets
- 사진 콘텐츠 원본: `files.toosign.me`의 기존 R2 공개 경로

R2 원본을 Cloudflare Images 저장소로 복제하거나 별도 변환 Route Handler를 만들지
않는다. `/_next/image` 요청을 OpenNext가 Cloudflare Images로 전달한다.

`image-size-util.ts`의 이미지 크기 조회와 KV REST 캐시는 이미지 최적화와 별개의
기능이므로 1차에서 유지한다.

### 분석

- `@vercel/analytics`와 `@vercel/speed-insights` 의존성 및 레이아웃 컴포넌트를
  제거한다.
- Cloudflare Web Analytics를 프로덕션 도메인에 연결한다.
- Web Analytics 적용 방식은 Cloudflare 대시보드가 제공하는 공식 통합을 사용하고,
  애플리케이션에 중복 beacon을 삽입하지 않는다.

### 기존 Cloudflare REST 연동

1차에서는 아래 환경변수와 구현을 유지한다.

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_IMAGE_SIZES_KV_NAMESPACE_ID`
- `CLOUDFLARE_API_TOKEN`

API 토큰은 Workers secret으로 저장한다. 빌드 중 SSG에 필요한 값과 Worker 런타임에
필요한 secret을 구분하여 Workers Builds에 등록한다.

## 캐시 설계

캐시 계층의 책임을 다음과 같이 구분한다.

| 대상 | 캐시 계층 | 정책 |
| --- | --- | --- |
| 정적 자산 | Cloudflare CDN | 빌드 해시 기반 장기 캐시 |
| `next/image` 결과 | Cloudflare Images 및 CDN | 요청 URL, 크기, 품질 기준 캐시 |
| ISR 및 Next.js fetch 캐시 | OpenNext 증분 캐시용 R2 | 기존 `revalidate` 의미 유지 |
| GitHub 활동 | Next.js fetch 캐시 | 15분 재검증 |
| 링크 미리보기 | Next.js fetch 캐시 | 1시간 재검증 |
| RSS, 사이트맵 | 빌드 시 정적 생성 | 런타임 재검증 없음 |
| 조회수 API | 캐시하지 않음 | `Cache-Control: no-store` 유지 |

현재 `next.config.ts`의 프로덕션 전역 `Cache-Control` 헤더는 API, 쿠키 설정 응답,
OpenNext 캐시 정책을 침범할 수 있다. 구현 단계에서 범위를 검토하고 정적 또는
공유 가능한 문서 응답에만 적용하거나 OpenNext 기본 헤더에 맡긴다.

Cloudflare Cache Rules로 HTML 또는 API를 일괄 캐시하지 않는다. OpenNext가 생성하는
캐시 헤더를 기본 정책으로 삼는다.

## 요청 및 보안 동작

- 클라이언트 IP는 `cf-connecting-ip`를 최우선으로 사용한다.
- `/api/views` GET과 POST는 항상 `no-store` 응답을 반환한다.
- 방문자 쿠키는 기존과 동일하게 HTTP-only, Secure, SameSite=Lax로 유지한다.
- 링크 미리보기의 프로토콜 제한, 사설망 차단, 시간 제한, 응답 크기 제한을
  유지한다.
- 기존 보안 응답 헤더를 Workers 배포에서도 확인한다.
- TLS 모드는 `Full (strict)`를 사용한다.

## 배포 및 DNS 전환

1. 로컬 `workerd` preview에서 런타임 호환성을 확인한다.
2. `workers.dev` 또는 임시 Cloudflare 서브도메인에 배포한다.
3. 기존 Vercel 프로덕션과 기능 및 화면을 비교한다.
4. 전환 직전에 DNS TTL과 롤백 절차를 확인한다.
5. `www.toosign.me`를 Worker Custom Domain에 연결한다.
6. 루트 도메인과 `www` 사이의 canonical 리디렉션을 확인한다.
7. Workers 로그, 조회수, 이미지, 캐시, Web Analytics를 관찰한다.
8. 안정화 기간이 끝난 뒤 Vercel 프로젝트와 전용 설정을 제거한다.

Cloudflare DNS 프록시를 Vercel 앞에 임시로 활성화하지 않는다. 전환 전에는 기존
DNS-only Vercel 레코드를 유지하고, 전환 시 Worker Custom Domain으로 교체한다.

## 롤백

안정화 기간 동안 Vercel 배포와 도메인 설정을 유지한다. 프로덕션 장애가 발생하면
`www.toosign.me`를 기존 Vercel 대상 레코드로 복구한다.

롤백 판단 조건은 다음과 같다.

- 주요 페이지 또는 Route Handler의 지속적인 5xx
- 조회수 기록 손실 또는 쿠키 동작 오류
- 이미지 최적화 실패로 인한 콘텐츠 이미지 미노출
- 캐시 설정으로 인한 사용자별 응답 또는 쿠키 공유
- Workers 제한이나 런타임 비호환으로 즉시 해결하기 어려운 장애

## 검증 계획

### 정적 및 콘텐츠

- 홈, 글, 프로젝트, 카테고리, 태그 페이지 렌더링
- MDX 컴포넌트와 Shiki 코드 강조
- 로컬 커버, 히어로, 프로필 이미지
- RSS, 사이트맵, robots.txt
- 메타데이터, canonical URL, JSON-LD

### 동적 기능

- `/api/views` GET 및 POST
- 30분 중복 집계 방지
- 방문자 쿠키 생성 및 유지
- `/api/link-preview` 정상, 차단, 시간 제한 경로
- GitHub 활동 fetch 및 재검증

### 이미지와 캐시

- 로컬 및 R2 원본에 대한 `/_next/image` 응답
- 요청 너비에 맞는 실제 리사이즈
- WebP 또는 AVIF 등 적절한 출력 형식
- 품질값 75와 100
- blur placeholder와 원본 비율
- 반복 요청의 CDN 캐시 동작
- ISR과 fetch 캐시의 만료 후 재검증
- 조회수 API의 `no-store`, `Set-Cookie`, 공유 캐시 미사용

### 품질 및 운영

- `pnpm check`
- OpenNext 프로덕션 빌드
- `workerd` 기반 preview
- 기존 Vercel 화면과 모바일 및 데스크톱 비교
- Workers 로그의 런타임 오류 확인
- 프로덕션 DNS, TLS, 리디렉션 확인
- Cloudflare Web Analytics 수집 확인
- Cloudflare의 DNS-only CNAME 경고 해소 확인

## 완료 조건

다음 조건을 모두 만족하면 1차 마이그레이션을 완료한 것으로 본다.

- `www.toosign.me`가 Cloudflare Worker Custom Domain으로 응답한다.
- 기존 정적 및 동적 기능이 동일하게 동작한다.
- 이미지 최적화와 캐시가 예상한 계층에서 동작한다.
- 조회수 및 쿠키 응답이 공유 캐시되지 않는다.
- Workers 로그에 지속적인 런타임 오류가 없다.
- Web Analytics 데이터가 수집된다.
- 롤백 없이 안정화 기간을 통과한다.

## 2차 마이그레이션

1차 안정화 후 별도 변경으로 진행한다.

- D1 REST API를 D1 네이티브 바인딩으로 전환한다.
- 이미지 크기 KV REST API를 KV 네이티브 바인딩으로 전환한다.
- 애플리케이션 런타임에서 Cloudflare API 토큰을 제거한다.
- 불필요해진 계정 ID, 데이터베이스 ID, 네임스페이스 ID 환경변수와 REST 유틸을
  정리한다.

2차 변경은 배포 플랫폼 이전과 분리하여 데이터 접근 방식의 회귀를 독립적으로
검증한다.
