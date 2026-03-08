# Subagent Writing Guide

Complete guide for creating effective Subagents for the Creatorhood system.

## What is a Subagent?

A Subagent is a specialized instance of Claude focused on a specific task or role. Subagents:
- **Make decisions** based on context
- **Reason through** multi-step processes  
- **Adapt** their approach to situations
- **Coordinate** with other agents and skills

Think of Subagents as team members with distinct roles and expertise.

## Subagent vs Skill

**Use a Subagent when:**
- Task requires reasoning and judgment
- Multiple approaches are valid
- Need conversational, multi-turn interaction
- Coordinating complex workflows
- Adapting to context

**Use a Skill when:**
- Providing reference knowledge
- Executing deterministic scripts
- Bundling reusable templates
- Information-only (no reasoning needed)

**Rule of thumb:** Subagents *think* and *do*, Skills *inform* and *provide*.

## Subagent Structure

A Subagent is a single `.md` file with two parts:

```markdown
---
name: agent-name
description: |
  What this agent does and when it should be used
  MUST BE USED when: [specific triggers]
  USE PROACTIVELY when: [helpful scenarios]
tools: [list, of, tools]
model: sonnet
---

# System Prompt

[Agent's instructions, role, process, etc.]
```

### YAML Frontmatter (Required)

**name** - Agent identifier (kebab-case)
```yaml
name: sales-narrative-writer
```

**description** - THE MOST IMPORTANT FIELD
```yaml
description: |
  Writes sales proposals for content production services.
  MUST BE USED when: user needs proposal, pitch deck, or sales email
  USE PROACTIVELY when: discussing new clients or pricing
```

**tools** - List of tools the agent can use
```yaml
tools: [read, write, conversation_search]
```

Available tools:
- `read` - Read files
- `write` - Write/create files
- `bash` - Execute bash commands
- `glob` - List files with patterns
- `grep` - Search file contents
- `conversation_search` - Search past conversations
- `recent_chats` - Get recent chat history
- `web_search` - Search the web
- `web_fetch` - Fetch web content

**model** - Which Claude model to use
```yaml
model: sonnet  # or haiku
```

- `sonnet` - For complex reasoning, strategy, detailed writing
- `haiku` - For simple tasks, quick processing, following templates

### System Prompt (Required)

After the YAML frontmatter, write the agent's instructions:

```markdown
# [Agent Role Title]

You are [role description] for Creatorhood.

## Your Role

[Define primary responsibility]

## Context & Knowledge

[What information this agent has access to]

## Your Process

[Step-by-step workflow]

## Output Format

[What the agent should produce]

## Guidelines

[Dos and don'ts]

## Examples

[Concrete usage scenarios]
```

## Writing Effective Descriptions

The description determines when your agent activates. Make it explicit!

### Good Description Pattern

```yaml
description: |
  [One sentence: What this agent does]
  MUST BE USED when: [specific user requests]
  USE PROACTIVELY when: [contexts where agent would help]
```

### Examples

**Good:**
```yaml
description: |
  Plans CH MAG content series with episode structures and production notes.
  MUST BE USED when: user says "plan CH content", "create CH series", or discusses CH MAG episodes
  USE PROACTIVELY when: user mentions CH MAG or self-owned media content
```

Why it's good:
- Clear purpose
- Specific trigger phrases
- Keywords users actually say
- Proactive scenarios defined

**Bad:**
```yaml
description: |
  Helps with content.
```

Why it's bad:
- Too vague
- No trigger phrases
- No distinction from other agents
- No proactive guidance

### Trigger Strategies

**MUST BE USED when** - For required activation:
```yaml
MUST BE USED when: user explicitly requests quotation, pricing, or cost estimate
```

**USE PROACTIVELY when** - For helpful activation:
```yaml
USE PROACTIVELY when: user discusses budget, pricing, or asks "how much"
```

## Choosing the Right Model

### Use Sonnet for:
- Strategic thinking and planning
- Complex analysis and reasoning
- Detailed writing (proposals, strategies)
- Multi-step decision trees
- Nuanced judgment calls

**Examples:**
- biz-planner (business strategy)
- brand-content-planner (content strategy)
- sales-narrative-writer (persuasive writing)

### Use Haiku for:
- Following templates or formulas
- Simple transformations
- Quick processing of structured data
- Straightforward writing tasks
- Script/checklist following

**Examples:**
- script-writer (template-based)
- creator-recruiter (follow outreach template)
- sales-quoter (calculate from price guide)

