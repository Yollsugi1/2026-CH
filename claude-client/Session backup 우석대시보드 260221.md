# 세션 백업 — 우석 데일리 대시보드 & 국순당 플러그인

**백업 일자**: 2026-02-21
**프로젝트 상태**: 플러그인 완성 + 로컬 대시보드 코드 완성, 파일 전달 동기화 이슈로 새 세션 필요

---

## 🔑 핵심 사항

- **임우석 Claude Cowork 플러그인**: 완성됨. `kuksundang-workflow.plugin` 파일 생성 완료. 5개 스킬 + 5개 커맨드 포함
- **Notion MCP 권한 문제**: 수현 개인 워크스페이스에 팀원이 게스트로 초대된 구조 → 팀원은 MCP 커넥터 접근 불가
- **해결책**: Notion Internal Integration(API 토큰) 사용. 수현이 integration 생성 → 토큰을 우석에게 전달
- **로컬 대시보드 앱**: Python HTTP 서버 기반 완성. 6개 파일. macOS launchd로 매일 10시 자동 실행
- **파일 전달 이슈**: VM → Mac 워크스페이스 폴더 동기화가 안 됨. 파일은 VM에서 생성 확인되지만 Mac Finder에서 안 보임
- **Notion Integration**: 수현님이 생성 중. 캡처 확인 결과 "공개 통합(Public)" 페이지에 있었음 → "내부 통합(Internal)"으로 만들어야 함

## 📝 전체 대화 흐름 (시간순)

### [1] 국순당 워크플로우 플러그인 구축 + 콘텐츠 기획 현황 + Opus vs Sonnet 비교
**사용자 요청**: "이 국순당 워크플로우 관련해서 국순당 담당인 우리 팀 임우석이 본인 claude cowork에서 바로 작업할 수 있게 plugin으로 구축하고 가이드를 줄래? 그리고 원래 세션 내용 보면 국순당 개별 콘텐츠 기획들도 이어서 진행하고 이를 하나의 워크플로우로 담아야되는데 이어서 진행할 수 있게 해줘. 그리고 혹시 Opus 4.6이랑 Sonnet 4.6 간에 크리에이티브한 측면에 차이가 있니?"

**진행 내용**:
- 기존 5개 스킬 파일 모두 읽음 (daily-report, weekly-report, schedule-manager, client-update, content-planner)
- create-cowork-plugin 스킬 및 component-schemas 참조 파일 읽음
- 이전 세션 백업 파일(세션-백업_20260219.md) 읽어서 컨텍스트 복원
- 플러그인 전체 구조 생성: .claude-plugin/plugin.json + 5개 skills + 5개 commands + README
- Python으로 .plugin 파일 패키징 (한국어 디렉토리 인코딩 이슈 → Python shutil로 해결)
- 우석 사용가이드, 콘텐츠 기획 현황 문서 작성
- Opus 4.6 vs Sonnet 4.6 크리에이티브 차이 설명

**산출물**:
- `kuksundang-workflow.plugin` — 완성된 플러그인 파일
- `임우석-Plugin-사용가이드.md` — 플러그인 설치/사용 가이드
- `콘텐츠-기획-현황-및-다음단계.md` — 콘텐츠 기획 상태 정리

**플러그인 구조**:
```
kuksundang-workflow-plugin/
├── .claude-plugin/plugin.json (name: kuksundang-workflow, v1.0.0)
├── skills/
│   ├── kuksundang-daily-report/SKILL.md
│   ├── kuksundang-weekly-report/SKILL.md
│   ├── kuksundang-schedule-manager/SKILL.md
│   ├── kuksundang-client-update/SKILL.md
│   └── kuksundang-content-planner/
│       ├── SKILL.md (시리즈 가이드: 순당포착, 취하지아니한가, 1막1장)
│       └── references/abc-framework.md
├── commands/ (daily.md, weekly.md, schedule.md, client-update.md, plan.md)
└── README.md
```

