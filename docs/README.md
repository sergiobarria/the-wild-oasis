# Documentation

Index of every document in `docs/`. **Keep this file current** — `AGENTS.md` points
agents here, so a document that is not listed effectively does not exist.

## Index

| Doc                                                  | Covers                                                                              | Read it when                                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`00_SPEC.md`](00_SPEC.md)                           | Product spec — what the app does, for whom, and the domain model                    | Building or changing a feature                        |
| [`01_PROJECT_SCAFFOLD.md`](01_PROJECT_SCAFFOLD.md)   | Stack, config, env vars, Convex + Better Auth wiring, testing, CI, deployment       | Touching tooling, config, env, auth, CI, or deploying |
| [`02_CODING_GUIDELINES.md`](02_CODING_GUIDELINES.md) | How code is written here: principles, layout, naming, domain modeling, testing, git | Writing or reviewing any code                         |
| [`03_MVP_TASKS.md`](03_MVP_TASKS.md)                 | MVP build order — phased task list derived from the spec                            | Picking up the next piece of work                     |

**`02` is portable, `01` is not.** The coding guidelines are copied across all projects
and stay framework-agnostic; the scaffold is this stack's instance of them. Improvements
to the generic rules belong in `02` so every project gets them. Where the two disagree,
`01` §13 records the resolution — keep that section current rather than letting a
deviation sit undocumented.

<!-- Add a row for every new document. Suggested next numbers:
     03_DATA_MODEL.md          — Convex schema, indexes, access patterns
     04_BUGS.md                — known issues and their write-ups
     ADR-NNN-*.md              — one decision per file, see below
-->

## Conventions for adding docs

- **Numbered prefix, reading order.** `NN_TITLE.md` where `NN` reflects the order a new
  contributor should read them, not alphabetical order. Numbers are never reused or
  renumbered once a doc is referenced elsewhere.
- **One topic per file.** If a document needs a table of contents deeper than two levels,
  it is probably two documents.
- **Decisions get their own file.** `ADR-NNN-short-title.md`, with context → decision →
  consequences. An ADR is immutable once merged; supersede it with a new one rather than
  editing history.
- **Bug write-ups** record the root cause and the guard that prevents recurrence, not the
  debugging narrative. A bug that produced a regression test should link to it.
- **State the rationale.** These documents exist so that the next person — or the next
  agent — does not re-derive a decision or repeat a mistake. A rule without a "why" gets
  ignored the first time it is inconvenient.
- **Add the row to this index in the same commit** as the new document.

## Related context outside `docs/`

| File                                 | What it is                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `AGENTS.md`                          | Agent entry point: commands, sharp edges, conventions. Points here.           |
| `CLAUDE.md`                          | Thin alias for `AGENTS.md` — do not duplicate content into it.                |
| `convex/_generated/ai/guidelines.md` | Version-accurate Convex rules. Overrides general Convex knowledge. Generated. |
| `.claude/skills/`, `.agents/skills/` | Vendored Convex agent skills, pinned in `skills-lock.json`. Generated.        |
| `README.md`                          | Human-facing project intro and quick start.                                   |
