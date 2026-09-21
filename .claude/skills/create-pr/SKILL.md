---
name: create-pr
description: 현재 브랜치 변경 내용으로 PR 제목과 본문 초안을 작성합니다. 직접 생성하지 않습니다.
---

# create-pr

PR 제목과 본문 초안만 만듭니다. **요청받지 않으면 PR 을 직접 생성하지 않습니다.**

## Workflow

1. `git status --short` 로 미커밋 변경을 확인합니다. 남아 있으면 먼저 알립니다.
2. `git log dev..HEAD --oneline` 과 `git diff dev..HEAD --stat` 을 확인합니다.
   **대상 브랜치는 `dev` 입니다.** `main` 은 전시 배포용입니다 (`commit-convention.md`).
3. `.github/pull_request_template.md` 가 있으면 그 섹션 이름과 순서를 그대로 씁니다.
4. 브랜치명에 이슈 번호가 있으면 추출합니다 (`feat/state-machine-12` → `#12`).
5. 실제로 실행한 검증과 못 한 검증을 구분합니다.

## Output Shape

```markdown
## Description

<무엇을 왜 바꿨는지 2~4줄>

## Todo

- [x] <완료한 것>
- [ ] <남은 것 / 후속 브랜치로 넘길 것>
```

템플릿에 검증 체크리스트가 있으면 **실제로 실행한 것만** 체크합니다.
실기 확인이 필요한 항목은 체크하지 않고 그 사실을 본문에 적습니다.

## 금지

- 이모지
- 실행하지 않은 검증을 체크
- `main` 을 대상으로 한 PR (명시 요청이 없는 한)
