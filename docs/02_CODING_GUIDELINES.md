# TypeScript Project Guidelines

Portable conventions for TypeScript projects, distilled from building and shipping this one. They
cover the standard library stack as well as the architecture, because in practice the framework is
what changes between projects — the rest stays the same.

**Copying this into another project:** take the whole file and drop the leading number from the
filename. Sections marked **[framework-specific]** are the ones to revisit; everything else transfers
as-is. Sections marked **[project-specific]** contain values you may want to re-pick, though the
value matters far less than picking one and enforcing it.

Each rule states its reason. A convention without a reason gets undone by the next person who finds
it inconvenient, so if a rule stops earning its reason, change it deliberately rather than drifting.

---

## 1. Principles

1. **Simplicity over cleverness. Always.** The most important rule here; everything below is
   downstream of it. Code is read far more often than it is written, and the reader is a future
   maintainer with no context — frequently you, months later. If a simpler version exists, it is the
   correct version, even when the clever one is shorter, faster to type, or more satisfying to write.
2. **Make the wrong thing hard, not forbidden.** A rule enforced by the compiler or a shared helper
   survives; a rule that lives only in a document does not.
3. **One source of truth per fact.** Money math, domain vocabulary, route paths, layout containers —
   defined once, referenced everywhere.
4. **Derive, don't duplicate** — except where a value must be frozen in time. Then store it and say
   why in a comment.
5. **Extract on the second real repetition,** not on the first guess that one is coming.
6. **Verify, don't assume.** Run it, read the output, prove the failing case before claiming a fix.

### What "simpler" means in practice

"Prefer simplicity" is useless as a slogan, so here is what it actually rules out. In every pair, the
second is the one to write.

**Name the steps instead of chaining them.** A pipeline that has to be re-read to be understood is
not simpler for being one statement:

```ts
// clever
const t = rows.filter((r) => r.k === 'e' && !r.d).reduce((a, r) => a + (r.s ?? r.a), 0);

// simple
const expenses = rows.filter((row) => row.kind === KIND.EXPENSE && !row.deletedAt);
const totalMinor = expenses.reduce((sum, row) => sum + (row.subtotalMinor ?? row.amountMinor), 0);
```

**Use a branch, not nested ternaries.** Two levels is usually already too many; an early return or a
lookup object reads better than a conditional expression that wraps across four lines.

**Write the type out.** Conditional and mapped types are worth it for a genuine invariant — an enum
whose keys must match its values earns its keep. A three-level generic that saves declaring two
interfaces does not. If you have to reason about the type to read the function, it costs more than it
saves.

**Prefer an explicit call over indirection.** Dynamic dispatch through a registry, string-keyed
lookups into modules, and reflective wiring are all harder to grep, harder to type, and invisible to
"find references". Use them when the set is genuinely open; write the switch when it is not.

**Duplicate before you abstract.** Two similar blocks are easy to read and easy to change
independently. One abstraction with a `mode` flag and four optional parameters serves neither caller
well. Wait for the second real repetition, then extract the shape it actually shows you.

**Boring control flow.** `for…of` over a clever `reduce`. An `if` over a short-circuited `&&` used
for its side effect. Early return over a nested pyramid.

**No surprising defaults.** A helper that silently falls back, retries, or coerces will eventually
hide a bug. Fail loudly, or make the fallback an explicit argument at the call site.

**The simplest thing that is still correct.** Simplicity is not fewer characters and never fewer
safeguards — a validation removed is not a simplification. It is fewer concepts the reader must hold
at once.

When the simple version genuinely will not do — a hot path, a real type invariant — write the simple
version in a comment above the clever one, so the next reader knows what it replaced and why.

---

## 2. The standard stack

Same choices across projects, so knowledge and conventions transfer. Swap deliberately, not per
project.

