# Quotation Templates

Ready-to-use quotation formats for different service types and client situations. Copy, customize, and send.

---

## 양식 A: 정식 견적서 (PDF형)

국내 클라이언트 공식 제출용. HTML로 작성 후 Chrome headless로 PDF 변환한다.

### Markdown 구조 (내부 작업용)

```markdown
# 견적서

## [프로젝트명]

---

|  |  |
|---|---|
| **수신** | [클라이언트명] |
| **발신** | 크리에이터후드 |
| **작성일** | [YYYY년 M월 D일] |
| **유효기간** | 발행일로부터 30일 |

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | [프로젝트명] |
| 제작 목적 | [목적] |
| 채널 | [인스타그램 릴스 / 유튜브 등] |
| 영상 길이 | [00초 ~ 0분] |
| 홍보 아이템 | [홍보 대상] |
| 출연 | [출연자] |
| 촬영 장소 | [장소 (위치 정보)] |

---

## 2. 산출물

| # | 산출물 | 규격 | 수량 |
|---|---|---|---|
| 1 | [산출물명] | [규격] | [수량] |
| 2 | [산출물명] | [규격] | [수량] |
| 3 | [산출물명] | [규격] | |

---

## 3. 제작 견적

| 구분 | 상세 | 인력 | 시간 | 단가 (1인/1h) | 금액 |
|---|---|---|---|---|---|
| [항목1] | [상세 설명] | [N명] | [Nh] | ₩50,000 | ₩[금액] |
| [항목2] | [상세 설명] | [N명] | [Nh] | ₩50,000 | ₩[금액] |

---

### 합계

| | |
|---|---|
| **제작 총액 (VAT 별도)** | **₩[총액]** |

---

## 4. 제작 일정

| 단계 | 내용 | 일정 |
|---|---|---|
| [단계1] | [내용] | [M/D ~ M/D (N일)] |
| [단계2] | [내용] | [M/D (N일)] |

> **총 예상 소요**: [단계1] N일 → [단계2] N일 → [단계3] N일

---

## 5. 참고사항

- 수정편집은 **2차까지** 포함이며, 3차 이상 수정 시 별도 협의
- [프로젝트별 추가 참고사항]
- 본 견적은 **1회성 프로젝트** 기준이며, 추가 제작 시 별도 협의

---

## 6. 결제 조건

| 항목 | 내용 |
|---|---|
| 결제 방식 | 세금계산서 발행 |
| 결제 시기 | 일정 확정 후 계산서 발행, 납품 완료 후 익월 정산 |
| 계좌 | 별도 안내 |

---

> **크리에이터후드**
> 담당: 정수현
> 연락처: 010-3879-4716
> 메일: sh.jung@teamcreatorhood.com
```

### HTML 템플릿 (PDF 변환용)