**결정된 사항**:
- 플러그인에 Notion MCP 의존성 있음 → 우석이 사용하려면 Notion MCP 권한 필요

---

### [2] Notion MCP 권한 문제 발견 & 로컬 대시보드 솔루션 설계
**사용자 요청**: "우석이 이 플러그인을 적용하려고 했더니, 노션 Mcp 권한이 없어서 막히는 현상이 발생했어. 노션 mcp는 지금 팀 요금제를 쓰기보다, 나의 계정으로 우리 팀 페이지를 하나 파서 거기에 우리 팀원들을 게스트로 초대해서 쓰고 있기 때문에 노션mcp에 대한 권한이 없는 것 같아. 하지만 모든 일정은 현재 노션 국순당 페이지 상에서 관리되고 있어."

"우석은 하루에 크게는 두 가지 (국순당 업무, CH MAG 캐러셀 콘텐츠 제작 업무)를 해. 원래 이 두 가지 업무가 하루 근무시간 8시간 중 6시간 정도를 차지해 2시간은 다른 서브 업무를 하거나, 중장기적으로는 CH MAG에 새롭게 해야 될 콘텐츠 방향성 기획이나, 디자인의 variation을 만들어내는 등이 필요하지만 현재 하루 단위 일에만 매몰되어 있어서 진행되지 않고 있어."

"매일 아침 우석이 출근하면 본인에게 오늘 가장 급한 투두가 어떤게 있는지를 파악한 다음, 본인에게 주어진 오늘/이번주/그리고 롱텀 업무의 체크리스트가 자동으로 나오면서 이게 미리 계속 관리될 수 있도록 하려고 해. 가능하면 자동으로 매일 아침 정해진 시간 (maybe 10:00 am)에 이 내용들이 딱 나와서 확인할 수 있으면 좋겠어."

**진행 내용**:
- 문제 분석: Notion 워크스페이스 = 수현 개인 계정, 팀원 = 게스트 → MCP 커넥터 권한 없음
- 해결책 설계: Notion Internal Integration (API 토큰) 직접 사용
- 출력 형식 질문 → 사용자 선택: **"로컬 웹 대시보드 (Recommended)"**
- Python HTTP 서버 기반 로컬 대시보드 앱 설계 및 구현

**산출물 (6개 파일)**:

1. `config.py` — 설정 파일
   - NOTION_TOKEN 플레이스홀더
   - DB ID 3개:
     - DB_INTERNAL_TASKS = "2fd02b0e30a980d691c4000b9f5c2a4b" (내부 업무관리/제작 캘린더)
     - DB_CONTENT_MASTER = "2e802b0e30a980bea68b000b949a80a2" (2026 국순당 콘텐츠 마스터)
     - DB_CLIENT_BOARD = "25402b0e30a980ceab4c000be4f8067b" (클라이언트 공유 보드)
   - DB_CHMAG_TASKS = "" (비어있음 — CH MAG DB ID 미확인)
   - PORT=5050, HOST=127.0.0.1
   - 3단계 공유 시스템: 1차(D-14/30%), 2차(D-10/80%), 최종(D-5/100%)
   - TAG_ORDER = ["예정", "촬영", "1차공유", "2차공유", "최종공유", "업로드", "완료"]

2. `notion_client.py` — Notion API 클라이언트
   - requests 라이브러리로 직접 API 호출 (MCP 우회)
   - _query_database(), _extract_title(), _extract_date(), _extract_select()
   - get_internal_tasks() — 내부 업무 DB 조회, 완료 제외, D-minus 계산
   - get_content_master() — 콘텐츠 마스터 DB 조회, 시리즈별 그룹핑
   - analyze_sharing_status() — 3단계 공유 역산 체크 (D-14/D-10/D-5 알림)
   - get_dashboard_data() — 전체 데이터 수집, today/this_week/longterm 분류

