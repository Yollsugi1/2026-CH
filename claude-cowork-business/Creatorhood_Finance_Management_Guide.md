# Creatorhood Finance Management Guide

## 📋 개요

Creatorhood 법인 카카오뱅크 계좌 거래내역을 자동 카테고라이징하여 월별 손익계산서를 관리하는 시스템입니다.

**관리 스프레드시트**: https://docs.google.com/spreadsheets/d/10fyHAFzJ1g8iprhaVevwrwMeUOuN2q-qtqPF65-ojA4/edit

---

## 📁 시트 구조

| 시트명 | 용도 |
|:---|:---|
| `거래내역` | 카카오뱅크 거래내역 원본 데이터 |
| `원장` | 카테고리가 추가된 거래내역 (A~J열) |
| `원장 기반` | 카테고리별 월 단위 손익계산서 |

### 원장 시트 컬럼 구조 (A~J열)

| 열 | 컬럼명 | 설명 |
|:---:|:---|:---|
| A | 날짜 | 거래일 (날짜 형식) |
| B | 거래시간 | HH:MM:SS |
| C | 구분 | 입금/출금 |
| D | 적요 | 거래 내용 (카카오뱅크 원본의 '내용') |
| E | 출금액 | 출금 시 금액 (숫자) |
| F | 입금액 | 입금 시 금액 (숫자) |
| G | 거래 후 잔액 | 거래 후 계좌 잔액 |
| H | 거래구분 | 체크카드결제, 일반이체 등 |
| I | 메모 | 카카오뱅크 메모 |
| J | 카테고리 | 자동 분류된 카테고리 |

---

## 🏷️ 카테고리 분류 체계

### 수익 카테고리

| 카테고리 | 설명 | 키워드 |
|:---|:---|:---|
| **매출** | 클라이언트 매출 | (주), 주식회사, 국순당, 와이지지, 인헤이즈, 올포기어, 쉐어잇, 탈잉, 엠디글로벌넷 |
| **해외수익** | 해외 플랫폼 수익 | 해외계좌송금 |
| **금융수익** | 이자, 캐시백 | 이자, 캐시백 |
| **대표자입금** | 대표자 개인 입금 | 정수현 |

### 비용 카테고리

| 카테고리 | 설명 | 주요 키워드 |
|:---|:---|:---|
| **외주용역비** | 외주 인건비 | 임우석, 우석, 레이지요거트, 영상외주, 크몽, 에디터, 계자람, 오훈택, 디자인외주, 국순당 외주, 김예영, 김영훈, 브랜디드, 에디터 상금 |
| **SW/구독료** | 소프트웨어 구독 | (US), (GB), (IE), (SG), CLAUDE, FIGMA, OPENAI, MIDJOURNEY, GENSPARK, NOTION, SUPERHUMAN 등 해외결제 |
| **쇼핑/자재** | 물품 구매 | 쿠팡, 카카오페이, 네이버페이, 오프린트미, 쏘카, 토스, 페이플 |
| **고정비/세금** | 고정 지출 | 사회보험, 카드대금, 대출상환, 중진공, SKT, 세무서, 보험료, 청약 |
| **식비/활동비** | 식사/활동 | 성수, 맥주, 구이, 회식, 취재비, 왓타임, 간편이체 |
| **대표자출금** | 대표자 개인 출금 | 수현개인, 수현 개인 |

---

## 🔄 업데이트 프로세스

### Step 1: 카카오뱅크 거래내역 다운로드
1. 카카오뱅크 앱/웹에서 거래내역 엑셀 다운로드
2. 파일명 예시: `카카오뱅크_거래내역_YYYYMMDD.xlsx`

### Step 2: Claude에게 업데이트 요청
```
[파일 첨부 후]
"이전 원장(MM/DD까지) 이후 추가분을 반영해서 
신규거래분과 전체원장 시트를 업데이트해줘"
```

### Step 3: 결과물 Google Sheets 반영
- **신규_거래_XXXX-XXXX.xlsx**: 기존 원장 마지막 행 다음에 붙여넣기
- **전체_원장_XXXX.xlsx**: 원장 시트 전체 교체 (선택)

