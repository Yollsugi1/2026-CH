# Skill Writing Guide

Complete guide for creating effective Skills for the Creatorhood system.

## What is a Skill?

A Skill is a modular package that extends Claude's capabilities by providing:
- **Specialized knowledge** - Domain expertise, frameworks, brand context
- **Executable tools** - Scripts for deterministic tasks
- **Reusable assets** - Templates, examples, boilerplate

Think of Skills as "onboarding guides" that transform Claude into a domain expert.

## Skill vs Subagent

**Use a Skill when:**
- Providing reference knowledge (brand guidelines, frameworks)
- Executing deterministic scripts (file generation, data processing)
- Bundling reusable assets (templates, examples)
- Information should be loaded on-demand

**Use a Subagent when:**
- Task requires reasoning and decision-making
- Need conversational, multi-turn interaction
- Adapting approach based on context
- Coordinating complex workflows

**Rule of thumb:** Skills provide *what* to use, Subagents provide *how* to think.

## Skill Structure

```
skill-name/
├── SKILL.md           # Required: Skill definition
├── scripts/           # Optional: Executable code
│   └── *.py, *.sh
├── references/        # Optional: Detailed documentation
│   └── *.md
└── assets/            # Optional: Output templates/resources
    └── *
```

### SKILL.md (Required)

Every SKILL.md has two parts:

**1. YAML Frontmatter** (Required)
```yaml
---
name: skill-name
description: |
  What this skill does and when to use it.
  MUST BE USED when: [specific triggers]
  USE PROACTIVELY when: [helpful scenarios]
---
```

The `description` is THE MOST IMPORTANT FIELD - it determines when the skill loads!

**2. Markdown Body** (Required)
Instructions and guidance for using the skill. Only loaded AFTER skill triggers.

## Writing Effective Descriptions

The description field is critical - it's how Claude decides when to use your skill.

### Good Description Pattern

```yaml
description: |
  [One sentence: What this skill does]
  MUST BE USED when: [specific user requests or situations]
  USE PROACTIVELY when: [contexts where this helps]
```

### Examples

**Good:**
```yaml
description: |
  Provides Creatorhood's content planning frameworks and methodologies.
  MUST BE USED when: planning CH MAG content, creating brand content strategies
  USE PROACTIVELY when: user discusses content series, episode planning, or storytelling approaches
```

**Bad:**
```yaml
description: |
  This skill helps with content.
```

Why it's bad:
- Too vague - when does "helps with content" apply?
- No explicit triggers
- Claude won't know when to use it

### Trigger Keywords

Include words users actually say:
- Action verbs: "plan", "create", "write", "analyze"
- Domain terms: "content", "brand", "strategy", "campaign"
- Creatorhood-specific: "CH MAG", "국순당", "크리에이터 섭외"

## Organizing Content

### Progressive Disclosure

Skills use 3-level loading system:

1. **Metadata** (name + description) - Always loaded (~100 words)
2. **SKILL.md body** - Loaded when triggered (~2-5k words)
3. **References/Scripts** - Loaded as needed (unlimited)

Keep SKILL.md concise! Move details to references.

### When to Use References

Move content to `references/` when:
- Documentation exceeds 10k words
- Multiple variations of similar content
- Reference material that's rarely needed all at once
- Examples that illustrate but aren't core instructions

**Example:**
```markdown
# SKILL.md

For detailed pricing guidelines, see `references/pricing-guide.md`
For past quotations, see `references/examples/`
```

### When to Use Scripts

Add to `scripts/` when:
- Same code gets rewritten repeatedly
- Deterministic reliability is critical
- Complex data processing or file manipulation
- Integrating with external tools

Scripts should:
- Be tested and working
- Have clear docstrings
- Handle errors gracefully
- Accept parameters for flexibility

### When to Use Assets

Add to `assets/` when:
- Templates that get copied and filled in
- Images, icons, or design resources
- Boilerplate code structures
- Any file used in OUTPUT (not loaded into context)

## Best Practices

### 1. Concise is Key

Context window is shared across everything. Only include:
- Non-obvious information
- Information Claude can't infer
- Specific procedural knowledge

Challenge every sentence: "Does Claude really need this?"

### 2. Examples Over Explanation

Instead of:
```markdown
This skill helps plan content by analyzing audience, setting goals, and creating frameworks.
```

Use:
```markdown
## Quick Example

Input: "Plan a content series about fitness routines"
Output: 5-episode series with hooks, story arcs, and production notes
```

### 3. Actionable Instructions

Instead of:
```markdown
Consider the brand's tone and target audience.
```

Use:
```markdown
Before writing:
1. Read `references/brand-guidelines.md`
2. Identify target audience from brief
3. Match tone to audience expectations
```

### 4. Clear File References

Always use relative paths and explain what's in the file:

```markdown
See `references/kuksundang-history.md` for:
- Brand positioning and messaging
- Past campaign themes
- Approved vocabulary and phrases
```

### 5. Version Control Friendly

- Use plain text (Markdown, not Word docs)
- Break large files into smaller ones
- Name files descriptively
- Keep structure flat when possible

## Common Patterns

### Pattern 1: Knowledge Repository

**Use for:** Brand guidelines, client history, frameworks

```
brand-knowledge/
├── SKILL.md                    # Overview + when to use
└── references/
    ├── kuksundang.md          # Client-specific context
    ├── inhaze.md
    └── pelicana.md
```

SKILL.md stays minimal, references loaded as needed.

### Pattern 2: Tool Integration

**Use for:** File generation, data processing, API calls

```
quotation-builder/
├── SKILL.md                    # How to use the tool
├── scripts/
│   └── generate_quote.py      # Actual tool
└── references/
    └── pricing-guide.md        # Pricing reference
```

### Pattern 3: Template Library

**Use for:** Reusable templates and boilerplate

```
proposal-templates/
├── SKILL.md                    # Which template for what
├── assets/
│   ├── sales-proposal.md
│   ├── content-strategy.md
│   └── quotation-template.xlsx
└── references/
    └── customization-guide.md
```

## Testing Your Skill

### Before First Use

1. **Validate Structure**
   ```bash
   python scripts/package_skill.py your-skill/
   ```
   
2. **Check Description**
   - Is it specific?
   - Does it include trigger keywords?
   - Would Claude know when to use it?

3. **Test Scripts**
   Run every script manually to ensure they work

### During Use

1. **Trigger Test**
   - Say something that should activate the skill
   - Does it load automatically?
   - If not, make description more explicit

2. **Content Test**
   - Does SKILL.md have enough guidance?
   - Are references being loaded correctly?
   - Do scripts execute as expected?

3. **Iteration**
   - Refine description based on usage
   - Move content between SKILL.md and references
   - Add examples for unclear areas

## Troubleshooting

### Skill Not Triggering

**Problem:** Skill doesn't load when expected

**Solutions:**
- Add "MUST BE USED when" to description
- Include specific trigger phrases users say
- Use more explicit keywords
- Check for typos in description

### Skill Always Triggering

**Problem:** Skill loads too often

**Solutions:**
- Make description more specific
- Add narrow conditions: "ONLY when X AND Y"
- Split into multiple more focused skills

### Content Too Long

**Problem:** SKILL.md is getting huge

**Solutions:**
- Move detailed info to `references/`
- Use examples instead of explanations
- Remove redundant content
- Split into multiple skills

### Scripts Failing

**Problem:** Scripts don't execute properly

**Solutions:**
- Test scripts manually before adding
- Check file paths are relative
- Add error handling
- Verify dependencies are available

## Examples of Good Skills

### Example 1: content-frameworks

```yaml
---
name: content-frameworks
description: |
  Provides Creatorhood's content planning methodologies.
  MUST BE USED when: planning content series, creating episode structures
  USE PROACTIVELY when: user discusses storytelling, content formats, or series development
---

# Content Frameworks

## Available Frameworks

### Storyliving Framework
See `references/storyliving.md` for:
- 3-act structure for lifestyle content
- Character development in factual stories
- Emotional arc planning

### Yoon Sung-won Framework
See `references/yoon-framework.md` for:
- Hook-Body-Twist structure
- Authenticity principles
- Production workflow

## Quick Start

1. Identify content type (educational, lifestyle, brand)
2. Select appropriate framework
3. Apply framework to content brief
```

### Example 2: quotation-builder

```yaml
---
name: quotation-builder
description: |
  Generates quotations for content production services.
  MUST BE USED when: creating quotes, pricing proposals, or cost estimates
  USE PROACTIVELY when: user discusses pricing or asks about service costs
---

# Quotation Builder

## Usage

```bash
python scripts/generate_quote.py --service [type] --duration [months]
```

## Pricing Reference

See `references/pricing-guide.md` for:
- Standard rates by service type
- Volume discounts
- Package pricing

## Output

Creates:
- Excel quotation with line items
- Word proposal with pricing narrative
```

## Checklist

Before considering a skill complete:

- [ ] SKILL.md has YAML frontmatter with name and description
- [ ] Description includes "MUST BE USED when" or "USE PROACTIVELY when"
- [ ] Description has specific trigger keywords
- [ ] SKILL.md body is under 5k words
- [ ] Examples show concrete usage
- [ ] All scripts are tested and working
- [ ] References are organized logically
- [ ] File paths are relative and correct
- [ ] Skill has been tested in actual conversation
- [ ] No redundant or obvious information

## Further Reading

- Official Claude Code Skills docs: https://code.claude.com/docs/ko/skills
- Skill Creator skill: `/mnt/skills/examples/skill-creator/`
- Creatorhood skill examples in `.claude/skills/`