3. `app.py` — 메인 서버
   - 다크 테마 HTML 대시보드
   - 3컬럼: 오늘 / 이번주 / 모닝 체크리스트
   - 2컬럼: 국순당 파이프라인(시리즈별 색상) / 롱텀 & CH MAG 메모
   - 알림 섹션 (critical/warning)
   - 인터랙티브 체크리스트 (추가/체크 가능, 로컬 JSON 저장)
   - CH MAG 메모 영역 (자동 저장)
   - API: /api/checklist (POST), /api/memo (GET/POST)
   - 자동 브라우저 열기

4. `requirements.txt` — requests>=2.28.0

5. `setup.sh` — 원클릭 설치 스크립트
   - Python3 확인, pip install, data/ 디렉토리 생성
   - 토큰 미설정 경고
   - macOS launchd plist 생성 (com.creatorhood.daily-dashboard)
   - 매일 10시 자동 실행 등록

6. `우석-설치가이드-완전초보용.md` — 비개발자용 가이드
   - STEP 1: 수현에게 토큰 받기
   - STEP 2: 폴더를 바탕화면에 놓기
   - STEP 3: config.py에 토큰 입력 (따옴표 주의사항 포함)
   - STEP 4: 터미널 여는 법 + 명령어 복사-붙여넣기
   - STEP 5: 테스트
   - 문제 해결 표

**결정된 사항**:
- Notion Internal Integration 방식으로 MCP 우회
- 로컬 웹 대시보드 형태 (Slack 봇 아님)
- macOS launchd로 10시 자동 실행

---

### [3] Notion Integration 생성 확인 & 파일 전달 이슈
**사용자 요청**: "1. 노션에서 integration 만들고 있는데 캡쳐를 올렸어. 지금 여기서 하는게 맞는지 확인해주고. 2. 대시보드 폴더가 안 열리는데, 지정한 디렉토리인 '국순당-자동화-팀공유'에 파일들을 넣어놓을 수 있어? 3. config.py에 토큰 입력 이런건 개발에 아예 무지한 우석 입장에서 이것도 어려울 수 있어. 더 친절하게 설명해줘"

**진행 내용**:
- 캡처 확인: **Public Integration(공개 통합)** 페이지에 있었음 → 잘못된 페이지
- OAuth, 개인정보 보호정책 URL 등 불필요한 필드들이 보임
- **Internal Integration(내부 통합)**으로 만들어야 한다고 안내
- 파일은 VM에서 확인되지만 Mac에서 안 보이는 동기화 문제 발생
- 초보자 친화 가이드 별도 작성 완료

**결정된 사항**:
- Internal Integration 생성 필요 (이름: 크리에이터후드-대시보드, 워크스페이스: Suhyun)
- 생성 후 국순당 DB 3개에 각각 "연결 추가" 해야 함

---

### [4] 파일 동기화 재시도 & 세션 백업 결정
**사용자 요청**: "여전히 안 보여. 그러면 이 챗을 백업한다음에, 새 세션을 파서, 다른 폴더에서 워크스페이스를 구축하고 해볼까?"

**진행 내용**:
- shutil.copytree 시도 → 실패 (uploads 폴더가 read-only)
- 국순당-자동화-팀공유 폴더에 copytree 성공 (VM에서는 확인됨)
- 기존 폴더 삭제 후 Write 도구로 개별 파일 재생성 시도
- 여전히 Mac Finder에서 안 보임
- 사용자 Mac 경로 확인: `/Users/Yollsugi/Downloads/2026 CH/국순당-자동화-팀공유`
- 새 세션에서 다른 폴더로 시도하기로 결정

**기술적 이슈**:
- VM의 `/sessions/hopeful-serene-keller/mnt/국순당-자동화-팀공유/` 와 Mac의 실제 경로 사이 동기화 지연 또는 실패
- Write 도구로 직접 생성해도 동일 증상
- **새 세션에서 다른 워크스페이스 폴더로 시도 필요**

