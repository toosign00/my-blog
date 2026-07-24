# Unit Testing

이 문서는 Jest와 React Testing Library를 사용하는 모든 유닛 테스트 작업의 기준입니다.
Jest를 아직 설치하지 않은 상태에서는 [설정 기준](#설정-기준)을 목표 구성으로 사용합니다.

## 적용 범위

이 문서는 다음 코드에 적용합니다.

- 순수 함수
- Client Component
- Custom Hook
- 프레임워크에서 독립적으로 분리된 서버 비즈니스 로직

## 제외 범위

다음 항목은 이 문서의 범위가 아닙니다.

- Server Component 렌더링
- 실제 Next.js 서버 요청
- Route Handler
- Server Action
- Middleware
- 인증과 리다이렉트
- 브라우저 기반 사용자 흐름

제외 대상을 테스트하기 위해 Next.js 런타임 전체를 mock하지 않습니다. 먼저
[`README.md`](./README.md)에서 테스트 범위를 다시 판단합니다.

## 작업 전 필수 절차

### 해야 함

1. 테스트 대상이 이 문서의 적용 범위인지 확인합니다.
2. 검증할 공개 동작과 성공 조건을 먼저 적습니다.
3. 관련 코드를 읽고 실제 의존성과 부수 효과를 확인합니다.
4. 필요한 최소 테스트만 계획합니다.

### 하지 않음

- 테스트를 쉽게 만들기 위한 불필요한 프로덕션 코드 변경
- 요청받지 않은 인접 코드 리팩터링
- 구현 세부사항만 고정하는 테스트
- 테스트 범위를 벗어난 기능까지 한 번에 테스트

### 예외

테스트 가능한 경계를 만들기 위해 프로덕션 코드 변경이 꼭 필요하면, 변경 전에 이유와
영향을 밝히고 최소 범위로 수정합니다.

## 설정 기준

Jest 도입 작업은 다음 개발 의존성을 사용합니다.

```bash
pnpm add -D jest jest-environment-jsdom @testing-library/react \
  @testing-library/dom @testing-library/jest-dom @testing-library/user-event \
  @types/jest ts-node
```

### 설정 파일

- `jest.config.ts`
  - `next/jest.js`를 사용합니다.
  - 프로젝트 경로는 `dir: './'`로 지정합니다.
  - 테스트 환경은 `jsdom`을 사용합니다.
  - 커버리지 공급자는 `v8`을 사용합니다.
  - `setupFilesAfterEnv`에서 `<rootDir>/jest.setup.ts`를 불러옵니다.
  - `@/*`를 `<rootDir>/src/*`에 매핑합니다.
  - mock이 테스트 사이에 남지 않도록 `clearMocks`와 `restoreMocks`를 활성화합니다.
- `jest.setup.ts`
  - `@testing-library/jest-dom`을 불러옵니다.

설정은 Next.js 설정과 환경 파일을 로드할 수 있도록 `next/jest`가 반환한 비동기 설정을
내보내는 형태로 작성합니다.

### package.json 스크립트

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Jest가 설치되기 전에는 위 명령을 실행 가능한 것으로 간주하지 않습니다.

## 파일 배치와 네이밍

### 해야 함

- 테스트 파일은 대상 코드 옆에 배치합니다.
- TypeScript 테스트는 `.test.ts`를 사용합니다.
- React 컴포넌트와 Hook 테스트는 `.test.tsx`를 사용합니다.
- 테스트 이름은 관찰 가능한 동작을 영어로 표현합니다.

```text
src/utils/format-date.ts
src/utils/format-date.test.ts
src/components/search-form.tsx
src/components/search-form.test.tsx
```

### 하지 않음

- 유닛 테스트를 루트 `tests/` 폴더에 모으지 않습니다.
- `spec.ts`와 `spec.tsx`를 혼용하지 않습니다.
- `works`, `handles correctly`처럼 검증 내용을 알 수 없는 이름을 사용하지 않습니다.

## 공통 작성 원칙

### 해야 함

- 공개 입력과 출력 또는 사용자에게 보이는 결과를 검증합니다.
- 테스트 하나는 하나의 명확한 동작을 설명합니다.
- Given-When-Then 또는 Arrange-Act-Assert 순서를 유지합니다.
- 경계값, 빈 값, 오류 조건은 실제 요구사항에 있을 때 검증합니다.
- 비동기 동작은 반드시 `await`합니다.
- 테스트가 실패하면 원인을 알 수 있는 구체적인 assertion을 사용합니다.

### 하지 않음

- private 상태, 내부 함수 호출 순서, React 내부 구현을 검증하지 않습니다.
- 프로덕션 코드와 같은 알고리즘을 테스트에 다시 구현하지 않습니다.
- 임의의 지연 시간이나 sleep으로 비동기 동작을 기다리지 않습니다.
- 테스트 간에 실행 순서나 공유된 변경 가능 상태에 의존하지 않습니다.
- 단순히 커버리지 수치를 올리기 위한 의미 없는 assertion을 추가하지 않습니다.

### 예외

호출 횟수 자체가 공개 계약인 경우에는 호출 횟수를 검증할 수 있습니다. 예를 들어 중복
결제를 방지하기 위해 외부 결제 요청이 한 번만 발생해야 하는 경우입니다.

## 순수 함수와 서버 로직

### 해야 함

- 대표 입력, 경계값, 잘못된 입력에 대한 공개 동작을 검증합니다.
- 날짜와 시간대처럼 결과에 영향을 주는 환경 값은 테스트에서 고정합니다.
- 서버 비즈니스 로직은 Next.js API에서 독립된 함수로 분리된 경우에만 직접 테스트합니다.

### 하지 않음

- 타입 시스템이 이미 보장하는 사실만 테스트하지 않습니다.
- 상수 선언이나 단순 재노출만 검증하지 않습니다.
- Server Component를 렌더링하기 위해 프레임워크 전체를 mock하지 않습니다.

### 예시

```ts
import { clamp } from './clamp';

describe('clamp', () => {
  it('returns the maximum when the value exceeds the allowed range', () => {
    expect(clamp(12, 0, 10)).toBe(10);
  });
});
```

## Client Component

### 해야 함

- 사용자가 인식하는 역할, 레이블, 텍스트로 요소를 조회합니다.
- 조회 우선순위는 `getByRole`/`findByRole`, `getByLabelText`, `getByText` 순서로 둡니다.
- 사용자 입력은 `userEvent.setup()`으로 준비한 `user`를 사용하고 상호작용을 `await`합니다.
- 비동기로 나타나는 요소는 `findBy*`로 조회합니다.
- 로딩, 성공, 오류 상태는 사용자에게 보이는 결과로 검증합니다.

### 하지 않음

- `container.querySelector`로 구현 DOM 구조에 의존하지 않습니다.
- `fireEvent`를 사용자 상호작용의 기본 도구로 사용하지 않습니다.
- `data-testid`를 역할이나 레이블 대신 사용하지 않습니다.
- 컴포넌트의 내부 state나 내부 메서드에 접근하지 않습니다.

### 예외

- 역할, 레이블, 텍스트로 안정적으로 조회할 수 없는 비시각적 요소에만 `data-testid`를
  사용할 수 있습니다.
- `user-event`가 지원하지 않는 저수준 이벤트를 직접 검증할 때만 `fireEvent`를 사용합니다.

### 예시

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './counter';

it('increases the displayed count when the user clicks the button', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole('button', { name: 'Increase' }));

  expect(screen.getByRole('status')).toHaveTextContent('1');
});
```

## Custom Hook

### 해야 함

- Hook의 인자와 공개된 반환값을 검증합니다.
- 상태 변경은 `act` 안에서 수행합니다.
- Context가 필요하면 최소한의 `wrapper`를 제공합니다.
- Hook이 컴포넌트 사용 흐름에서만 의미가 있다면 컴포넌트를 통해 테스트합니다.

### 하지 않음

- Hook 내부 state 변수나 내부 helper를 직접 검증하지 않습니다.
- 실제 프로바이더 대신 동작이 다른 가짜 Hook을 만들어 테스트하지 않습니다.

### 예시

```tsx
import { act, renderHook } from '@testing-library/react';
import { useToggle } from './use-toggle';

