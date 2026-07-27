# Testing Guidelines

테스트 작업을 시작하기 전에 대상에 맞는 기준을 확인합니다.

## Jest 유닛 테스트

다음 대상은 [`unit-testing.md`](./unit-testing.md)를 반드시 따릅니다.

- 순수 함수
- Client Component
- Custom Hook
- 프레임워크에서 독립적으로 분리된 서버 비즈니스 로직

현재 커버리지 상태와 다음 테스트 대상은
[`coverage-roadmap.md`](./coverage-roadmap.md)에서 확인합니다.

## 유닛 테스트 제외 대상

다음 대상은 Jest로 억지로 테스트하지 않습니다.

- Server Component 렌더링
- 실제 Next.js 서버 요청
- Route Handler
- Server Action
- Middleware
- 인증과 리다이렉트
- 브라우저 기반 사용자 흐름

위 대상에는 별도의 E2E 테스트 기준이 필요합니다. 아직 E2E 기준 문서가 없으므로 임의의
도구나 방식을 도입하지 않습니다.