PDF 변환 시 아래 HTML 구조를 사용한다. `[placeholder]` 부분을 실제 값으로 치환하여 사용.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>견적서 - [프로젝트명]</title>
<style>
  @page { size: A4; margin: 20mm 18mm 20mm 18mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    color: #1a1a1a; font-size: 10.5pt; line-height: 1.65;
  }
  .header {
    text-align: center; margin-bottom: 32px;
    padding-bottom: 20px; border-bottom: 2.5px solid #1a1a1a;
  }
  .header h1 { font-size: 22pt; font-weight: 700; letter-spacing: 8px; margin-bottom: 10px; }
  .header h2 { font-size: 12pt; font-weight: 400; color: #555; }
  .meta-table { width: 100%; margin-bottom: 28px; border-collapse: collapse; }
  .meta-table td { padding: 5px 0; font-size: 10pt; vertical-align: top; }
  .meta-table td:first-child { width: 80px; font-weight: 600; color: #555; }
  .section { margin-bottom: 24px; }
  .section-title {
    font-size: 11.5pt; font-weight: 700; margin-bottom: 10px;
    padding-bottom: 4px; border-bottom: 1.5px solid #1a1a1a;
  }
  .section-num { color: #888; font-weight: 400; margin-right: 6px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  table.data-table th {
    background: #f5f5f5; font-weight: 600; font-size: 9.5pt; text-align: left;
    padding: 7px 8px; border-top: 1.5px solid #1a1a1a; border-bottom: 1px solid #ccc;
  }
  table.data-table td {
    padding: 7px 8px; font-size: 9.5pt; border-bottom: 1px solid #e5e5e5; vertical-align: top;
  }
  table.data-table tr:last-child td { border-bottom: 1.5px solid #1a1a1a; }
  table.overview-table td {
    padding: 5px 8px; font-size: 9.5pt; border-bottom: 1px solid #e5e5e5; vertical-align: top;
  }
  table.overview-table td:first-child {
    width: 100px; font-weight: 600; color: #555; background: #fafafa;
  }
  table.overview-table tr:first-child td { border-top: 1.5px solid #1a1a1a; }
  table.overview-table tr:last-child td { border-bottom: 1.5px solid #1a1a1a; }
  .total-box { margin-top: 8px; margin-bottom: 4px; }
  .total-box table { width: 320px; margin-left: auto; border-collapse: collapse; }
  .total-box td { padding: 6px 10px; font-size: 10.5pt; }
  .total-box tr.grand-total td {
    font-weight: 700; font-size: 11.5pt;
    border-top: 1.5px solid #1a1a1a; border-bottom: 2.5px solid #1a1a1a;
    padding-top: 8px; padding-bottom: 8px;
  }
  .total-box td:last-child { text-align: right; }
  .amount { text-align: right; white-space: nowrap; }
  .center { text-align: center; }
  .notes { margin-top: 4px; }
  .notes li { font-size: 9.5pt; margin-bottom: 3px; margin-left: 16px; color: #333; }
  .schedule-summary {
    margin-top: 8px; padding: 8px 12px; background: #f8f8f8;
    border-left: 3px solid #1a1a1a; font-size: 9.5pt; font-weight: 500;
  }
  table.payment-table td {
    padding: 5px 8px; font-size: 9.5pt; border-bottom: 1px solid #e5e5e5; vertical-align: top;
  }
  table.payment-table td:first-child {
    width: 90px; font-weight: 600; color: #555; background: #fafafa;
  }
  table.payment-table tr:first-child td { border-top: 1.5px solid #1a1a1a; }
  table.payment-table tr:last-child td { border-bottom: 1.5px solid #1a1a1a; }
  .footer {
    margin-top: 36px; padding-top: 16px; border-top: 1px solid #ccc;
    font-size: 9.5pt; color: #555; line-height: 1.8;
  }
  .footer strong { color: #1a1a1a; font-size: 10.5pt; }
</style>
</head>
<body>
  <!-- 헤더, 메타, 섹션 1~6, 푸터를 Markdown 구조와 동일하게 배치 -->
  <!-- 실제 생성 시 위 CSS 그대로 사용하고 내용만 치환 -->
</body>
</html>
```

### PDF 생성 커맨드

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --no-pdf-header-footer \
  --print-to-pdf="[출력경로]/[파일명].pdf" \
  "[HTML파일경로]"
```

### 실제 사용 예시

**백세주 × 포차포포 견적서** (2026.03.17):
- 파일: `국순당-자동화-팀공유/[견적서] 백세주 × 포차포포 SNS 영상 제작_크리에이터후드.pdf`
- 견적 구조: 촬영 및 영상 기획 / 촬영 / 썸네일 및 캡션 카피라이팅 / 영상 편집
- 단가: ₩50,000/인/시간
- 총액: ₩1,850,000 (VAT 별도)

---

## 양식 B: 제안서형 견적 (텍스트)

신규 클라이언트 영업 및 제안용. Markdown 또는 텍스트로 작성하여 메일/메신저로 전달.

---

## Template 1: Full-Service Retainer

```
QUOTATION

To: [Client Name]
From: Creatorhood
Date: [Date]
Valid Until: [30 days from date]

RE: Social Media Partnership Proposal

---

EXECUTIVE SUMMARY

This proposal outlines a comprehensive social media partnership to [primary goal: e.g., expand younger demographics, drive sales, reposition brand].

Investment: ₩3,500,000 per month
Commitment: 6 months initial term
Start Date: [Proposed date]

---

SCOPE OF WORK

STRATEGY
• Brand and content strategy development
• Monthly content calendar and planning
• Performance analysis and optimization
• Competitive landscape monitoring

CONTENT PRODUCTION
• 5 shortform videos per month (Reels/Shorts/TikTok)
  - Concept development and scripting
  - Professional shooting and editing
  - Platform optimization
• 10 image posts per month (feed and carousel)
  - Photography or design
  - Art direction and styling
• All copywriting (captions, hashtags, CTAs)

SOCIAL MEDIA MANAGEMENT
• Instagram account management
• Content scheduling and posting
• Community management (comments and DMs, business hours)
• Story updates (3-5 per week)

REPORTING & MEETINGS
• Monthly performance reports
• Monthly strategy session (2 hours)
• Email and Slack support (business hours)

---

TIMELINE & DELIVERABLES

Month 1 (Foundation): ₩4,500,000
• Brand positioning workshop
• Content strategy finalization
• Visual identity development
• First content production (8-10 pieces)

Months 2-6 (Ongoing): ₩3,500,000 per month
• 15 content pieces per month (5 video, 10 image)
• Full social management
• Monthly reporting and optimization

Total 6-Month Investment: ₩22,000,000

---

NOT INCLUDED

• Paid advertising spend (management available separately)
• Influencer or creator fees
• Event coverage beyond agreed scope
• Additional platforms beyond Instagram
• Stock assets requiring commercial licensing
• Travel outside Seoul metro area

---

PAYMENT TERMS

• Monthly invoice on 1st of month
• Net 15 payment terms (due within 15 days)
• First month (Foundation): Due upon signing
• Bank transfer or credit card accepted

---

TERMS

• 6-month initial commitment
• Auto-renewal monthly thereafter
• 30-day cancellation notice
• Standard Creatorhood Terms apply (attached)

---

NEXT STEPS

1. Review proposal and discuss any questions
2. Sign agreement and submit first payment
3. Kick-off workshop (Week 1)
4. First content delivered (Weeks 3-4)

Questions? Contact:
[Your Name]
[Email]
[Phone]

---

ACCEPTANCE

Client Name: ___________________
Signature: ___________________
Date: ___________________

This quotation is valid for 30 days from date above.
```

---

## Template 2: Performance Partnership (E-commerce)

```
QUOTATION

To: [Client Name]
From: Creatorhood
Date: [Date]
Valid Until: [30 days from date]

RE: Performance Partnership Proposal

---

EXECUTIVE SUMMARY

This proposal outlines a performance-based partnership where we create content designed to drive sales, with compensation tied directly to results.

Model: Hybrid
Base Fee: ₩800,000 per month
Revenue Share: 12% of attributed sales

Minimum Term: 3 months (pilot)
Start Date: [Proposed date]

---

HOW IT WORKS

WE CREATE CONVERSION-FOCUSED CONTENT
• 10-12 pieces per month optimized for sales
• Before/after, tutorials, social proof, product education
• Platform: Instagram (Reels, Stories, Feed)

WE TRACK ATTRIBUTION
• Unique UTM parameters on all links
• Dedicated coupon codes: [CHMAG10, CREATOR12, etc.]
• Google Analytics 4 e-commerce tracking
• Monthly reconciliation with full transparency

YOU PAY BASED ON RESULTS
• Base fee: ₩800,000 per month (covers core production costs)
• Revenue share: 12% of sales we directly attribute
• Example: ₩10M attributed sales → ₩800K base + ₩1.2M share = ₩2M total

---

EXPECTED RESULTS (3-Month Target)

Conservative:
• ₩8M monthly attributed sales
• Your cost: ₩1.76M (₩800K base + ₩960K share)
• ROAS: 4.5x

Target:
• ₩12M monthly attributed sales
• Your cost: ₩2.24M (₩800K base + ₩1.44M share)
• ROAS: 5.4x

Stretch:
• ₩18M monthly attributed sales
• Your cost: ₩2.96M (₩800K base + ₩2.16M share)
• ROAS: 6.1x

---

SCOPE OF WORK

CONTENT PRODUCTION
• 10-12 conversion-focused pieces per month
• Mix of Reels, Stories, and Feed posts
• All designed with clear CTAs and tracking

ATTRIBUTION SETUP
• UTM parameter structure
• GA4 event tracking implementation
• Coupon code system
• Link-in-bio tracking

OPTIMIZATION
• Weekly performance review
• Content iteration based on data
• A/B testing of hooks, formats, CTAs
• Continuous improvement

REPORTING
• Weekly performance snapshot (email)
• Bi-weekly strategy session (1 hour)
• Monthly comprehensive report with reconciliation
• Transparent sales attribution data

---

NOT INCLUDED

• Social media management (posting only, no community management)
• Brand strategy or positioning work
• Paid advertising
• Multi-platform (focused on Instagram for attribution)

---

PAYMENT TERMS

BASE FEE:
• ₩800,000 per month
• Invoiced on 1st of month
• Net 15 payment terms

REVENUE SHARE:
• Reconciled first week of following month
• Invoice issued by 10th of month
• Payment due Net 15 (by 25th of month)
• Includes transparent sales report

Example Payment Schedule:
• Jan 1: Base fee invoice (₩800K) for January
• Jan 30: January closes with ₩10M attributed sales
• Feb 8: Review sales data together
• Feb 10: Revenue share invoice (₩1.2M) for January
• Feb 25: Payment due

---

TERMS

• 3-month pilot minimum
• After pilot, month-to-month with 30-day notice
• Mutual evaluation at 3 months
• Client has full visibility into tracking and attribution
• We both must agree on attribution methodology before start

---

WHY THIS MODEL WORKS

FOR YOU:
• Pay for results, not just activity
• Clear ROI visibility
• Reduced risk (we share it)
• Our incentives align with your success

FOR US:
• Proves our confidence in delivering results
• Allows us to demonstrate value clearly
• Sustainable if we perform well

---

NEXT STEPS

1. Review proposal and attribution methodology
2. Q&A call if needed
3. Sign agreement
4. Week 1: Attribution setup
5. Week 2: First content production
6. Week 3: Launch and tracking begins

Questions? Contact:
[Your Name]
[Email]
[Phone]

---

ACCEPTANCE

Client Name: ___________________
Signature: ___________________
Date: ___________________

This quotation is valid for 30 days from date above.
```

---

## Template 3: Starter Package (Budget-Conscious)

```
QUOTATION

To: [Client Name]
From: Creatorhood
Date: [Date]
Valid Until: [30 days from date]

RE: Starter Package Proposal

---

EXECUTIVE SUMMARY

This proposal outlines a starter-level partnership designed for businesses ready to build their social presence but working with a limited budget.

Investment: ₩2,000,000 per month
Commitment: 3 months initial
Start Date: [Proposed date]

---

WHAT'S INCLUDED

FOUNDATION (Month 1)
• Brand positioning workshop (half-day)
• Visual identity basics (social templates)
• Content strategy framework
• First 10 pieces of content

ONGOING (Months 2-3)
• 10 content pieces per month
  - 3 shortform videos (Reels/Shorts)
  - 7 image posts (feed)
• Copywriting for all content
• Instagram posting and scheduling
• Bi-weekly check-in calls (30 min)
• Monthly performance report

---

WHAT'S NOT INCLUDED

• Full social media management (no community management)
• Multi-platform (Instagram only)
• Premium production (standard quality)
• Additional platforms or services

---

UPGRADE PATH

After 3 months, you can:
• Continue at ₩2M/month (starter level)
• Upgrade to Growth Package (₩3.5M/month)
  - Increase to 15 pieces/month
  - Add community management
  - Add second platform
• Upgrade to Full Service (₩4-5M/month)
  - Complete social partnership

---

TIMELINE

Month 1: ₩2,000,000
• Foundation workshop and setup
• First 10 pieces produced

Months 2-3: ₩2,000,000 per month
• 10 pieces per month
• Ongoing optimization

Total 3-Month Investment: ₩6,000,000

---

PAYMENT TERMS

• Monthly invoice on 1st of month
• Net 15 payment terms
• First month due upon signing
• Bank transfer or credit card

---

TERMS

• 3-month initial commitment
• Month-to-month after initial term
• 30-day cancellation notice
• Upgrade to higher tier available anytime

---

NEXT STEPS

1. Review and discuss
2. Sign agreement
3. Schedule kick-off workshop
4. Begin content production

Questions? Contact:
[Your Name]
[Email]
[Phone]

---

ACCEPTANCE

Client Name: ___________________
Signature: ___________________
Date: ___________________

This quotation is valid for 30 days from date above.
```

---

## Template 4: Project-Based (Single Campaign)

```
QUOTATION

To: [Client Name]
From: Creatorhood
Date: [Date]
Valid Until: [30 days from date]

RE: [Campaign Name] Production

---

PROJECT OVERVIEW

Campaign: [Name and description]
Objective: [Primary goal]
Timeline: [Start] to [End] ([X] weeks)

Total Investment: ₩5,000,000

---

DELIVERABLES

PHASE 1: STRATEGY & PLANNING (Week 1-2)
• Campaign concept development
• Content and channel strategy
• Production planning and timeline
Deliverable: Campaign playbook

PHASE 2: PRODUCTION (Week 3-5)
• 3 hero videos (60-90 sec each)
  - Concept and scripting
  - Full-day shoot
  - Professional editing and color grading
  - Platform optimization
• 10 supporting images
  - Photography session
  - Editing and retouching
• All copy (captions, descriptions, CTAs)
Deliverables: Complete content package

PHASE 3: LAUNCH SUPPORT (Week 6-7)
• Content scheduling recommendations
• Launch day support
• Performance tracking (2 weeks post-launch)
• Results report
Deliverable: Campaign performance report

---

NOT INCLUDED

• Ongoing social management (one-time campaign only)
• Paid advertising spend or management
• Influencer fees
• Event coordination
• Additional rounds of production

---

PAYMENT TERMS

Deposit: ₩2,500,000 (50%)
• Due upon signing to secure project start

Final Payment: ₩2,500,000 (50%)
• Due upon completion before final files delivered

---

TIMELINE

Week 1: Strategy kickoff
Week 2: Planning finalized
Week 3-5: Production
Week 6: Launch preparation
Week 7: Launch and initial tracking
Week 8: Final report delivery

---

TERMS

• Fixed-price project (not hourly)
• Timeline contingent on timely client feedback
• 2 rounds of revisions per deliverable included
• Additional revisions: ₩200K-500K per round
• Final files delivered upon final payment

---

NEXT STEPS

1. Review and confirm scope
2. Sign agreement and submit deposit
3. Project kickoff meeting

Questions? Contact:
[Your Name]
[Email]
[Phone]

---

ACCEPTANCE

Client Name: ___________________
Signature: ___________________
Date: ___________________

This quotation is valid for 30 days from date above.
```

---

## Template 5: Strategy Consulting (No Execution)

```
QUOTATION

To: [Client Name]
From: Creatorhood
Date: [Date]
Valid Until: [30 days from date]

RE: Brand & Content Strategy Consulting

---

OVERVIEW

Strategic consulting engagement to develop comprehensive brand positioning and content strategy for your in-house team to execute.

Investment: ₩4,000,000 (one-time)
Duration: 6 weeks
Start Date: [Proposed date]

---

DELIVERABLES

PHASE 1: DISCOVERY (Week 1-2)
• Stakeholder interviews (3-5 people)
• Brand and content audit
• Competitive landscape analysis
• Customer research and insights

PHASE 2: STRATEGY DEVELOPMENT (Week 3-4)
• Brand positioning framework
• Target audience definition
• Content strategy and pillars
• Platform and channel strategy
• Success metrics and KPIs

PHASE 3: DOCUMENTATION (Week 5-6)
• Comprehensive strategy document (40-60 pages)
• Content frameworks and templates
• 3-6 month editorial roadmap
• Implementation guidelines
• Final presentation to stakeholders

---

WHAT YOU RECEIVE

DOCUMENTS:
• Brand Positioning Strategy
• Content Strategy Framework
• 6-Month Editorial Calendar
• Content Creation Guidelines
• Measurement and KPI Framework

TEMPLATES:
• Content briefs
• Editorial calendar template
• Performance tracking template

MEETINGS:
• Kick-off workshop (half-day)
• 3 working sessions (2 hours each)
• Final presentation (2 hours)

---

WHAT'S NOT INCLUDED

• Content production or execution
• Social media management
• Ongoing consulting (available separately)
• Team training (available as add-on)

---

OPTIONAL ADD-ONS

Team Training: +₩1,500,000
• Full-day workshop for your team
• Hands-on content creation training
• Q&A and ongoing support (30 days)

Monthly Advisory: +₩1,000,000/month
• 2-hour monthly strategy call
• Email/Slack support
• Content review and feedback

---

PAYMENT TERMS

Option A: Full Payment
• ₩4,000,000 upfront
• 5% discount = ₩3,800,000

Option B: Milestone Payments
• ₩2,000,000 (50%) upon signing
• ₩2,000,000 (50%) at Week 4 (midpoint)

---

TIMELINE

Week 1-2: Discovery and research
Week 3-4: Strategy development
Week 5: Documentation
Week 6: Finalization and presentation

---

TERMS

• Fixed-price engagement
• Timeline contingent on client availability for meetings
• Final documents delivered upon full payment
• Revisions: 2 rounds included in documentation phase

---

NEXT STEPS

1. Review scope and timeline
2. Sign agreement and submit payment
3. Schedule kick-off workshop
4. Begin discovery process

Questions? Contact:
[Your Name]
[Email]
[Phone]

---

ACCEPTANCE

Client Name: ___________________
Signature: ___________________
Date: ___________________

This quotation is valid for 30 days from date above.
```

---

## Quick Customization Checklist

Before sending any quotation:

□ Client name and date filled in
□ Specific deliverables match discussed scope
□ Pricing matches agreed model
□ Timeline realistic and achievable
□ What's NOT included is clear
□ Payment terms specified
□ Contact information updated
□ Validity period included (typically 30 days)
□ Proofread for errors
□ Saved as PDF before sending

---

## Email Template for Sending Quotation

```
Subject: Proposal for [Client Name] - [Service Type]

Hi [Name],

Thank you for taking the time to discuss your [goal/challenge] with me. Based on our conversation, I've prepared a proposal that outlines how Creatorhood can help you [achieve specific outcome].

Attached is a detailed quotation that includes:
• Scope of work and deliverables
• Timeline and process
• Investment and payment terms

Key highlights:
• [Highlight 1: e.g., "15 pieces of content per month"]
• [Highlight 2: e.g., "Performance-based model aligned to your sales"]
• [Highlight 3: e.g., "Proven framework from our work with [case study]"]

I've kept this proposal valid for 30 days. If you have any questions or would like to discuss further, I'm happy to jump on a call.

Looking forward to potentially partnering with you!

Best,
[Your Name]
[Title]
Creatorhood

[Your Email]
[Your Phone]
```

---

## Follow-Up Email Template (After 5-7 Days)

```
Subject: Re: Proposal for [Client Name]

Hi [Name],

Following up on the proposal I sent last week. I wanted to check if you've had a chance to review it and if you have any questions.

I'm particularly excited about [specific element that's relevant to them], and I think we could start seeing [specific outcome] within [timeframe].

If the timing isn't right or you'd like to adjust the scope, I'm happy to discuss alternatives. Just let me know what would work best for you.

Best,
[Your Name]
```

---

**Remember:** Every quotation should be customized to the specific client and situation. These templates are starting points, not one-size-fits-all solutions. Adjust scope, pricing, and terms based on the client's needs and your strategic assessment.
