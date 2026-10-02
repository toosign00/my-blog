# 브라우저·서버 연동 테스트

Playwright와 Next.js의 실험적 testProxy를 사용합니다. 테스트는 `e2e/*.spec.ts`에 둡니다.
Jest는 순수 로직과 Client Component를, Playwright는 실제 개발 서버의 페이지·MDX·Route Handler를 검증합니다.

## 실행

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

빌드는 실행하지 않습니다. 전용 포트 3100과 `.next-e2e` 출력 경로를 사용하며 기존 서버는 재사용하지 않습니다.
Playwright가 서버를 시작·종료하고, 실패 시 `test-results`에 trace와 screenshot을 남깁니다.

## 격리와 범위

- 서버 자격증명은 설정 파일의 가짜 값으로 덮어씁니다. 운영 DB 쓰기와 실제 댓글 작성은 금지합니다.
- 서버 요청은 `next.onFetch`, 브라우저 script/image 요청은 `page.route`로 격리합니다.
  미등록 외부 요청은 차단합니다. 외부 이미지 차단에 따른 proxy abort 로그는 예상된 출력입니다.
- 링크 미리보기는 DNS와 TLS SNI에 의존하지 않는 공개 HTTP IP를 테스트 주소로 사용합니다.
  실제 외부 접속이나 TLS 인증서 검증을 대신하지 않습니다.
- 링크 미리보기는 HTML 512,000바이트 및 메타데이터 시작 태그 8,192자(UTF-16 코드 단위)
  제한 초과 시 413을 반환하는지, 반복된 미종료 태그에서도 정상 메타데이터를 처리하는지 확인합니다.
- Next testProxy는 `E2E_TEST=1`인 테스트 서버에서만 켭니다. 운영 환경에서는 켜지 않습니다.
- 조회수 테스트는 실제 Route Handler를 거치며 D1의 HTTP 응답만 대체합니다. 실제 DB SQL 실행·동시성 검증은 아닙니다.
- Giscus는 테스트 스크립트로 연동 계약을 검증하며 외부 서비스 자체의 가용성은 검증하지 않습니다.
  iframe의 `postMessage` 경계를 대체해 테마와 대상 origin을 확인합니다.
- 로컬 이미지는 실제 이미지 최적화 경로를 검증합니다.
- 개발 서버 검증이므로 프로덕션 빌드·CDN 캐시·배포 환경 검증을 대신하지 않습니다.

## 작성 기준

역할과 이름으로 요소를 찾고 상태가 나타날 때까지 assertion으로 기다립니다.
임의 sleep과 화면 전체 snapshot을 사용하지 않습니다.
성공·빈 결과·오류를 공개 응답으로 확인합니다. 프레임워크 전체를 mock하지 않습니다.
유닛 커버리지 수치와 E2E 성공 여부는 별도로 보고합니다.