---

## 📁 최종 파일 목록

### 대시보드 앱 (VM에 존재, Mac 전달 필요)
| 파일명 | 설명 | 상태 |
|---|---|---|
| config.py | Notion 토큰/DB ID/서버 설정 | VM에 있음 |
| notion_client.py | Notion API 클라이언트 | VM에 있음 |
| app.py | 대시보드 메인 서버 (다크 테마 HTML) | VM에 있음 |
| requirements.txt | requests>=2.28.0 | VM에 있음 |
| setup.sh | 원클릭 설치 + launchd 설정 | VM에 있음 |
| 우석-설치가이드-완전초보용.md | 비개발자용 가이드 | VM에 있음 |
| README.md | 전체 문서 (수현 STEP + 우석 STEP) | VM에 있음 |

### 플러그인 (이전 세션에서 전달 완료)
| 파일명 | 설명 | 상태 |
|---|---|---|
| kuksundang-workflow.plugin | 우석용 플러그인 패키지 | 전달 완료 (이전 세션) |
| 임우석-Plugin-사용가이드.md | 플러그인 가이드 | 전달 완료 (이전 세션) |

## ⏭️ 다음 할 일

- [ ] **새 세션에서 다른 워크스페이스 폴더 선택** 후 대시보드 파일 전달
- [ ] 수현님: Notion Internal Integration 생성 (공개가 아닌 **내부** 통합으로!)
  - https://www.notion.so/profile/integrations → 새 API 통합 → 유형: 내부
  - 이름: 크리에이터후드-대시보드
  - 3개 DB에 연결 추가 (내부 업무관리, 콘텐츠 마스터, 클라이언트 보드)
- [ ] 토큰을 우석에게 Slack DM으로 전달
- [ ] 우석 Mac에서 대시보드 설치 및 테스트
- [ ] CH MAG DB ID 확인 후 config.py에 추가 (선택)
- [ ] Notion DB 프로퍼티명 실제 매칭 확인 (태그/상태/날짜 등 — 코드에서 여러 이름 시도하도록 구현됨)

## 💡 맥락 메모

- **우석 업무 구조**: 국순당(~3h) + CH MAG 캐러셀(~3h) = 6h/8h. 나머지 2h는 서브 업무 + 중장기 기획인데 현재 진행 안 됨
- **Notion 구조**: 수현 개인 계정 워크스페이스. 팀원은 게스트. → MCP 커넥터 사용 불가
- **파일 동기화 문제**: Cowork VM → Mac 폴더 동기화가 특정 상황에서 안 될 수 있음. 새 세션/새 폴더로 시도 필요
- **우석 기술 수준**: 개발 무경험. config.py 편집도 가이드 필요. 모든 안내는 복사-붙여넣기 수준으로
- **Notion Integration**: Public이 아닌 Internal로 만들어야 함. 수현님이 진행 중
- **DB ID 3개 확정**:
  - 내부 업무관리: 2fd02b0e30a980d691c4000b9f5c2a4b
  - 콘텐츠 마스터: 2e802b0e30a980bea68b000b949a80a2
  - 클라이언트 보드: 25402b0e30a980ceab4c000be4f8067b

## 🔄 이 백업 사용법

새 세션에서:
```
우석 데일리 대시보드 프로젝트 이어서 진행하려고 해.
SESSION_BACKUP_우석대시보드_260221.md 파일 읽고 맥락 파악한 다음,
대시보드 파일들을 새 워크스페이스 폴더에 생성해줘.
```

### 코드 원본 (새 세션에서 재생성용)

아래는 각 파일의 전체 코드입니다. 새 세션에서 이 백업을 읽고 Write 도구로 바로 생성할 수 있습니다.

<details>
<summary>config.py 전체 코드</summary>

