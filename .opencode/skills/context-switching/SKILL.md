---
name: context-switching
description: Use when switching between tasks, projects, or after long pauses — restores session context from WAL, Muninn, and git state
---
# Context Switching

## When to Use
- Starting work after >1 hour pause
- Switching between different tasks or projects
- After context compaction
- When user says "continue", "resume", "what were we doing"

## Process

### Step 1: Load Last Context
Read WAL (wal/state.yaml) and Muninn memory for:
- Last completed task and outcome
- Open decisions or unresolved questions
- Current branch and worktree state
- Protected zones

### Step 2: Verify Current State
```bash
git status --short
git log --oneline -5
cat wal/state.yaml
```

### Step 3: Present Summary
Present a 3-line brief: status, active task, protected zones.
Ask user to confirm before proceeding.

## Common Mistakes
- Resuming without checking what was already done
- Starting new work before resolving open decisions
- Not verifying git state before making changes

## Integration
- REQUIRED: Use memory-read skill for Muninn recall
- Use verification-before-completion before claiming context is loaded