| Concern                      | Choice                                                           | Notes                                                   |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| Runtime / package manager    | **Bun**                                                          | Keep the lockfile in sync with every dependency change. |
| Build                        | **Vite**                                                         | Whatever the framework wraps it in.                     |
| Language                     | **TypeScript**, strict                                           | §4.                                                     |
| Format + lint + imports      | **Biome**                                                        | One binary, no plugin matrix. §3.                       |
| Framework                    | **[framework-specific]** — TanStack Start, Next.js, or SvelteKit | The one thing that varies. §5.                          |
| Routing                      | Framework's file-based router                                    | Typed; search params validated with Zod. §13.           |
| Server state                 | **TanStack Query**, or the backend's native reactive client      | §11.                                                    |
| Forms                        | **TanStack Form**                                                | §10.                                                    |
| Validation                   | **Zod**                                                          | §10. Also validates env and route params.               |
| Styling                      | **Tailwind CSS**                                                 | §8.                                                     |
| Class merging                | **clsx** + **tailwind-merge**, exported as `cn`                  | §8.                                                     |
| Component variants           | **class-variance-authority**                                     | §8.                                                     |
| UI primitives                | **Radix**, composed via the **shadcn/ui** pattern                | Copied in, not imported as a black box. §8.             |
| Command palette / combobox   | **cmdk**                                                         | Pairs with Radix Popover.                               |
| Icons                        | **Lucide**                                                       | §9. One icon library, no mixing.                        |
| Fonts                        | Framework's font pipeline, else **Fontsource** variable fonts    | Self-hosted either way; no runtime external request.    |
| Tables                       | **TanStack Table**                                               | Headless; you own the markup. §12.                      |
| Charts                       | **Recharts**                                                     | §12. Always with a text alternative.                    |
| Notifications                | **Sonner**                                                       | §12.                                                    |
| Dates                        | **date-fns** + **@date-fns/tz**                                  | §12. Never raw `Date` arithmetic.                       |
| Backend                      | **Convex** by default                                            | §14.                                                    |
| Database _(when not Convex)_ | **Postgres**, or **Turso** for small/edge projects               | §14.                                                    |
| ORM                          | **Drizzle** — with either database                               | §14.                                                    |
| Auth                         | **Better Auth** — every framework, every backend                 | §15. The one constant.                                  |
| Error tracking               | **Sentry**                                                       | §16.                                                    |
| Server logs                  | **Pino**                                                         | §16.                                                    |
| Env validation               | **@t3-oss/env-core** + Zod                                       | §20.                                                    |
| Unit / component tests       | **Vitest** + **Testing Library**                                 | §18.                                                    |
| Backend tests                | **convex-test** (or the backend's harness)                       | §18.                                                    |
| Browser tests                | **Playwright**                                                   | §18.                                                    |
| Fake data                    | **@faker-js/faker**, seeded                                      | §18.                                                    |

**Adding a dependency is a decision, not a reflex.** Before adding one: is it in this table already,
does the platform do it now, and is the maintenance real? A 30-line helper you own beats a dependency
you must track forever. When you do add one, pin it and say why in the commit.

---

## 3. Tooling and formatting

One tool for formatting, linting, and import ordering, so none of it is ever a review comment.

**[project-specific]** The values this project uses:

| Setting         | Value             | Why                                               |
| --------------- | ----------------- | ------------------------------------------------- |
| Indent          | 4 spaces          | Consistency only.                                 |
| Line width      | 100               | Fits a split editor; long signatures don't shred. |
| Quotes          | single, incl. JSX | One style, no exceptions.                         |
| Semicolons      | always            | No ASI edge cases in review.                      |
| Trailing commas | all               | One-line diffs, not two.                          |
| Arrow parens    | always            | Adding a parameter isn't a formatting change.     |
| Line endings    | LF                | Clean cross-platform diffs.                       |

**Import order is enforced, not conventional.** Groups separated by blank lines:

```ts
// framework first
import { redirect } from 'next/navigation';

// third-party
import { useMutation } from 'convex/react';
import { z } from 'zod';

// path aliases
import { Button } from '@/components/ui/button';
import { formatMinorUnits } from '@/lib/money';

// relative last
import { InvoiceRow } from './invoice-row';
```

**Scope the tool explicitly.** List the directories it owns and exclude generated output. Anything
outside that list is silently unformatted — know which, because that is where drift accumulates.

### Scripts

Same verbs in every project, so muscle memory and CI config transfer:

```
dev  build  preview  start
typecheck            tsc --noEmit
check  format  lint  Biome
test  test:watch  test:coverage  test:e2e
```

Split test scripts per environment when runtimes differ (`test:backend` in an edge/node VM,
`test:frontend` in jsdom) — one config cannot serve both.

### Beyond the formatter

The formatter handles spacing it can infer. These are the parts it cannot, and they are where
readability is actually won or lost.

**Vertical rhythm.** A blank line between top-level declarations, and before a `return` that follows
other statements. Inside a body, separate the phases — declarations, derived values, validation, side
effects, return:

```ts
export function prepare(input: Input) {
    const name = clean(input.name);
    const id = normalize(input.id);

    if (!name) fail('Enter a name.');

    return { name, id };
}
```

Most formatters preserve blank lines but never add them, so this has to be written deliberately.
Dense one-line functions and wall-of-text bodies both hide structure.

**Comments earn their place by saying what the code cannot:**

- **Yes** — why a non-obvious decision was made, the kind a future reader would otherwise "fix".
- **Yes** — a JSDoc on an exported function, type, or constant whose contract is not obvious.
- **Yes** — a pointer to the specification or ticket a rule comes from.
- **No** — restating the next line. Delete it.
- **No** — narrating each step. If the code needs that, rename something.

If a comment and the code disagree, both are wrong: one is stale, the other is unexplained.

**Readability over brevity.** Section 1 in the small. Reviewing your own diff, the question is not
"is this short?" but "will someone understand this without me?" A named intermediate, an early
return, and a spelled-out type all cost characters and save minutes. **If explaining a line in review
would take longer than rewriting it simply, rewrite it.**

---

## 4. TypeScript configuration

Non-negotiable; each converts a class of runtime bug into a compile error:

```jsonc
{
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "verbatimModuleSyntax": true, // type imports erase predictably
    "noEmit": true, // the bundler emits; tsc only checks
    "moduleResolution": "bundler",
}
```

**Use the framework's default alias.** Whatever the framework's own scaffolding generates is the
one to keep — `@/*` for Next.js, `#/*` or `~/*` elsewhere. The point of an alias is avoiding
`../../..`, and that is served by any prefix; matching the framework's convention means generated
code, documentation, and every example already agree with the project.

```jsonc
// Next.js — from create-next-app, no src directory
"@/*": ["./*"]
```

A second alias per boundary (`#backend/*` → `./convex/*`) makes a cross-boundary import visible in
the import list. Worth adding when the backend directory is large enough that the distinction
carries information; not worth fighting the framework's default for.

**Never `any`.** `unknown` plus narrowing is the honest version. If a third-party type is wrong, wrap
it once in a typed adapter rather than spreading `as` across call sites.

**Prefer `type` for unions and object shapes, `interface` for extensible contracts.** Derive types
from values (`typeof CONST[keyof typeof CONST]`) rather than declaring both and letting them drift.

---

## 5. Project layout

**Follow the framework's own root convention.** If its scaffolding puts source under `src/`, use
`src/`; if it does not — Next.js App Router with no `src` directory — keep the tree flat at the
project root. Do not impose a `src/` layer the framework does not want, and do not scatter the
directories below across two roots. The names and roles are what matter, not their depth.

```
routes/ | app/     route modules — thin, wiring only          [framework-specific]
features/          feature slices, the bulk of the code
components/ui/     design-system primitives, no domain knowledge
lib/               shared pure utilities
styles.css         theme tokens and global styles
convex/            backend functions                          [backend-specific]
  lib/             pure backend logic, no ctx
e2e/               browser tests
docs/              specifications and decisions
scripts/           one-off and CI scripts
```

`features/` sits beside the route directory at whichever root the framework establishes — so
`features/` at the project root for Next.js without `src/`, and `src/features/` for a Vite-based
framework that scaffolds a `src/`. **Wherever it lands, register it with the tooling:** the test
runner's `include` globs, coverage `include`, and any path alias need to know the directory exists.
A feature slice outside the test glob is a directory whose tests silently never run.

**Route modules stay thin.** A route validates its parameters, declares metadata and an error
boundary, and renders one screen component. Business logic in a route file is unreachable from any
test that does not mount a router.

### Framework variants

The framework is the one thing that changes between projects — TanStack Start, Next.js, or SvelteKit.
Keeping routes thin is what makes that cheap: **only the route layer is rewritten, and the feature
slices move across untouched.**

What differs:

|                  | TanStack Start                        | Next.js (App Router)                      | SvelteKit                              |
| ---------------- | ------------------------------------- | ----------------------------------------- | -------------------------------------- |
| Route files      | `src/routes/x.tsx`, flat dot-notation | `app/x/page.tsx` + `layout.tsx`           | `src/routes/x/+page.svelte`            |
| Params / search  | `validateSearch` with Zod             | `searchParams` prop, parsed with Zod      | `load` receives `url`, parsed with Zod |
| Server code      | Server functions                      | Server Components + Server Actions        | `+page.server.ts` load / actions       |
| Data entry point | Router loader or a query hook         | `async` Server Component, or a query hook | `load` function                        |
| Metadata         | `head()`                              | `metadata` export                         | `<svelte:head>`                        |
| Errors           | `errorComponent`                      | `error.tsx`                               | `+error.svelte`                        |
| Screen component | `.tsx` in the feature slice           | `.tsx` in the feature slice               | `.svelte` in the feature slice         |

What does **not** differ — the reason this document is worth copying at all:

- Feature slices and their role split (§6)
- Domain modules, typed domain constants, money handling (§7)
- Naming, formatting, import order (§3, §6)
- Tailwind, `cn`, `cva`, the shadcn/Radix ownership model (§8)
- Zod at every boundary, form behavior rules (§10)
- URL as state (§13) — all three support it
- Backend and authorization rules (§14, §15)
- Testing layers and what counts as a contract (§18)

**Framework-specific code stays in `routes/`.** If a Next Server Component or a SvelteKit `load` is
the only place that can fetch, it fetches and hands plain data to the screen — it does not also
decide, format, or validate. Keeping that boundary sharp is what makes a framework migration a
weekend rather than a rewrite.

**Svelte note:** the slice layout is identical, with `.svelte` components and stores replacing hooks.
`<feature>-domain.ts` is plain TypeScript either way and moves verbatim — which is exactly why it is
where the real logic belongs.

---

## 6. Feature slices

The most load-bearing convention here, and fully framework-independent. A feature is a directory
containing everything for that feature, split by _role_ rather than piled into one file:

```
features/<feature>/
  <feature>-screen.tsx     composition only: layout, routing state, wiring
  <feature>-api.ts         typed backend references, declared once
  <feature>-domain.ts      pure logic, no framework imports, unit-testable alone
  use-<thing>.ts           hooks holding state and effects
  <component>.tsx          one exported component per file, named after the file
  <feature>.test.ts(x)     colocated tests
```

- **One exported component per file** — unless it is a few lines used once, directly above its only
  call site.
- **A screen composes; it does not define.** A screen file declaring a form, dialog, or card body
  means that belongs in its own file.
- **Data access lives in `<feature>-api.ts`,** never inline in a component. One place to see
  everything a feature touches, one place to change when a signature moves.
- **Framework-free logic lives in `<feature>-domain.ts`,** testable without rendering. Most real
  complexity should end up here — and it is the part that survives a framework migration.
- **Past ~300 lines, a file is a smell, not an error.** Ask what it is doing that another file should
  own.

**Promote to `lib/` or `components/ui/` only on a second genuine consumer.** Speculative sharing
produces a utility shaped for one caller and awkward for the next. Duplication is cheaper than the
wrong abstraction, until the second real case shows what the abstraction is.

### Naming

| Thing                         | Convention                             |
| ----------------------------- | -------------------------------------- |
| Files and directories         | `kebab-case.ts`                        |
| Components, types, interfaces | `PascalCase`                           |
| Functions, variables          | `camelCase`                            |
| Enum-like constant objects    | `UPPER_SNAKE` keys                     |
| Booleans                      | `is` / `has` / `can` prefix            |
| Hooks                         | `use-thing.ts` file, `useThing` export |
| Event handlers                | `handleX` local, `onX` prop            |

Files stay kebab-case even when exporting a PascalCase component: one rule for every file beats two
rules and a judgement call.

---

## 7. Domain modeling

### Domain strings live in typed constants

Never write a domain string literal inline, and never branch on one:

```ts
// no
if (event.type === 'card_expiration') { … }

// yes
export const EVENT_TYPE = { CARD_EXPIRATION: 'card_expiration' } as const;
export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

if (event.type === EVENT_TYPE.CARD_EXPIRATION) { … }
```

A typo becomes a compile error rather than a branch that silently never runs. Derive validators from
the constant so schema and code cannot drift, and declare each union once — re-export rather than
retyping in a second module.

Covers statuses, kinds, modes, event types, route paths, and any closed vocabulary. A helper type
that forces keys to match values catches a mispaired entry:

```ts
type EnumOf<T extends string> = { [K in T as Uppercase<K>]: K };
export const STATUS = { DRAFT: 'draft', ISSUED: 'issued' } as const satisfies EnumOf<Status>;
```

### Route paths are constants too

One `APP_ROUTES` object, referenced everywhere. Never an inline path string — except where a
file-based router's codegen requires a literal at the route declaration, which is a tooling
constraint worth documenting inline.

### Money and other exact quantities

**Store integer minor units. Never floats, at any layer.** `0.1 + 0.2` is a wrong balance in
production.

- One parsing helper with an explicit error union (`INVALID | PRECISION | OUT_OF_RANGE`).
- One formatting helper per presentation context (display vs. input field).
- Round in exactly one place, by a documented rule.
- Tests cover zero, boundaries, negatives, and the rounding case.

**Do not re-derive a stored quantity.** If a record stores subtotal and tax and only guarantees
`subtotal + tax === total`, recomputing tax from the subtotal will disagree for a meaningful share of
values. Read what was stored, or store the derivation and say why. The same discipline applies to
durations in milliseconds, weights in grams, percentages in basis points.

### Mirrored pure modules

When the same rule must run in the browser and on the server — a validation the form shows before a
round trip, and the server still enforces — put it in a pure module on each side with identical
logic, and **add a test that runs both over the same inputs and asserts they agree.**

Duplicated logic is only safe while it stays identical, so make drift a test failure. Without that
test this is a liability, not a technique.

---

## 8. Styling and the design system

**Tailwind for everything.** No CSS modules, no styled-components, no ad-hoc `<style>`. One system
means one place to look.

**Theme through CSS custom properties, referenced by semantic name.** Define tokens
(`--color-canvas`, `--color-surface`, `--color-income`) and use semantic classes, never raw palette
values in components. Dark mode then flips tokens instead of touching component code.

**`cn` is the only way classes are combined:**

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

`clsx` handles conditionals; `tailwind-merge` resolves conflicts so a caller's `px-6` actually beats
a default `px-4`. Concatenating template strings gives you both classes and a coin-flip.

**Variants belong in `cva`,** not in ternaries scattered through JSX:

```ts
const badge = cva('inline-flex items-center rounded-full …', {
    variants: { tone: { income: 'bg-income-soft text-income', … } },
    defaultVariants: { tone: 'neutral' },
});
```

The variant list becomes the component's documented API and its type.

**UI primitives follow the shadcn/ui pattern:** Radix behavior, copied into `components/ui/`, owned
by you. Two consequences that matter:

- **Fix bugs in the primitive, not at the call site.** A scroll or focus fix applied to one usage
  will be missing from the next three. When a defect shows up in a primitive's consumer, ask whether
  the primitive should own the fix — usually it should.
- **Primitives hold no domain knowledge.** `components/ui/dialog.tsx` knows nothing about invoices.
  Domain-aware wrappers live in the feature slice.

**Layout contracts belong in a component, not a copied class string.** If every screen must sit in a
page container, apply it where children are rendered or in one shared wrapper. See §19 — this one
cost a production bug.

---

## 9. Icons

**One icon library per project: Lucide.** Mixing sets produces visibly inconsistent stroke weights
and grid alignment.

**Always import through the `Icon`-suffixed alias.** `lucide-react` exports both spellings; the
suffixed one is the only one used:

```ts
// no — is `Plus` an icon or a component?
import { Plus, Settings, Trash2 } from 'lucide-react';
// yes — the import list answers that at a glance
import { PlusIcon, SettingsIcon, Trash2Icon } from 'lucide-react';
```

The reason is scanning cost. In a file importing fifteen names, the suffix instantly separates icons
from components, and it removes the `Settings`-the-icon vs `Settings`-the-screen collision entirely.
If a library only exports bare names, alias at the import: `import { Plus as PlusIcon }`.

**Other icon rules:**

- **Import by name.** Never a namespace import (`import * as Icons`) — it defeats tree-shaking and
  pulls the whole set into the bundle.
- **No arbitrary runtime name lookup** in general components. When an icon identity is stored in a
  database, build one typed registry mapping allowed keys to components, and store the key — never a
  component name or SVG markup.
- **Decorative icons get `aria-hidden='true'`.** An icon-only button gets an accessible name and a
  tooltip. An icon is never the sole indicator of an unfamiliar action.
- **Colour through `currentColor`** so icons follow theme tokens. Hard-coded icon colours are
  reserved for user-chosen category colours.
- **Consistent sizes:** ~16px inside controls and rows, ~18–20px in navigation, ~20–24px for
  feature accents. Consistent stroke width; never mix outline with filled or duotone families.
- **A missing symbol gets a small custom SVG** matching the library's grid and stroke conventions —
  not a second icon dependency for one glyph.

**Fonts** are self-hosted through Fontsource variable packages: no external request, no layout shift,
no third-party availability dependency. Enable tabular numerals wherever numbers align in columns.

---

## 10. Forms and validation

**Zod owns every boundary schema:** form input, route search params, environment variables, and
external API payloads. One validation library, one mental model, and types inferred from schemas
rather than declared twice.

- **Parse at the edge, then trust the type inward.** Validate once where data enters; do not
  re-check the same shape at every layer.
- **Infer, never restate:** `type Input = z.infer<typeof schema>`.
- **Schema next to its consumer** — the route schema in the route file, the form schema in the
  feature.

**TanStack Form** for anything beyond a single field. Field-level validation with a Zod schema,
submit state from the library rather than a hand-rolled `isSubmitting`.

**Form behavior rules that are not optional:**

- **A failed submit preserves what was typed.** Losing input to a network error is the worst possible
  response.
- **Validate on blur and on submit,** not on every keystroke — errors appearing mid-word are noise.
- **Focus the first invalid field** on a failed submit.
- **Inline creation preserves the draft.** Creating a category from inside a form must not discard
  the rest of it.
- **Disable submit while pending** and say what is happening.
- **Errors are actionable**: "Enter an amount up to two decimal places", not "Invalid".

---

## 11. Data fetching and server state

**[framework-specific]** Details vary; the rules do not.

- **Server state is not client state.** Use the query layer (TanStack Query, or the backend's
  reactive client) as the cache. Copying server data into `useState` creates a second source of truth
  that goes stale.
- **Declare backend references once** in `<feature>-api.ts` with argument and return types, so a
  signature change surfaces in one file.
- **Every query handles three states explicitly**: loading, empty, error. Empty is a designed state
  with an action, not blank space.
- **Skip rather than fetch conditionally.** Pass the query's own skip sentinel instead of wrapping
  the hook in a condition, which breaks the rules of hooks.
- **Optimistic updates only where rollback is safe** and the server reconciles. Never for financial
  writes.
- **`useEffect` is a last resort.** Derive during render; use effects for genuine external
  synchronisation only. An effect that sets state from props is usually a derived value in disguise.
- **Paginate every list.** No unbounded fetch; an initial page size plus explicit load-more.

---

## 12. Presentation building blocks

**Tables — TanStack Table.** Headless, so you own the markup and its accessibility. Column
definitions live beside the feature. Sort and filter state belongs in the URL (§13) where it is
shareable. Below a breakpoint, tables become stacked rows rather than a horizontal scroll of core
fields.

**Charts — Recharts.** Every chart needs a text alternative: a summary sentence or a table with the
same numbers, because a chart alone is unreadable to a screen reader and unusable in a print export.
Charts respond to their container, never a fixed pixel width. Tooltips show exact values, not
rounded ones.

**Notifications — Sonner.** Toasts confirm a completed action or report a failure. They are not a
place for validation errors — those belong beside the field. A failure toast says what to do next.
Never toast something the user can already see happened.

**Dates — date-fns with `@date-fns/tz`.** No raw `Date` arithmetic, ever.

- **Store instants as epoch milliseconds; store calendar days as `YYYY-MM-DD` strings.** They are
  different types and conflating them is the bug.
- **Resolve every boundary in the user's IANA timezone**, not the server's and not the browser's.
  "Today" is a timezone-dependent question.
- Tests cover DST transitions, month ends, leap years, and the day-29–31 cases.

---

## 13. URL as state

Filters, selected item, active tab, sort, and pagination cursor belong in validated URL search
parameters. Views become shareable and bookmarkable, browser navigation works, and the back button
does what users expect.

- **Validate with Zod at the route** and fall back safely on invalid input rather than throwing.
- **Ephemeral UI state stays local** — an open dropdown is not URL state.
- **Prefer a search param over a nested route** for "which item is selected", unless the child is a
  genuinely separate page. Fewer route files, and the pattern stays uniform.

---

## 14. Backend, data access, and persistence

Two paths: **Convex** by default, or **Drizzle over Postgres/Turso** when the project needs a
relational database. The universal rules below apply to both; the path-specific parts follow.

### Universal rules

- **Every public function authorizes first** — the first line of the handler, not a middleware you
  can forget to attach. Client-side route guards are UX, never authorization.
- **Never take identity from an argument.** Derive it from the session. An argument-supplied user id
  is an impersonation endpoint.
- **Declare argument and return validators on every public function.** Return validators catch a
  handler that quietly changes shape, and double as documentation.
- **Recompute derived values server-side and ignore the client's copy.** Keep derived fields out of
  the argument validator entirely, so a tampered payload is rejected at the boundary rather than by
  handler logic.
- **Strip secrets in a view layer.** Storage ids, internal user ids, and provider tokens never reach
  the client. Map documents through an explicit view function rather than spreading them.
- **Pure logic lives in `<backend>/lib/` and takes no `ctx`** — testable without a database, and
  mirrorable to the client (§7).
- **Index every query.** No unbounded scans; ownership first in the index; every list paginated or
  bounded.
- **Schema changes on populated tables start optional.** New indexes on large tables are staged and
  observed before being relied on.
- **Long or non-transactional work is scheduled,** not awaited inside a mutation, so the mutation
  stays atomic. The record carries a status field the UI reacts to.
- **Callbacks from that work are idempotent.** A retry arriving after completion cleans up after
  itself rather than duplicating or orphaning.
- **Rate-limit public and expensive paths** at the backend, not the client.
- **Return domain-shaped errors** (`UNAUTHORIZED`, `VALIDATION`, `NOT_FOUND`, `CONFLICT`,
  `RATE_LIMITED`) and map them to messages. Never leak stack traces or provider responses.

### Convex path

- Argument **and** return validators on every public function; return validators catch a handler that
  quietly changes shape.
- Pure logic in `convex/lib/`, taking no `ctx` — testable without a database and mirrorable to the
  client (§7).
- Schema additions on populated tables start **optional**; new indexes on large tables are staged and
  observed before being relied on.
- Node-only work (`'use node'`) lives in its own module and reaches back through internal functions,
  never by importing the generated API into the Node bundle.

### Relational path — Drizzle + Postgres / Turso

**Choosing:** **Postgres** for anything with real concurrency, relational depth, or growth ahead of
it. **Turso** (libSQL) for small projects, edge reads, and embedded/local-first cases. Drizzle is the
ORM either way, so the choice is mostly about hosting and write patterns rather than code shape —
but decide up front: SQLite's type affinity and weaker constraint support show up later, not sooner.

**Schema**

- One `db/schema/` directory, one file per domain area, re-exported from an index. Not one
  thousand-line file.
- **Infer types, never restate them:** `type User = typeof users.$inferSelect` and `$inferInsert`.
  A hand-written interface beside a table is guaranteed to drift.
- **Money as integer minor units** (§7) — `integer`/`bigint`. `numeric` is acceptable where exact
  decimal arithmetic is genuinely wanted; `real`/`double` is never acceptable for money.
- **Timestamps as `timestamptz`** in Postgres, storing UTC. Calendar days stay `date` or a
  `YYYY-MM-DD` text column — a day is not an instant (§12).
- **Prefer text columns plus an application-level constant union over native database enums.**
  Adding a value to a Postgres enum is a migration; adding one to a union is a line in §7's constant.
  The database keeps a check constraint if the value set is truly closed.
- **Every foreign key is declared,** with the delete behavior chosen explicitly rather than defaulted.
- **Index what you filter, sort, and join on.** Ownership column first in a composite index, matching
  how the query narrows. An unindexed `where` on a growing table is a future incident.

**Migrations**

- Generated by `drizzle-kit`, reviewed, and committed. **Never edit an applied migration** — write a
  new one.
- Schema change and its migration land in the same commit, so a checkout is never half-migrated.
- **A data migration is written by hand and is separate from the structural one.** Generated SQL adds
  and drops columns; it does not know how to backfill correctly.
- Additive first: add nullable, backfill, then enforce `not null` in a later migration. A destructive
  change is rehearsed against a restored snapshot before it touches production.

**Queries**

- **Query code lives in a data-access layer** — `db/queries/<area>.ts` or `<feature>-queries.ts` —
  never inline in a component, a route, or a server action. One place to audit for authorization and
  N+1s.
- **Every query filters by owner/tenant.** A missing `where userId = …` is the relational equivalent
  of a public collection; it will not announce itself.
- **Never interpolate user input into `sql`.** Use the query builder, or `sql` with placeholders. String
  concatenation into SQL is the injection.
- **Avoid N+1:** use joins or Drizzle relational queries. A loop containing an `await db.select` is
  the smell.
- **Wrap multi-write invariants in a transaction.** If two writes must both happen or neither, they
  belong in `db.transaction`, not sequential awaits.
- **Paginate every list** with keyset pagination where order is stable — `offset` degrades on large
  tables.
- **`select` the columns you need** on wide tables rather than `select *`, particularly where a row
  holds anything sensitive.

**Connections**

- Postgres: pool, and use a serverless/edge-appropriate driver where the runtime demands it. Never
  open a connection per request in a serverless function without pooling in front.
- Turso: HTTP/libSQL client; be aware of write latency to the primary and design reads accordingly.
- **The client is created once** in one module and imported — never constructed inside a handler.

**Testing** — run against a real database (a container or a per-test file for SQLite), not a mock.
Mocked SQL proves the mock works. Wrap each test in a transaction and roll back, or truncate between
tests, so runs stay independent.

---

## 15. Authentication and authorization

**Better Auth in every project** — every framework, Convex or Drizzle. It is the one piece that never
changes, which is the point: auth is where a bespoke choice costs the most and pays the least.

### Setup

- **Auth configuration lives in its own module** (`src/lib/auth`, `auth.ts`, the backend's auth
  entry) and nowhere else. Provider configuration, session rules, and adapters stay contained so an
  upgrade touches one place.
- **Use the official adapter for the datastore** — the Convex component, or the Drizzle adapter
  pointed at the same schema the rest of the app uses. Do not hand-roll session tables.
- **Auth tables are owned by the library.** With Drizzle, generate them from its schema and treat
  them as generated: do not edit them, and do not add application columns to them. Application data
  about a user goes in your own `profiles` table keyed by the auth user id.
- **Pin the auth library, its adapter, and the framework integration as a set** and upgrade them
  together. Mismatched versions across that boundary fail in confusing ways.
- **Server and client halves are separate modules.** Never import the server config into client code
  — that is how a secret reaches a bundle.

### Rules

- **One shared authorization helper**, called by every private function. If authorization can be
  forgotten, it will be.
- **Authentication is not authorization.** A valid session says who; it never says _may_. Every
  handler still checks ownership of the specific record it touches.
- **Fail closed.** An unknown state is unauthorized, not authorized.
- **Sessions over stored tokens**; never persist provider tokens you do not need.
- **Generic responses on auth endpoints.** "If this address is authorized, a link has been sent"
  reveals nothing about which accounts exist.
- **Never log tokens, links, or credentials** — including inside error reports and Sentry breadcrumbs.
- **Rate-limit sign-in and any send-an-email endpoint** by identifier and by client signal.
- **Redirects go to an allowlist.** An open redirect after sign-in is a phishing vector.
- **Wait for auth readiness before issuing private queries** rather than firing and handling the
  rejection — that shows an error flash on every cold load.
- **Tests cover unauthenticated and wrong-owner paths**, not just the happy path (§18).

---

## 16. Observability

**Sentry for client and server errors.** Configure a privacy scrubber before shipping: no PII, no
financial values, no request bodies. Attach a release identifier and upload source maps in CI, or
stack traces are unreadable. Errors reaching a boundary get a correlation id shown to the user _and_
present in the log — an id that only exists in the browser is a support handle that matches nothing.

**Pino for structured server logs.** Explicit allowlists rather than dumping objects; one log line
per meaningful event, with a level that means something. Sensitive fields are redacted at the logger,
not at the call site.

**A health endpoint** that checks process and configuration, wired to external uptime monitoring.

**Errors the user sees are localized and actionable.** A generic failure code is a bug report waiting
to happen — the `GENERATION_FAILED` that hides "an emoji in a note crashed the renderer" costs hours.

---

## 17. Generating files

For PDF (**pdf-lib**), spreadsheets (**write-excel-file**), and archives (**fflate**):

- **One canonical dataset builder** feeding every format, so CSV, XLSX, and PDF cannot disagree about
  totals. Format renderers consume it; they never recompute.
- **Generate server-side** for consistent output and to keep large work off the device.
- **Bound the work** with an explicit record cap and a clear error when exceeded, rather than
  silently truncating.
- **Sanitize before writing.** Spreadsheet cells beginning `=`, `+`, `-`, or `@` are formula
  injection. PDF standard fonts encode a limited character set — **any user-entered text can contain
  a character that throws**, so sanitize at the single point where text reaches the page.
- **Treat generated file URLs as bearer credentials.** Authorize before returning one; never persist
  one.
- **Store temporary output with an expiry and a cleanup job;** store durable documents permanently
  and say which is which.

---

## 18. Testing

### Layers

| Layer               | Scope                                        | Location             |
| ------------------- | -------------------------------------------- | -------------------- |
| Pure unit           | Domain logic, no I/O                         | Beside the module    |
| Backend integration | Functions, authorization, validation, schema | Beside the function  |
| Component           | User-visible behavior, forms, recovery, a11y | Beside the component |
| Browser             | Boot, auth, critical end-to-end paths        | `e2e/`               |

Colocate tests with the code they exercise. Name them after observable behavior ("refuses a pending
transaction"), not implementation ("calls validate").

### What every backend change proves

Happy path, **unauthenticated**, **a different owner**, invalid arguments, missing records, and the
relevant failure paths. The wrong-owner case needs a genuinely second identity, not a different id
passed as an argument.

### Component tests

Query the way users find things — role, accessible name, label, visible text. Use `userEvent`, not
synthetic events. Test auth readiness, validation, pending states, error recovery, keyboard
operation, and focus management.

Do **not** test class lists, framework internals, or generated files. Avoid large snapshots: they
fail on every change and get regenerated without being read.

### Contract vs. styling

- **Do** test structural contracts — a screen using the shared page container, navigation membership,
  an exported column set. Other code depends on these.
- **Do not** test styling. Asserting `gap-6` proves nothing and breaks on every redesign.
- The line: would a change break something else silently? Contract. Would it just look different?
  Styling.

### Prove the failure first

For any bug fix, **write the failing test and watch it fail before writing the fix.** A test authored
afterwards frequently passes for the wrong reason, or against a fixture that assumes the bug away.

Apply the same skepticism to a test that passes on first run: confirm the assertion _can_ fail. A
test that silently finds nothing — an empty list, a missing element, a `find()` returning `undefined`
— passes while asserting nothing.

### Coverage

Global floor plus per-module floors on risk-bearing code. **Never lower a threshold to merge**; that
inverts the tool. Coverage counts executed lines, not covered cases — read the report for missed
error and authorization paths rather than chasing the number.

### Fixtures and seed data

Small typed builders per test, not one shared dump. Each test creates its own data and stays
deterministic under parallel execution. Mock network, clock, and randomness; seed Faker with a fixed
value so failures reproduce.

**A fixture is an assumption.** If every fixture takes the easy path, the suite proves only that the
easy path works — the most common source of a bug that ships green.

For development, a one-command **idempotent** seed script that fills the database with realistic data
pays for itself immediately. It must refuse to run against production (fail closed on an explicit
opt-in variable), be safe to re-run, and write through the same validators real writes use so the
fixture cannot drift from the rules.

### Browser tests

Keep them short, independent, and free of fixed delays. **Build an authenticated fixture early** —
a setup project that establishes a session and stores state — or every screen behind auth is
untestable in a browser, which is exactly where visual and layout regressions hide.

---

## 19. UI contracts and accessibility

- **A layout contract expressed as a copied class string will eventually be omitted,** silently.
  Apply it in one place instead of remembering it. _(This one cost a production bug: a new screen
  shipped with no page padding because it omitted a string every other screen happened to have.)_
- **Loading, empty, and error states are part of the feature,** not a follow-up. Skeletons match the
  geometry they replace so nothing jumps.
- **Every interactive control has an accessible name**, keyboard reachability, and visible focus.
- **Never encode meaning in colour alone.** Pair with a label, icon, or sign.
- **A disabled control says why** — inline or via tooltip. A dead button with no explanation is a bug
  report.
- **Meet WCAG 2.2 AA** for contrast, semantics, labels, errors, and focus. Honour
  `prefers-reduced-motion`.
- **Design to a minimum width** (360px) and verify to 200% zoom. No horizontal page scrolling for
  core content.
- **Touch targets ≥ 44px** for primary controls.
- **Motion communicates relationship**, 100–250ms, opacity and transform only. No ambient animation.

---

## 20. Generated code and environment

**Never hand-edit generated files** — API clients, route trees, schema types. Regenerate and commit
the result so CI and a fresh clone agree. If a generated file needs to change, change its source.

**Environment variables split by owner and stay split:**

| Owner            | Rule                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Client bundle    | Public values only, behind the required prefix (`VITE_`, `NEXT_PUBLIC_`). **A secret behind a public prefix is a published secret.** |
| Server / backend | Everything else, set on the deployment, never in the client bundle.                                                                  |

Validate at startup with `@t3-oss/env-core` + Zod and fail loudly: a missing variable stops the
process with its name rather than surfacing later as an unexplained 500. Keep `.env.example` with
safe placeholders, updated in the same commit that adds a variable. Paired credentials (client id and
secret) validate as a pair.

---

## 21. Work tracking and git

Scale down for a solo project; keep the shape.

- **Permanent typed identifiers:** `BUG-###`, `FEAT-###`, `IMPR-###`, `OPS-###`, `DISC-###`. Never
  renumbered or reused, so a reference in a commit stays resolvable forever.
- **One authoritative definition per item.** Other documents link to the identifier rather than
  copying requirements, which would immediately drift.
- **Branch per item:** `feat/feat-016-invoicing`, `fix/bug-010-invoices-padding`.
- **Conventional commit subject, identifier last:** `fix(invoices): restore page padding (BUG-010)`.
- **Commit messages explain why.** The diff shows what. Sessions end; reasoning is what the next
  reader needs.
- **Feature work goes through a pull request** even solo — it is the only place the reasoning,
  validation, and rollback plan live together.
- **A pull request records** outcome, validation performed, schema/environment changes, and
  deployment or rollback notes. **State what you did not verify** — a named gap gets checked; an
  unmentioned one does not.
- **Changelog entries describe user-visible outcomes in plain language.** Internal work is tracked
  but gets no entry.
- **Hotfixes** branch from the release branch, merge and deploy through it, then **immediately merge
  back** to the development branch — otherwise the next release silently reverts the fix. Mark them
  so they are findable, and record why the defect got past the gates.

---

## 22. Before shipping

Run what CI runs, locally, cheapest failure first:

```
check          format, lint, import order
typecheck
test           all projects
test:coverage  thresholds enforced
build          production build
test:e2e       when routing, auth, or a critical path changed
```

Then, for anything with a visible surface: **open it and look at it.** Tests confirm behavior, not
that a screen is usable. A feature whose UI no human has viewed is unverified regardless of how green
the suite is.

**Deployment discipline:** name the target environment out loud before any command that touches it.
Additive, optional schema changes are safe on populated tables; anything else needs a migration plan
and a rehearsal against a snapshot. Know whether a change needs a backend deploy at all — a
frontend-only fix does not.

---

## 23. Lessons that earned their place

Each cost real time or shipped a real bug.

1. **A test that passes on first write deserves suspicion.** Break the code deliberately and confirm
   it fails. Assertions against absent elements pass while proving nothing.
2. **Fixtures encode assumptions.** A PDF renderer shipped that crashed on any transfer and on any
   emoji in a note, because every fixture used ASCII and left the transfer field empty.
3. **A guarantee is not the guarantee you assumed.** `subtotal + tax === total` does not imply
   `tax === rate × subtotal`. Check what is actually promised, then measure the gap.
4. **Silent skips hide forks.** Code that "does nothing when the state is unexpected" turns an
   invariant violation into corrupt data. Refuse loudly instead.
5. **A guard that is never invoked is decoration.** An ownership re-check whose parameter is never
   passed reads as protection and provides none.
6. **Copied contracts get forgotten.** If correctness depends on remembering a class string or a
   wrapper, it will eventually be omitted.
7. **A generic error message hides the cause and costs hours.** Map failures to something
   diagnosable before shipping the path that can fail.
8. **Verify the claim, not the summary** — from a tool, a review, or your own earlier note. Re-derive
   load-bearing facts from the source before building on them.
9. **Say what you did not check.** An honest gap gets closed; a confident summary papering over one
   ships the bug.
