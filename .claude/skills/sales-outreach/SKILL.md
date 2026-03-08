---
name: sales-outreach
description: |
  Analyze client marketing partnership inquiries and create customized sales proposals for Creatorhood. Use when user says "대행영업 스킬 사용해서" or when analyzing marketing agency RFPs, client inquiries, or partnership requests to create tailored outbound sales emails. Integrates with quotation-builder for pricing proposals.
---

# Creatorhood Sales Outreach Skill

Generate customized sales proposal emails in response to client marketing partnership inquiries. Analyzes client needs and creates tailored proposals based on Creatorhood's capabilities and proven frameworks.

## Process

Follow these steps in order:

### Step 1: Analyze the Inquiry

When user provides a client inquiry or RFP, analyze:

**Extract Key Information:**
- Client type (hotel, F&B, sports, e-commerce, etc.)
- Requested channels (Instagram, YouTube, etc.)
- Budget constraints (if provided)
- Scope requirements (content creation, management, ads, etc.)
- Timeline expectations
- Special requirements (portfolio, experience in specific industry, etc.)

**Identify Client Needs:**
- What problem are they trying to solve?
- What business outcomes do they want?
- What's their level of maturity (new to social vs. scaling)?
- Are they budget-driven or quality-driven?

### Step 2: Present Strategic Analysis

Present the analysis in this format:

**[Client Name] 의뢰 분석**

**요구사항 요약:**
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]

**우리의 대응 전략:**
[One paragraph explaining how Creatorhood can uniquely address their needs, referencing relevant frameworks from brand-knowledge skill (e.g., scene-based strategy for F&B, heritage repositioning for legacy brands, performance model for e-commerce, etc.). Be specific about which of our proven capabilities are relevant.]

### Step 3: Draft Customized Proposal Email

Use the outbound email template from `assets/outbound-template.md` as base structure, but customize heavily:

**Customization Guidelines:**

1. **Opening Hook** - Reference their specific inquiry/post
   - Mention where you saw their request (e.g., "아이보스에서 SNS대행 의뢰 포스트 확인 후 연락드립니다")
   - Show you understand their specific situation

2. **Brand Context Section** - Keep standard intro brief, then pivot to relevance
   - Standard: "저희는 CH MAG이라는 스포츠/라이프스타일 매거진과..."
   - Customization: Add 1-2 sentences connecting to their industry/needs

3. **Differentiation Points** - Select most relevant 2-3 from template
   - For strategic clients: Emphasize "전략 기반의 콘텐츠 설계"
   - For lifestyle brands: Emphasize "매거진의 시각"
   - For all: Keep "체계적 프로세스"

4. **Portfolio/Case Studies** - Match to their industry
   - Hotel/lifestyle: Reference Inhaze, 라이프스타일 approach
   - F&B: Reference 국순당 (Kuksundang)
   - Sports: Reference CH MAG, Zone X
   - Heritage brands: Reference cultural/lifestyle branding approach

5. **Scope Response** - Address their specific requirements
   - If they listed specific deliverables → Confirm capability for each
   - If budget is provided → Use quotation-builder skill to propose scope
   - If asking for quote → Explain next steps: "구체적 견적은 [이유] 파악 후 제안드리겠습니다"

6. **Call to Action** - Match their request stage
   - For RFP comparison stage: "견적 및 제안서 전달드리겠습니다"
   - For partner search: "미팅 통해 구체적 제안 드리고 싶습니다"
   - For inquiries: "추가로 필요하신 자료나 궁금하신 점 있으시면 편하게 말씀해주세요"

**Standard Elements to Always Include:**
- Creatorhood portfolio link (구글드라이브 링크)
- Professional sign-off: "정수현 드림"
- Maintain warm, professional Korean business tone

### Step 4: Quotation Integration (When Needed)

If client provides budget or requests specific quote:

1. **Ask user if quote is needed:** "견적 제안이 필요하신가요? quotation-builder 스킬을 사용해 구체적인 견적을 작성할 수 있습니다."

2. **If yes, use quotation-builder skill:**
   - Provide analyzed requirements to quotation-builder
   - Get structured quote
   - Integrate into email naturally (as attachment reference or summary)

3. **If budget is too constrained:**
   - Be honest about feasibility
   - Suggest phased approach or reduced scope
   - Or gracefully decline: "현재 예산으로는 저희가 제공하는 퀄리티를 보장하기 어려울 것 같습니다"

## Email Tone Guidelines

**Maintain Creatorhood's voice:**
- Professional but warm (not stiff corporate)
- Confident but not arrogant
- Strategic partner, not vendor
- Show expertise through examples, not claims

**Korean business communication:**
- Use 존댓말 consistently
- Balance formality with approachability
- Clear structure with proper spacing
- Professional but not overly formal

**Avoid:**
- Over-promising or generic claims
- Listing every capability (be selective)
- Being defensive about pricing
- Apologetic tone

## Integration with Other Skills

**Must use together:**
- **brand-knowledge**: Reference relevant case studies, frameworks, and value propositions
- **quotation-builder**: Generate detailed quotes when budget/scope is clear

**May reference:**
- **content-frameworks**: If discussing specific content approach
- User memory: Past conversations about pricing, positioning, or similar clients

## Common Scenarios

### Scenario A: Budget-Driven RFP (Example 2 from user)
**Client provides:** Fixed budget (e.g., 월 66만원 vs 133만원)

**Response approach:**
1. Analyze what's realistic at each budget level
2. Use quotation-builder to structure options
3. Be honest about trade-offs
4. Propose A vs B plan clearly

### Scenario B: Exploratory Inquiry (Example 1 from user)
**Client asks:** General quote for comparison

**Response approach:**
1. Show understanding of their space (e.g., "호텔 브랜드의 SNS는...")
2. Explain our strategic approach briefly
3. Suggest meeting/call to understand needs before quote
4. Provide portfolio and ballpark ranges if helpful

### Scenario C: Execution Partner Request
**Client is agency:** Looking for execution partner

**Response approach:**
1. Clarify our positioning (strategic partner, not just execution)
2. Explain what we do differently
3. If scope is purely tactical → Consider fit
4. If budget allows strategic input → Emphasize that value

## Portfolio Links

**Always include:**
- Google Drive portfolio link: (사용자가 제공할 링크)
- Mention: "상세한 포트폴리오 및 콘텐츠 샘플은 첨부된 링크를 통해 확인 부탁드립니다"

## Templates and Assets

- `assets/outbound-template.md` - Base outbound email template structure
- Use brand-knowledge skill for case studies and frameworks
- Use quotation-builder skill for detailed pricing proposals