it('toggles the exposed value', () => {
  const { result } = renderHook(() => useToggle());

  act(() => result.current.toggle());

  expect(result.current.value).toBe(true);
});
```

## Mock

### 해야 함

- 실제 테스트 환경 밖에 있는 외부 경계만 필요한 만큼 mock합니다.
- 외부 API, 시간, 랜덤 값, 브라우저 API, Next.js 런타임 경계를 mock할 수 있습니다.
- mock의 반환값은 해당 경계의 실제 계약과 같은 형태를 사용합니다.
- fake timer를 사용했다면 테스트 후 real timer로 복원합니다.
- 테스트마다 mock 상태가 독립적이어야 합니다.

### 하지 않음

- 테스트 대상의 내부 함수와 단순 유틸리티를 mock하지 않습니다.
- 자식 컴포넌트를 이유 없이 전부 mock하지 않습니다.
- React Testing Library 자체를 mock하지 않습니다.
- mock 호출 여부만 확인하고 최종 결과 검증을 생략하지 않습니다.

### 예외

- 외부 시스템 호출 비용이 크거나 결과가 비결정적인 경우
- 브라우저나 Next.js 런타임 없이는 해당 경계를 실행할 수 없는 경우
- 실패, 재시도, 시간 초과처럼 실제 환경에서 재현하기 어려운 조건을 검증하는 경우

### 예시

```ts
import { getPublishedLabel } from './get-published-label';