```python
"""
크리에이터후드 데일리 대시보드 설정
===================================
Notion Internal Integration 토큰과 DB ID를 여기에 설정합니다.
"""

# ─── Notion API ───
NOTION_TOKEN = "여기에_노션_인테그레이션_토큰_입력"  # ntn_xxxxxxxxxxxx

# ─── 국순당 관련 DB ───
DB_INTERNAL_TASKS = "2fd02b0e30a980d691c4000b9f5c2a4b"
DB_CONTENT_MASTER = "2e802b0e30a980bea68b000b949a80a2"
DB_CLIENT_BOARD = "25402b0e30a980ceab4c000be4f8067b"

# ─── CH MAG 관련 ───
DB_CHMAG_TASKS = ""

# ─── 서버 설정 ───
PORT = 5050
HOST = "127.0.0.1"
AUTO_OPEN_BROWSER = True

# ─── 3단계 공유 시스템 ───
SHARE_STAGES = {
    "1차공유": {"client_pct": 30, "internal_pct": 20, "d_minus": 14},
    "2차공유": {"client_pct": 80, "internal_pct": 50, "d_minus": 10},
    "최종공유": {"client_pct": 100, "internal_pct": 80, "d_minus": 5},
    "업로드":  {"client_pct": 100, "internal_pct": 100, "d_minus": 0},
}

TAG_ORDER = ["예정", "촬영", "1차공유", "2차공유", "최종공유", "업로드", "완료"]
```

</details>

<details>
<summary>notion_client.py 전체 코드</summary>

