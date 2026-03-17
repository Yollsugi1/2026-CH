# Claude 계정 이전 완벽 가이드

## 📋 목차
1. 메모리 설정
2. 커넥터 재연결
3. 스킬 재생성
4. 검증 및 테스트

---

## 1️⃣ 메모리 설정

### 단계
1. 새 Claude 계정에 로그인
2. 우측 하단 프로필 아이콘 클릭
3. **Settings** 클릭
4. **Profile** 탭으로 이동
5. **Custom Instructions** 또는 **Your custom instructions** 섹션 찾기
6. `MEMORY-custom-instructions.txt` 파일의 내용을 복사하여 붙여넣기
7. 저장

### 확인 방법
새 계정에서 Claude에게 물어보기:
```
나에 대해 뭘 알고 있어?
```

Claude가 Creatorhood, CH MAG, Zone X 등에 대해 언급하면 성공!

---

## 2️⃣ 커넥터 재연결

### 단계
1. Settings > **Integrations** 탭 이동
2. 다음 서비스들을 하나씩 연결:

**필수 연결:**
- ✓ **Notion** (노션 페이지 접근)
- ✓ **Google Drive** (드라이브 파일 접근)
- ✓ **Gmail** (이메일 읽기)
- ✓ **Google Calendar** (캘린더 관리)

**선택 연결:**
- ✓ **Craft** (Craft 문서 접근)
- ✓ **Figma** (Figma 디자인 접근)

### 연결 방법
각 서비스 옆의 **Connect** 버튼 클릭 → 권한 허용

### 확인 방법
```
내 구글 드라이브에서 최근 파일 3개 보여줘
```

---

## 3️⃣ 스킬 재생성

### 중요!
새 계정에서는 커스텀 스킬을 하나씩 다시 만들어야 합니다.

### 스킬 재생성 순서

#### 1) brand-knowledge 스킬
새 계정에서 Claude에게 요청:
```
새로운 스킬을 만들어줘. 
이름: brand-knowledge
내용: brand-knowledge-SKILL.md 파일의 전체 내용을 복사해서 붙여넣기
```

#### 2) content-frameworks 스킬
```
새로운 스킬을 만들어줘.
이름: content-frameworks
내용: content-frameworks-SKILL.md 파일의 전체 내용을 복사해서 붙여넣기
```

#### 3) content-planner 스킬
```
새로운 스킬을 만들어줘.
이름: content-planner
내용: content-planner-SKILL.md 파일의 전체 내용을 복사해서 붙여넣기
```

#### 4) quotation-builder 스킬
```
새로운 스킬을 만들어줘.
이름: quotation-builder
내용: quotation-builder-SKILL.md 파일의 전체 내용을 복사해서 붙여넣기
```

#### 5) skill-manager 스킬
```
새로운 스킬을 만들어줘.
이름: skill-manager
내용: skill-manager-SKILL.md 파일의 전체 내용을 복사해서 붙여넣기
```

### 확인 방법
모든 스킬 생성 후 테스트:
```
크리에이터후드의 역량에 대해 설명해줘
```
→ brand-knowledge 스킬이 작동하면 Kuksundang, Pelicana 사례 등을 언급함

```
A-B-C 프레임워크가 뭐야?
```
→ content-frameworks 스킬이 작동하면 윤성원 프레임워크 설명

---

## 4️⃣ 검증 및 테스트

### 최종 체크리스트

**메모리 확인:**
- [ ] "나에 대해 뭘 알고 있어?" 물어봤을 때 Creatorhood 언급
- [ ] "나의 주요 클라이언트는?" 물어봤을 때 Kuksundang, Pelicana 언급

**커넥터 확인:**
- [ ] "내 노션 페이지 목록 보여줘" 작동
- [ ] "내 구글 드라이브 파일 검색해줘" 작동
- [ ] "오늘 일정 알려줘" 작동

**스킬 확인:**
- [ ] "크리에이터후드의 강점이 뭐야?" → brand-knowledge 작동
- [ ] "A-B-C 프레임워크 설명해줘" → content-frameworks 작동
- [ ] "콘텐츠 기획해줘" → content-planner 작동
- [ ] "견적서 만들어줘" → quotation-builder 작동

---

## 💡 팁

### 스킬 생성 시 주의사항
1. **한 번에 하나씩**: 스킬을 하나 만들고 테스트한 후 다음 스킬로 진행
2. **전체 내용 복사**: SKILL.md 파일의 `---`부터 끝까지 **전체**를 복사
3. **이름 정확히**: 스킬 이름은 대시(-)로 연결 (예: brand-knowledge)

### 문제 해결
**스킬이 작동하지 않을 때:**
1. 스킬이 제대로 생성되었는지 확인
2. Claude에게 "available skills 보여줘" 요청
3. 스킬 이름이 정확한지 확인
4. 스킬 삭제 후 재생성

**커넥터가 작동하지 않을 때:**
1. Settings > Integrations에서 연결 상태 확인
2. 필요시 연결 해제 후 재연결
3. 브라우저 새로고침 후 재시도

---

## ✅ 완료!

모든 단계를 완료하면 새 계정에서도 현재와 동일하게 작업할 수 있습니다.

**이전 완료 확인:**
```
크리에이터후드의 2026년 사업 계획에 대해 알려줘
```

Claude가 4개 영역(content production, agency services, sub-channel magazines, Zone X)을 언급하면 성공적으로 이전 완료!
