# Mission: [Project Name]
> **Start:** [date] | **Goal:** [one-line summary]

---

## M1: [Milestone Name] | status: pending
> **Description:** [what this milestone achieves]
> **Depends on:** [M0 or none]

### T1.1: [Task Name] | agent:Worker | est:1d
- [ ] S1.1.1: [Subtask description] | size:S | finding:[ref]
- [ ] S1.1.2: [Subtask description] | size:M | depends:S1.1.1
- [ ] S1.1.3: [Subtask description] | size:S

### T1.2: [Task Name] | agent:Worker | est:2d
- [ ] S1.2.1: [Subtask description] | size:M | finding:[ref]

---

## M2: [Next Milestone] | status: pending | depends:M1

### T2.1: [Task Name] | agent:Worker | est:1d
- [ ] S2.1.1: [Subtask description] | size:S

---

## Legend
- **[P]** = Parallel-safe (no shared state)
- **M** = Milestone
- **T** = Task (one per file/concern)
- **S** = Subtask (atomic unit of work)
- `size:` XS (<1h), S (1-4h), M (4-12h), L (1-3d), XL (3d+)
- `finding:` cross-reference to audit gap-matrix ID

## Progress
- Total: [N] subtasks | Done: [N] | Remaining: [N]