afterEach(() => {
  jest.useRealTimers();
});

it('marks a past publication date as published', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-07-25T00:00:00.000Z'));

  expect(getPublishedLabel('2026-07-24T00:00:00.000Z')).toBe('Published');
});
```

## 스냅샷

### 하지 않음

- 컴포넌트 전체 DOM의 대형 스냅샷을 만들지 않습니다.
- 사람이 의미를 검토하지 않는 스냅샷을 커버리지 목적으로 추가하지 않습니다.
- 동적 날짜, 무작위 값, 환경별 출력이 포함된 결과를 그대로 저장하지 않습니다.

### 예외

사람이 변경 내용을 검토할 가치가 있고 출력이 작고 안정적일 때만 스냅샷을 사용할 수
있습니다. 이 경우 스냅샷이 일반 assertion보다 적합한 이유를 테스트 코드에 짧게
설명합니다.

## 커버리지

커버리지는 한 번에 높은 목표를 강제하지 않고 현재 상태에서 점진적으로 올립니다.

### 기준선 설정

1. 첫 번째 유효한 테스트 묶음을 작성합니다.
2. `pnpm test:coverage`를 실행합니다.
3. 출력된 Statements, Branches, Functions, Lines의 전역 수치를 `jest.config.ts`의
   `coverageThreshold.global`에 기록합니다.
4. 이후 커버리지가 높아지면 해당 기준값도 함께 올립니다.

### 해야 함

- 새 테스트 작업은 관련 코드의 의미 있는 동작을 우선 보강합니다.
- 커버리지 상승이 확인되면 기준선을 같은 작업에서 갱신합니다.
- 커버리지 수집 대상과 제외 대상은 `jest.config.ts`에 명시합니다.
- 제외 패턴에는 생성 파일, 타입 선언, 설정 파일, 유닛 테스트 범위 밖의 프레임워크 경계만
  포함합니다.

### 하지 않음

- 명시적인 사유와 사용자 승인 없이 `coverageThreshold`를 낮추지 않습니다.
- 수치를 높이기 위해 테스트 가능한 코드를 커버리지 대상에서 제외하지 않습니다.
- 실행만 하고 결과를 검증하지 않는 테스트를 추가하지 않습니다.
- 전역 80% 같은 임의의 초기 목표를 설정하지 않습니다.

### 예외

코드 삭제나 수집 범위 변경으로 기준값의 의미가 달라졌다면 변경 전후 수치를 비교하고,
기준선을 조정해야 하는 이유를 사용자에게 설명한 뒤 승인받습니다.

## 실행 및 검증 명령

Jest 도입 후 다음 순서로 검증합니다.

1. 관련 테스트만 실행합니다.

   ```bash
   pnpm test -- path/to/file.test.ts
   ```

2. 전체 유닛 테스트를 실행합니다.

   ```bash
   pnpm test
   ```

3. 전체 커버리지를 확인합니다.

   ```bash
   pnpm test:coverage
   ```

4. 타입과 변경한 TypeScript 파일의 정적 검사를 실행합니다.

   ```bash
   pnpm type-check
   pnpm exec biome check path/to/changed-file.ts path/to/changed-file.test.ts
   ```

5. 변경 diff를 확인해 테스트와 직접 관계없는 수정이 없는지 검토합니다.

빌드 명령은 실행하지 않습니다.

## 완료 보고

작업을 완료할 때 다음 내용을 보고합니다.

- 추가하거나 변경한 테스트의 공개 동작
- 관련 테스트와 전체 테스트 결과
- 커버리지 변경 전후 수치
- 타입 검사와 정적 검사 결과
- 실행하지 못한 검증과 그 이유
- 테스트를 위해 변경한 프로덕션 코드가 있다면 변경 이유
