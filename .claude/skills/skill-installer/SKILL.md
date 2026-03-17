---
name: skill-installer
description: |
  .skill 또는 .plugin 파일을 Claude Code에서 사용할 수 있도록 자동 변환·등록합니다.
  MUST BE USED when: "스킬 설치", "skill 설치", ".skill 변환", "스킬 등록해줘", "이 스킬 써줘" + .skill/.plugin 파일이 제공될 때
  USE PROACTIVELY when: 사용자가 .skill 또는 .plugin 파일을 워크스페이스에 추가했거나, Claude Cowork/웹앱에서 다운로드한 스킬을 언급할 때
---

# .skill / .plugin → Claude Code 스킬 설치

## 개요
Claude Cowork 또는 Claude 웹앱에서 다운로드한 `.skill` / `.plugin` 파일은 gzip tar 아카이브다.
Claude Code는 `.claude/skills/{이름}/SKILL.md` 경로의 순수 마크다운만 인식하므로, 압축 해제 후 복사해야 한다.

## 파일 포맷 차이

| 포맷 | 내용물 | 구조 |
|---|---|---|
| `.skill` | 스킬 1개 | `스킬이름/SKILL.md` (+references/) |
| `.plugin` | 스킬 여러 개 묶음 | `skills/스킬A/SKILL.md`, `skills/스킬B/SKILL.md`, ... |

## 실행 순서

### Step 1: 파일 위치 확인
사용자가 제공한 `.skill` 또는 `.plugin` 파일의 경로를 확인한다.

### Step 2: 임시 폴더에 압축 해제

```bash
# .skill 파일
mkdir -p /tmp/skill-install && tar xzf "파일경로.skill" -C /tmp/skill-install

# .plugin 파일
mkdir -p /tmp/skill-install && tar xzf "파일경로.plugin" -C /tmp/skill-install
```

### Step 3: 내부 구조 확인

```bash
find /tmp/skill-install -name "SKILL.md"
```

- `.skill`: `/tmp/skill-install/스킬이름/SKILL.md`
- `.plugin`: `/tmp/skill-install/skills/스킬이름/SKILL.md`

### Step 4: 중복 확인
이미 `.claude/skills/`에 같은 이름의 스킬이 있는지 확인한다.
- 있으면 사용자에게 덮어쓸지 확인
- 없으면 진행

### Step 5: .claude/skills/로 복사

```bash
# .skill 파일의 경우
cp -r /tmp/skill-install/스킬이름/ .claude/skills/

# .plugin 파일의 경우
cp -r /tmp/skill-install/skills/*/ .claude/skills/
```

**references/ 폴더가 있으면 함께 복사한다.**

### Step 6: YAML frontmatter 검증

SKILL.md 파일 상단을 확인하여 `---` 블록이 있는지 체크한다.

**필수 frontmatter 구조:**
```yaml
---
name: 스킬이름
description: |
  스킬 설명
  MUST BE USED when: 트리거 조건
  USE PROACTIVELY when: 자동 실행 조건
---
```

- frontmatter가 없으면: SKILL.md 내용을 분석하여 적절한 frontmatter를 자동 생성하여 파일 상단에 추가
- frontmatter가 있으면: `name`, `description`, `MUST BE USED when`, `USE PROACTIVELY when` 필드가 모두 있는지 확인

### Step 7: 정리 및 확인

```bash
rm -rf /tmp/skill-install
ls .claude/skills/
```

설치된 스킬 목록을 사용자에게 보여준다.

## 제약사항
- 같은 이름의 스킬이 이미 존재하면 사용자 확인 없이 덮어쓰지 않는다
- frontmatter 자동 생성 시 원본 SKILL.md 내용의 트리거/용도 섹션을 참고한다
- references/ 등 부속 파일이 있으면 반드시 함께 복사한다