## Defining the Agent's Role

### Clear Identity

Give the agent a concrete role:

**Good:**
```markdown
You are the Brand Content Strategist for Creatorhood.

Your specialty is translating brand messages into authentic content series
that don't feel like advertising.
```

**Bad:**
```markdown
You help with brand stuff.
```

### Scope and Boundaries

Define what the agent does AND doesn't do:

```markdown
## Your Role

You plan brand content series, including:
- Strategic positioning
- Content narrative arcs
- Episode structures
- Production feasibility

You do NOT:
- Execute production (that's script-writer's role)
- Create final scripts (hand off to script-writer)
- Make business decisions (escalate to biz-planner)
```

## Designing the Process

### Step-by-Step Workflow

Give agents a clear process:

```markdown
## Your Process

When activated, follow these steps:

1. **Gather Context**
   - Read the brief or user request
   - Check past conversations with this client
   - Load relevant brand knowledge skill

2. **Analyze Requirements**
   - Identify brand's core message
   - Determine target audience
   - Assess content format needs

3. **Plan Content**
   - Develop 3-5 episode concepts
   - Create story arcs
   - Add production notes

4. **Format Output**
   - Write to brand-content-brief.md
   - Include all required sections
   - Flag any uncertainties for review
```

### Decision Points

Include guidance for judgment calls:

```markdown
## Decision Framework

**When choosing content format:**
- IF brand has strong visual identity → prioritize video
- IF message is complex → use long-form content
- IF audience is time-constrained → create shortform

**When brand positioning is unclear:**
1. Ask clarifying questions
2. Reference past brand work in conversations
3. If still unclear, escalate to biz-planner
```

## Specifying Output

### Clear Format

Tell the agent exactly what to produce:

```markdown
## Output Format

**File:** `brand-content-brief.md`

**Structure:**
```markdown
# [Brand Name] Content Brief

## Objective
[One sentence goal]

## Content Series

### Episode 1: [Title]
- Hook: [Opening 30 seconds]
- Body: [Key points]
- Production notes: [Locations, props, etc.]

[... repeat for all episodes]

## Next Steps
- [ ] Review with client
- [ ] Hand off to script-writer
```

### Validation Criteria

Help agents self-check:

```markdown
## Quality Checks

Before finalizing, verify:
- [ ] Content aligns with brand voice
- [ ] Episodes have clear narrative arc
- [ ] Production is feasible with available resources
- [ ] Target audience would find this engaging
- [ ] All required sections are complete
```

## Coordination Between Agents

### Handoffs

Define when and how to pass work:

```markdown
## Coordination

**Receives input from:**
- **biz-planner** - Strategic direction and goals
- **brand-knowledge skill** - Client history and guidelines

**Passes work to:**
- **script-writer** - When content brief is approved
- **reviewer** - For quality check before client presentation

**Triggers:**
When content brief is complete, say:
"Brand content brief is ready. Would you like me to have reviewer check it?"
```

### Skill Usage

Document which skills the agent uses:

```markdown
## Skills You Use

**content-frameworks skill:**
```python
# Load storyliving framework
Use storyliving.md for 3-act structure
Apply emotional arc to brand narrative
```

**brand-knowledge skill:**
```python
# Check brand context
Read references/[brand-name].md
Verify messaging alignment
Note any restrictions or preferences
```
```

## Best Practices

### 1. Single Responsibility

Each agent should have ONE clear purpose:

**Good:** "Plans CH MAG content series"
**Bad:** "Plans content and writes scripts and creates quotations"

If an agent description has "and" multiple times, split it.

### 2. Explicit Triggers

Use phrases users actually say:

**Good:**
```yaml
MUST BE USED when: user says "plan CH content", "create series", or "episode ideas"
```

**Bad:**
```yaml
MUST BE USED when: content planning is needed
```

### 3. Concrete Examples

Show, don't just tell:

```markdown
## Example 1: CH MAG Fitness Series

**User says:**
"Plan a 5-episode series about home workouts for beginners"

**You respond:**
"I'll create a CH MAG content brief for a beginner home workout series."

**You produce:**
- Episode structures with progression
- Production requirements
- Hook and narrative for each episode
```

### 4. Error Handling

Guide agents on edge cases:

```markdown
## Handling Unclear Requests

**If user request is vague:**
Ask specific clarifying questions:
- "What's the target audience for this content?"
- "What's the brand's main message?"
- "Do you have any format preferences?"

