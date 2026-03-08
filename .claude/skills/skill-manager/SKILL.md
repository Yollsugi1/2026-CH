---
name: skill-manager
description: |
  Creates and manages Skills and Subagents for the Creatorhood automation system.
  MUST BE USED when user requests: "새로운 skill 만들어줘", "agent 만들어줘", "skill 수정해줘"
  USE PROACTIVELY when: expanding system capabilities, adding new workflows, or organizing knowledge
---

# Skill Manager

Meta-skill for creating and managing Creatorhood's Skills and Subagents.

## About This Skill

This skill automates the creation of:
1. **Skills** - Modular capabilities that extend Claude's knowledge (in `.claude/skills/`)
2. **Subagents** - Specialized agents for specific tasks (in `.claude/agents/`)

## When to Use

**MUST USE when:**
- User says "새로운 skill 만들어줘"
- User says "agent 만들어줘" 
- User wants to add new capability to system
- User wants to organize knowledge into reusable modules

**USE PROACTIVELY when:**
- You identify repeated patterns that should be systematized
- New reference materials should be organized
- A workflow needs to be captured

## Quick Start

### Creating a New Skill

```bash
python scripts/init_skill.py <skill-name> --path /home/claude/.claude/skills
```

This creates:
```
skills/<skill-name>/
├── SKILL.md           # Skill definition
├── scripts/           # Executable scripts (optional)
├── references/        # Documentation (optional)  
└── assets/            # Output resources (optional)
```

### Creating a New Subagent

```bash
python scripts/init_agent.py <agent-name> --path /home/claude/.claude/agents
```

This creates:
```
agents/<agent-name>.md  # Subagent definition with YAML frontmatter
```

## Design Principles

### Skills vs Subagents

**Use Skills when:**
- Providing reference knowledge (brand guidelines, frameworks)
- Executing deterministic scripts (file generation, calculations)
- Bundling reusable assets (templates, examples)
- Information should be loaded on-demand

**Use Subagents when:**
- Task requires reasoning and decision-making
- Need conversational interaction
- Multiple-step cognitive workflow
- Adapting approach based on context

### Progressive Disclosure

Skills use 3-level loading:
1. **Metadata** (name + description) - Always loaded (~100 words)
2. **SKILL.md body** - Loaded when triggered (<5k words)
3. **References/Scripts** - Loaded as needed (unlimited)

Keep SKILL.md concise. Move detailed info to references/.

## Workflow

### 1. Understand the Need

Before creating, clarify:
- What capability is needed?
- Is it a Skill or Subagent?
- What reference materials exist?
- What's the typical usage pattern?

### 2. Initialize Structure

Run the appropriate init script:
- `init_skill.py` for Skills
- `init_agent.py` for Subagents

### 3. Fill in Content

**For Skills:**
- Write clear description (this is the trigger!)
- Add instructions to SKILL.md body
- Place references in `references/`
- Add scripts to `scripts/`
- Put output templates in `assets/`

**For Subagents:**
- Write YAML frontmatter with description
- Define tools needed
- Write system prompt
- Specify output format

### 4. Reference Guides

See detailed guides in:
- `references/skill-guide.md` - How to write effective Skills
- `references/agent-guide.md` - How to write effective Subagents

## Available Scripts

### init_skill.py

Creates new Skill template with proper structure.

**Usage:**
```bash
python scripts/init_skill.py <skill-name> [--path <dir>]
```

**Example:**
```bash
python scripts/init_skill.py brand-knowledge --path /home/claude/.claude/skills
```

### init_agent.py

Creates new Subagent template with YAML frontmatter.

**Usage:**
```bash
python scripts/init_agent.py <agent-name> [--path <dir>]
```

**Example:**
```bash
python scripts/init_agent.py sales-writer --path /home/claude/.claude/agents
```

### package_skill.py

Packages a Skill into distributable .skill file (zip with .skill extension).

**Usage:**
```bash
python scripts/package_skill.py <path/to/skill-folder> [<output-dir>]
```

## Creatorhood System Structure

```
.claude/
├── agents/                      # Subagents (reasoning & tasks)
│   ├── biz-planner.md          # Business strategy
│   ├── reviewer.md             # Quality control
│   ├── project-manager.md      # Project tracking
│   ├── ch-content-planner.md   # CH MAG planning
│   ├── brand-content-planner.md # Brand content
│   ├── script-writer.md        # Shooting scripts
│   ├── sales-narrative-writer.md
│   ├── sales-quoter.md
│   ├── creator-recruiter.md
│   └── global-sales-writer.md
│
└── skills/                      # Skills (knowledge & tools)
    ├── content-frameworks/      # Planning frameworks
    ├── brand-knowledge/         # Client context
    ├── quotation-builder/       # Quote generation
    └── skill-manager/          # This meta-skill
```

## Best Practices

### Skill Design

1. **Concise is Key** - Context window is shared. Only include non-obvious info.
2. **Clear Triggers** - Description must clearly state when to use
3. **Progressive Disclosure** - Core in SKILL.md, details in references/
4. **Tested Scripts** - All scripts must actually work

### Subagent Design

1. **Single Responsibility** - One clear purpose per agent
2. **Explicit Triggers** - Use "MUST BE USED when..." in description
3. **Defined Output** - Specify expected output format
4. **Tool Selection** - Only include necessary tools

### Naming Conventions

**Skills:**
- Use kebab-case: `brand-knowledge`, `content-frameworks`
- Descriptive of capability: what it provides

**Subagents:**
- Use kebab-case: `sales-writer`, `content-planner`  
- Descriptive of role: what it does

## Examples

### Example 1: Creating Brand Knowledge Skill

```bash
# Initialize
python scripts/init_skill.py brand-knowledge

# Add references
cp kuksundang-history.md skills/brand-knowledge/references/
cp inhaze-collaboration.md skills/brand-knowledge/references/

# Edit SKILL.md to describe when to use
# Package for distribution
python scripts/package_skill.py skills/brand-knowledge
```

### Example 2: Creating Sales Writer Agent

```bash
# Initialize  
python scripts/init_agent.py sales-narrative-writer

# Edit .claude/agents/sales-narrative-writer.md
# Add YAML frontmatter with description, tools, model
# Write system prompt for sales proposal writing
```

## Troubleshooting

**Skill not triggering?**
- Check description field - it must clearly state when to use
- Add "MUST BE USED when..." or "USE PROACTIVELY when..."
- Ensure keywords match user's likely phrasing

**Agent not being called?**
- Verify description has explicit triggers
- Check tools list - include all needed tools
- Consider if task better suited as Skill

**Scripts failing?**
- Test scripts manually before adding to Skill
- Check file paths are correct
- Ensure dependencies are installed

## Further Reading

- `references/skill-guide.md` - Complete Skill authoring guide
- `references/agent-guide.md` - Complete Subagent authoring guide
- `/mnt/skills/examples/skill-creator/` - Official Claude Code skill creator