```python
"""
Notion API 클라이언트
====================
"""

import requests
from datetime import datetime, timedelta
from config import NOTION_TOKEN, DB_INTERNAL_TASKS, DB_CONTENT_MASTER, TAG_ORDER, SHARE_STAGES

NOTION_API = "https://api.notion.com/v1"
HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

def _query_database(db_id, filter_obj=None, sorts=None):
    url = f"{NOTION_API}/databases/{db_id}/query"
    body = {}
    if filter_obj: body["filter"] = filter_obj
    if sorts: body["sorts"] = sorts
    results = []
    has_more = True
    start_cursor = None
    while has_more:
        if start_cursor: body["start_cursor"] = start_cursor
        resp = requests.post(url, headers=HEADERS, json=body)
        if resp.status_code != 200:
            print(f"Notion API error: {resp.status_code} - {resp.text[:200]}")
            break
        data = resp.json()
        results.extend(data.get("results", []))
        has_more = data.get("has_more", False)
        start_cursor = data.get("next_cursor")
    return results

def _extract_title(page):
    for prop_name, prop in page.get("properties", {}).items():
        if prop.get("type") == "title":
            titles = prop.get("title", [])
            return "".join(t.get("plain_text", "") for t in titles)
    return "(제목 없음)"

def _extract_date(page, prop_name):
    props = page.get("properties", {})
    if prop_name in props:
        date_prop = props[prop_name]
        if date_prop.get("type") == "date" and date_prop.get("date"):
            start = date_prop["date"].get("start", "")
            if start:
                try: return datetime.fromisoformat(start).date()
                except ValueError: return None
    return None

def _extract_select(page, prop_name):
    props = page.get("properties", {})
    if prop_name in props:
        sel = props[prop_name]
        if sel.get("type") == "select" and sel.get("select"):
            return sel["select"].get("name", "")
        elif sel.get("type") == "multi_select":
            return ", ".join(s.get("name", "") for s in sel.get("multi_select", []))
    return ""

def _extract_text(page, prop_name):
    props = page.get("properties", {})
    if prop_name in props:
        prop = props[prop_name]
        if prop.get("type") == "rich_text":
            return "".join(t.get("plain_text", "") for t in prop.get("rich_text", []))
    return ""

def get_internal_tasks():
    if not DB_INTERNAL_TASKS: return []
    pages = _query_database(DB_INTERNAL_TASKS)
    tasks = []
    for page in pages:
        title = _extract_title(page)
        if not title: continue
        tag = ""
        for pname in ["태그", "상태", "Status", "status", "Tag"]:
            tag = _extract_select(page, pname)
            if tag: break
        due_date = None
        for pname in ["날짜", "Due", "due", "Date", "date", "마감일"]:
            due_date = _extract_date(page, pname)
            if due_date: break
        if tag == "완료": continue
        d_minus = None
        if due_date: d_minus = (due_date - datetime.now().date()).days
        tasks.append({
            "title": title, "tag": tag or "미분류",
            "due_date": due_date.isoformat() if due_date else None,
            "due_display": due_date.strftime("%m/%d") if due_date else "-",
            "d_minus": d_minus, "url": page.get("url", ""), "id": page.get("id", ""),
        })
    tasks.sort(key=lambda t: (t["d_minus"] if t["d_minus"] is not None else 9999))
    return tasks

def get_content_master():
    if not DB_CONTENT_MASTER: return []
    pages = _query_database(DB_CONTENT_MASTER)
    items = []
    for page in pages:
        title = _extract_title(page)
        if not title: continue
        series = ""
        for pname in ["시리즈", "Series", "series", "카테고리"]:
            series = _extract_select(page, pname)
            if series: break
        upload_date = None
        for pname in ["업로드일", "업로드", "Upload", "upload_date"]:
            upload_date = _extract_date(page, pname)
            if upload_date: break
        status = ""
        for pname in ["상태", "Status", "status", "진행상태"]:
            status = _extract_select(page, pname)
            if status: break
        if status == "완료": continue
        d_minus = None
        if upload_date: d_minus = (upload_date - datetime.now().date()).days
        items.append({
            "title": title, "series": series or "기타", "status": status or "미분류",
            "upload_date": upload_date.isoformat() if upload_date else None,
            "upload_display": upload_date.strftime("%m/%d") if upload_date else "-",
            "d_minus": d_minus, "url": page.get("url", ""),
        })
    items.sort(key=lambda t: (t["d_minus"] if t["d_minus"] is not None else 9999))
    return items

def analyze_sharing_status(tasks, contents):
    today = datetime.now().date()
    alerts = []
    actions_today = []
    for task in tasks:
        if task["d_minus"] is not None:
            if task["d_minus"] == 0:
                actions_today.append({"title": task["title"], "action": f"오늘 마감 — {task['tag']}", "urgency": "critical"})
            elif task["d_minus"] == 1:
                alerts.append({"title": task["title"], "message": f"내일 마감 (D-1) — {task['tag']}", "urgency": "warning"})
            elif 0 < task["d_minus"] <= 3:
                alerts.append({"title": task["title"], "message": f"D-{task['d_minus']} 임박 — {task['tag']}", "urgency": "warning"})
    for content in contents:
        if content["d_minus"] is not None and content["d_minus"] > 0:
            status = content["status"]
            d = content["d_minus"]
            tag_idx = TAG_ORDER.index(status) if status in TAG_ORDER else -1
            if d <= 14 and tag_idx < TAG_ORDER.index("1차공유"):
                alerts.append({"title": content["title"], "message": f"1차 공유(30%) 준비 필요 — 업로드 D-{d}", "urgency": "warning"})
            if d <= 10 and tag_idx < TAG_ORDER.index("2차공유"):
                alerts.append({"title": content["title"], "message": f"2차 공유(80%) 긴급 — 업로드 D-{d}", "urgency": "critical"})
            if d <= 5 and tag_idx < TAG_ORDER.index("최종공유"):
                alerts.append({"title": content["title"], "message": f"최종 공유(100%) 위험 — 업로드 D-{d}", "urgency": "critical"})
    return actions_today, alerts

def get_dashboard_data():
    tasks = get_internal_tasks()
    contents = get_content_master()
    actions_today, alerts = analyze_sharing_status(tasks, contents)
    today = datetime.now().date()
    end_of_week = today + timedelta(days=(6 - today.weekday()))
    today_tasks = [t for t in tasks if t["d_minus"] is not None and t["d_minus"] <= 0]
    this_week = [t for t in tasks if t["d_minus"] is not None and 0 < t["d_minus"] <= (end_of_week - today).days]
    longterm = [t for t in tasks if t["d_minus"] is not None and t["d_minus"] > (end_of_week - today).days]
    no_date = [t for t in tasks if t["d_minus"] is None]
    series_map = {}
    for c in contents:
        series = c["series"]
        if series not in series_map: series_map[series] = []
        series_map[series].append(c)
    return {
        "date": today.strftime("%Y.%m.%d"),
        "weekday": ["월", "화", "수", "목", "금", "토", "일"][today.weekday()],
        "today_tasks": today_tasks, "this_week": this_week,
        "longterm": longterm, "no_date": no_date,
        "actions_today": actions_today, "alerts": alerts,
        "contents_by_series": series_map, "all_contents": contents,
    }
```