**If required information is missing:**
1. Check conversation history
2. Search past chats for context
3. If still missing, ask user explicitly
```

### 5. Tool Usage Guidance

Help agents use tools effectively:

```markdown
## Using conversation_search

When to use:
- User mentions past projects: "like we did with 국순당"
- Need client history: "what did we do last time?"
- Reference previous work: "similar to that proposal"

How to use:
```python
# Search for specific client
conversation_search(query="국순당 content strategy")

# Search for project type
conversation_search(query="sales proposal template")
```
```

## Common Patterns

### Pattern 1: Planner Agent

**Use for:** Strategic planning, decision-making, analysis

```yaml
---
name: biz-planner
description: |
  Provides business strategy and decision support.
  MUST BE USED when: discussing business strategy, major decisions, positioning
  USE PROACTIVELY when: user is planning new initiatives or facing strategic choices
tools: [read, write, conversation_search, recent_chats]
model: sonnet
---

# Business Strategy Partner

[Deep strategic thinking, analysis, recommendations]
```

### Pattern 2: Writer Agent

**Use for:** Content creation, copywriting, proposals

```yaml
---
name: sales-narrative-writer
description: |
  Writes compelling sales proposals for content services.
  MUST BE USED when: creating proposals, pitch decks, or sales emails
  USE PROACTIVELY when: user discusses new client outreach
tools: [read, write, conversation_search]
model: sonnet
---

# Sales Proposal Writer

[Writing process, tone guidelines, templates]
```

### Pattern 3: Executor Agent

**Use for:** Following templates, simple transformations

```yaml
---
name: script-writer
description: |
  Converts content briefs into shooting scripts.
  MUST BE USED when: user says "make shooting script" or content brief is ready
  USE PROACTIVELY when: content planning is complete
tools: [read, write]
model: haiku
---

# Script Formatter

[Template application, formatting rules]
```

## Testing Your Agent

### Before First Use

1. **Read Description Aloud**
   - Is it crystal clear?
   - Would Claude know when to trigger?
   - Are trigger phrases specific?

2. **Check Process Steps**
   - Can another person follow the process?
   - Are decision points clear?
   - Is output format specified?

3. **Verify Tool Selection**
   - Does agent need all listed tools?
   - Are critical tools missing?

### During Use

1. **Trigger Test**
   Say something that should activate the agent:
   - Does it trigger?
   - If not, add clearer triggers to description
   
2. **Output Test**
   - Does it produce expected format?
   - Is quality consistent?
   - Does it use skills correctly?

3. **Coordination Test**
   - Does it hand off work properly?
   - Does it request help when needed?
   - Does it respect boundaries?

## Troubleshooting

### Agent Not Triggering

**Problem:** Agent doesn't activate when expected

**Solutions:**
- Add "MUST BE USED when" with specific phrases
- Include variations users might say
- Add more explicit keywords
- Check for description typos

### Agent Over-Triggering

**Problem:** Agent activates too often

**Solutions:**
- Make description more specific
- Add "ONLY when" conditions
- Narrow the scope
- Split into multiple agents

### Inconsistent Output

**Problem:** Agent produces different results each time

**Solutions:**
- Add more structure to process
- Include explicit templates
- Provide more examples
- Consider using haiku for template-following

### Agent Confused About Role

**Problem:** Agent doesn't stay in scope

**Solutions:**
- Clarify boundaries in "Your Role" section
- Add explicit "You do NOT" statements
- Define handoff points to other agents
- Test with edge cases

## Checklist

Before considering an agent complete:

- [ ] YAML frontmatter has name, description, tools, model
- [ ] Description includes "MUST BE USED when" with specific triggers
- [ ] Description includes "USE PROACTIVELY when" scenarios
- [ ] Trigger phrases match how users actually talk
- [ ] Role and identity are clearly defined
- [ ] Process is step-by-step and actionable
- [ ] Output format is explicitly specified
- [ ] Tool list includes all needed tools (and no extras)
- [ ] Model choice (sonnet vs haiku) is appropriate
- [ ] Examples show concrete usage scenarios
- [ ] Coordination with other agents is documented
- [ ] Agent has been tested in actual conversation
- [ ] Edge cases and error handling are addressed

## Further Reading

- Official Claude Code Subagents docs: https://code.claude.com/docs/ko/sub-agents
- Example agents in `.claude/agents/`
- Creatorhood system architecture in skill-manager SKILL.md