---

## 🐍 카테고라이징 Python 코드

```python
import pandas as pd

def categorize_income(row):
    """수익(입금) 카테고라이징"""
    desc = str(row['내용']) if pd.notna(row['내용']) else ""
    
    if "해외계좌송금" in desc:
        return "해외수익"
    elif "캐시백" in desc or "이자" in desc:
        return "금융수익"
    elif "정수현" in desc:
        return "대표자입금"
    elif any(x in desc for x in ["(주)", "주식회사", "엠디글로벌넷", "탈잉", "올포기어", 
                                  "쉐어잇", "국순당", "와이지지", "인헤이즈"]):
        return "매출"
    else:
        if desc in ["네이버페이", "884"]: 
            return "기타"
        return "매출" 

def categorize_expense(row):
    """비용(출금) 카테고라이징"""
    desc = str(row['내용']) if pd.notna(row['내용']) else ""
    desc_upper = desc.upper()
    
    # 대표자 출금
    if "수현개인" in desc or "수현 개인" in desc:
        return "대표자출금"
    
    # 외주용역비
    outsourcing_keywords = [
        "임우석", "우석", "레이지요거트", "레이지 요거트", "영상외주", 
        "개인계좌 이체", "크몽", "에디터", "계자람", "오훈택", "디자인외주", 
        "국순당 외주", "탈잉", "브랜디드", "브랜드키트", "우리예술", 
        "김예영", "김영훈", "에디터 상금"
    ]
    
    # SW/구독료 (해외결제 포함)
    sw_keywords = [
        "(US)", "(GB)", "(NL)", "(IE)", "(SG)", "(CZ)", "(CA)", "(AE)", 
        "PAYPAL", "GOOGLE", "HIGGSFIELD", "CLAUDE", "FIGMA", "BEATPORT", 
        "ADOBE", "OPENAI", "NY TIMES", "구글", "FACEBK", "GENSPARK", "TLDX", 
        "모두싸인", "ELEVENLABS", "SUPERHUMAN", "XAI", "MIDJOURNEY", 
        "구글코리아", "ANTHROPIC", "NOTION", "CAPTIONS", "SUNO", "GHOST",
        "MANYCHAT", "BUFFER", "FRAMER", "GODADDY", "EPIDEMIC", 
        "BEYOND THE GAME", "DEHANCER", "보이저엑스", "릴리스에이아이", 
        "한글과컴퓨터", "REVERENTE", "SCREENSTUDIO", "FRAMECREATE", 
        "PATREON", "DOPAMINE", "INTERPROMO", "KIVE", "TRACT"
    ]
    
    # 쇼핑/자재
    shopping_keywords = [
        "쿠팡", "카카오페이", "네이버페이", "오프린트미", "다이소", "구매", 
        "디자인애드", "아머스포츠", "SSD", "허브", "페이플", "토스", 
        "발트페이먼츠", "(주)카카오", "ALIEXPRESS", "쏘카", "타임앤코", 
        "아이보", "이구홈", "쿠팡이츠", "물품구매비", "굿즈", "강의안", 
        "상상플래닛", "복합기", "네이버페이충전", "토스페이"
    ]
    
    # 고정비/세금
    fixed_keywords = [
        "카드대금", "카드", "고정비", "사회보험", "이자", "중진공", "보험", 
        "SKT", "교통", "후불", "유한회사 미소", "대출상환", "세무서", 
        "소득세", "근로소득세", "보험료", "정책자금", "전자인증", 
        "보증보험", "청약", "건강보험", "세이프박스"
    ]
    
    # 식비/활동비
    food_keywords = [
        "성수", "맥주", "구이", "고집132", "식당", "카페", "커피", "FOOD", 
        "치킨", "에그타", "업.사이드", "룰루랄라", "뼈탄", "토끼와거북", 
        "몰리노", "플레이버타운", "실비옥", "롯데백화점", "사운드 클라스",
        "취재비", "회식", "왓타임", "간편이체"
    ]
    
    if any(k in desc for k in outsourcing_keywords):
        return "외주용역비"
    elif any(k in desc for k in fixed_keywords):
        return "고정비/세금"
    elif any(k in desc_upper for k in sw_keywords):
        return "SW/구독료"
    elif any(k in desc for k in shopping_keywords):
        return "쇼핑/자재"
    elif any(k in desc for k in food_keywords):
        return "식비/활동비"
    else:
        return "기타"

# 카테고리 적용
df['카테고리'] = df.apply(
    lambda row: categorize_income(row) if row['구분'] == '입금' else categorize_expense(row), 
    axis=1
)
```