</details>

<details>
<summary>app.py 전체 코드 (메인 서버 — 길이 주의)</summary>

새 세션에서 이 백업 파일을 읽은 후, `/sessions/.../wooseok-dashboard/app.py` 경로에서 Read하여 복원하거나, 위 notion_client.py + config.py와 함께 아래 핵심 구조를 재생성:

- Python http.server 기반
- render_dashboard() → 다크 테마 HTML
- 3컬럼 (오늘/이번주/체크리스트) + 2컬럼 (파이프라인/롱텀+CH MAG)
- DashboardHandler: GET /, /api/memo | POST /api/checklist, /api/memo
- 로컬 JSON으로 체크리스트/메모 저장
- main()에서 자동 브라우저 열기

app.py는 약 500줄이므로, 새 세션에서는 이 백업의 VM 경로에서 직접 Read하는 것을 권장:
`/sessions/hopeful-serene-keller/wooseok-dashboard/app.py`
(단, 세션이 달라지면 이 경로는 접근 불가할 수 있음)

</details>

<details>
<summary>setup.sh 전체 코드</summary>

```bash
#!/bin/bash
set -e
echo "🚀 크리에이터후드 데일리 대시보드 설치를 시작합니다..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3이 설치되어 있지 않습니다. brew install python3"
    exit 1
fi
echo "✅ $(python3 --version) 확인됨"
python3 -m pip install -r requirements.txt --quiet
mkdir -p data
echo "✅ data/ 디렉토리 생성됨"
if grep -q "여기에_노션_인테그레이션_토큰_입력" config.py; then
    echo "⚠️  config.py에 Notion API 토큰을 입력해주세요!"
fi
echo "⏰ 매일 오전 10시 자동 실행 설정을 진행할까요? (y/n)"
read -r SETUP_SCHEDULE
if [ "$SETUP_SCHEDULE" = "y" ] || [ "$SETUP_SCHEDULE" = "Y" ]; then
    PLIST_NAME="com.creatorhood.daily-dashboard"
    PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_NAME}.plist"
    cat > "$PLIST_PATH" << PLIST_EOF

<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">

    Label${PLIST_NAME}
    ProgramArguments
        $(which python3)
        ${SCRIPT_DIR}/app.py
    
    WorkingDirectory${SCRIPT_DIR}
    StartCalendarInterval
        Hour10
        Minute0
    
    StandardOutPath${SCRIPT_DIR}/data/dashboard.log
    StandardErrorPath${SCRIPT_DIR}/data/dashboard-error.log
    RunAtLoad

PLIST_EOF
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
    launchctl load "$PLIST_PATH"
    echo "✅ 매일 오전 10시 자동 실행 설정 완료!"
fi
echo "✅ 설치 완료! python3 app.py 로 실행"
```

</details>