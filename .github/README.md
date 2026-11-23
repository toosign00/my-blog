# Dependency updates

Dependabot의 버전 확인 주기와 그룹은 [`dependabot.yml`](./dependabot.yml)에서 관리합니다.

## 패치 업데이트 자동 병합

[`dependabot-automerge.yml`](./workflows/dependabot-automerge.yml)은 같은 저장소의
Dependabot PR을 검증한 뒤, 모든 업데이트의 버전 변경이 `patch`인 경우에만 squash
병합합니다. 마이너·메이저가 섞인 그룹과 일반 코드 PR은 수동으로 병합합니다.
버전 분류는 Dependabot 메타데이터 기준이며, lockfile의 간접 의존성 해석 정리가 함께
포함될 수 있습니다.

`main` 브랜치 보호에 다음 검사를 필수로 등록해야 합니다. 브랜치는 최신 상태여야 하며,
검사 실패·대기·충돌 시 자동 병합하지 않습니다.

| 필수 검사                         | 제공 앱        |
| --------------------------------- | -------------- |
| `Lint, type check and unit tests` | GitHub Actions |
| `pull-request` (Trivy)            | GitHub Actions |
| `Vercel`                          | Vercel         |

관리자에게 브랜치 보호를 강제하지 않아 기존 관리자 직접 푸시는 유지합니다.
자동 병합 워크플로는 관리자 우회 권한을 사용하지 않습니다. 필수 리뷰나 봇의 자동 승인은
추가하지 않습니다. 서명된 Dependabot 커밋 하나로 구성된 PR만 처리하며, 병합 직전에
현재 HEAD와 커밋 수를 다시 확인하고 같은 SHA에 대해서만 병합합니다. 향후 다른 커밋에
적용될 수 있는 GitHub 자동 병합 예약은 남기지 않습니다.

필수 검사 완료를 최대 10분 동안 기다립니다. 시간이 초과된 PR은 열린 상태로 남으며,
검사 완료 후 워크플로를 재실행하거나 수동으로 병합합니다.

워크플로는 쓰기 권한이 있는 `pull_request_target`에서 실행하므로 PR 코드를 체크아웃하거나
실행하지 않습니다. E2E는 기존 정기·수동 실행 범위를 유지하며 자동 병합의 필수 검사가
아닙니다. 설정 도입 전에 열린 PR에는 다음 PR 업데이트부터 적용됩니다.
`GITHUB_TOKEN`으로 병합하므로 병합 후 `push` CI 재실행을 보장하지 않으며, 필수 검증은
병합 전 PR 검사로 수행합니다.