---

## 📊 데이터 포맷팅 코드

```python
def format_dataframe(df):
    """원장 형식으로 데이터 포맷팅"""
    df = df.copy()
    
    # 거래일시 → 날짜 + 거래시간 분리
    df['날짜_str'] = df['거래일시'].str.split(' ').str[0]
    df['거래시간'] = df['거래일시'].str.split(' ').str[1]
    df['날짜'] = pd.to_datetime(df['날짜_str'], format='%Y.%m.%d')
    
    # 내용 → 적요
    df['적요'] = df['내용']
    
    # 거래금액 → 출금액/입금액 분리
    def parse_amount(x):
        if pd.isna(x): return 0
        if isinstance(x, (int, float)): return x
        return int(str(x).replace(',', '').replace(' ', ''))
    
    df['금액_숫자'] = df['거래금액'].apply(parse_amount)
    df['출금액'] = df.apply(lambda r: abs(r['금액_숫자']) if r['구분'] == '출금' else '', axis=1)
    df['입금액'] = df.apply(lambda r: abs(r['금액_숫자']) if r['구분'] == '입금' else '', axis=1)
    
    # 컬럼 순서 정리
    return df[['날짜', '거래시간', '구분', '적요', '출금액', '입금액', 
               '거래 후 잔액', '거래구분', '메모', '카테고리']]
```

---

## 📈 현재 상태 (2026.01.02 기준)

- **전체 원장**: 244건 (2025.08.25 ~ 2026.01.02)
- **마지막 업데이트**: 2026.01.02 17:55:50

### 최근 월별 요약

| 월 | 총 수익 | 총 비용 | 순이익 |
|:---:|---:|---:|---:|
| 2025.12 | 약 9,409,000원 | 약 13,812,000원 | 약 -4,403,000원 |

> ⚠️ 12월은 연말 외주비 정산 등으로 비용이 높음

---

## 🔧 키워드 업데이트 가이드

새로운 거래처나 서비스가 추가되면 해당 카테고리의 키워드 리스트에 추가:

```python
# 예: 새로운 외주 협력사 추가
outsourcing_keywords.append("새협력사명")

# 예: 새로운 SW 구독 서비스 추가
sw_keywords.append("NEWSERVICE")
```

### 자주 추가되는 패턴
- **해외 SaaS**: `(US)`, `(GB)` 등 국가코드로 시작하면 자동으로 SW/구독료
- **새 외주자**: 이름이나 "외주" 키워드 포함 시 외주용역비
- **새 식당**: 지역명(성수 등) 포함 시 식비/활동비

---

## 📝 업데이트 이력

| 날짜 | 내용 |
|:---|:---|
| 2025.11.25 | 초기 카테고라이징 시스템 구축 (158건) |
| 2025.12.22 | 12월 거래 반영 (213건) |
| 2026.01.02 | 연말/연초 거래 반영 (244건) |

---

## 💡 Cowork 사용 팁

1. **정기 업데이트**: 매주 또는 격주로 카카오뱅크 거래내역 다운로드 후 업데이트
2. **월말 정산**: 월말에 해당 월 카테고리별 지출 상세 내역 확인 요청
3. **카테고리 검토**: "기타"로 분류된 항목 확인 후 키워드 추가 여부 결정
4. **손익 분석**: 월별/분기별 손익 추이 분석 요청 가능

```
예시 요청:
- "12월 카테고리별 지출 상세 내역 보여줘"
- "이번 분기 SW/구독료 추이 분석해줘"
- "외주용역비 월별 변화 그래프로 보여줘"
```
