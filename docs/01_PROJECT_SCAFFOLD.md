# Project Scaffold

The reference setup for this project and future ones on the same stack:
**Next.js (App Router) + Convex + Better Auth + Tailwind v4 + shadcn/Base UI**, with
Bun as the package manager and a single CI quality gate.

Follow it top to bottom for a new project. Every choice that is non-obvious has a
rationale attached — read those before deviating.

---

This document is the **stack-specific** layer. The portable rules — principles, naming,
feature slices, domain modeling, testing discipline, git conventions — live in
[`docs/02_CODING_GUIDELINES.md`](02_CODING_GUIDELINES.md) and apply to every project
regardless of framework. Where the two disagree, §13 below records which one wins and why.

---

## 1. Stack

| Layer          | Choice                                                     |
| -------------- | ---------------------------------------------------------- |
| Runtime / PM   | Bun `1.3.14` (pinned via `packageManager`)                 |
| Framework      | Next.js `16.3.0`, App Router, Turbopack, React `19.2.8`    |
| Compiler       | React Compiler (`reactCompiler: true`)                     |
| Backend        | Convex `^1.43.0`                                           |
| Auth           | Better Auth `1.6.15` + `@convex-dev/better-auth` `^0.12.5` |
| Styling        | Tailwind CSS v4 (PostCSS plugin, no `tailwind.config`)     |
| Components     | shadcn CLI (`base-nova` style) over `@base-ui/react`       |
| Icons          | `lucide-react`                                             |
| Route progress | `nextjs-toploader` `^3.9.17`                               |
| Env validation | `@t3-oss/env-nextjs` + Zod v4                              |
| Unit tests     | Vitest `^4` (two projects: `convex` + `frontend`)          |
| E2E            | Playwright (Chromium only)                                 |
| Format / Lint  | Prettier (4-space, single quotes) + ESLint flat config     |

### Version pins that matter

- **`better-auth` is pinned exactly to `1.6.15`** — no caret. `@convex-dev/better-auth@0.12.5`
  declares a peer range of `>=1.6.11 <1.7.0` but is built against `1.6.15`; on `1.6.26`
  the `authClient` no longer structurally matches `ConvexBetterAuthProvider`'s `AuthClient`
  type and `tsc` fails with `useSession().data` inferred as `never`. Bump both together.
- `next` and `eslint-config-next` are pinned to the same exact version.
- `react`/`react-dom` pinned exact (React Compiler is sensitive to minor drift).

---

## 2. Bootstrap order

```bash
bunx create-next-app@latest my-app --ts --app --tailwind --eslint --src-dir=false --import-alias "@/*"
cd my-app

# Backend
bun add convex
bunx convex dev --once           # creates the deployment + .env.local

# Auth
bun add better-auth@1.6.15 @convex-dev/better-auth

# Env + UI
bun add @t3-oss/env-nextjs zod @base-ui/react class-variance-authority clsx \
        tailwind-merge tw-animate-css lucide-react nextjs-toploader
bunx shadcn@latest init          # style: base-nova, baseColor: neutral, rsc: true

# Tooling
bun add -d prettier eslint-config-prettier @trivago/prettier-plugin-sort-imports \
          prettier-plugin-tailwindcss
bun add -d vitest @vitest/coverage-v8 @vitejs/plugin-react jsdom @edge-runtime/vm \
          convex-test @testing-library/react @testing-library/dom \
          @testing-library/jest-dom @testing-library/user-event
bun add -d @playwright/test babel-plugin-react-compiler
bunx playwright install --with-deps chromium

# Agent tooling (optional but recommended — see §11)
bunx convex ai-files install
```

Then copy the config files from §3–§8 and run
`bun run check && bun run typecheck && bun run test && bun run build && bun run test:e2e`.

---

## 3. Root config files

### `package.json` scripts

```json
{
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "prettier --check . && eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "auth:generate": "auth generate --config ./convex/betterAuth/auth.ts --output ./convex/betterAuth/schema.ts"
}
```

Also set at the root of `package.json`:

```json
{
    "type": "module",
    "packageManager": "bun@1.3.14",
    "ignoreScripts": ["sharp", "unrs-resolver"],
    "trustedDependencies": ["sharp", "unrs-resolver"]
}
```

`ignoreScripts` + `trustedDependencies` list the same two packages deliberately: Bun
blocks postinstall scripts by default, and these two need theirs to build native
binaries. Nothing else gets to run install scripts.

### `next.config.ts`

```ts
import type { NextConfig } from 'next';

import './lib/env';

const nextConfig: NextConfig = {
    reactCompiler: true,
};

export default nextConfig;
```

Importing `./lib/env` here makes a missing/invalid env var fail the **build**, not a
runtime request.

### `tsconfig.json`

Stock Next.js output plus:

- `"paths": { "@/*": ["./*"] }` — alias from the repo root, not `src/` (this scaffold
  has no `src` directory).
- `"strict": true`, `"incremental": true`, `next` TS plugin.
- The strictness flags [`docs/02_CODING_GUIDELINES.md`](02_CODING_GUIDELINES.md) §4 calls
  non-negotiable — each turns a class of runtime bug into a compile error:

    ```jsonc
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "verbatimModuleSyntax": true,
    ```

    `verbatimModuleSyntax` means `import type` is required for type-only imports; the
    existing code already complies, and `tsc` names any file that does not.

- `include` must carry `.next/types/**/*.ts` and `.next/dev/types/**/*.ts` so
  Next 16's generated `LayoutProps<'/'>` / `PageProps` helpers resolve.
- `"allowJs": true` and `**/*.mts` in `include` — the config files are `.mjs`/`.mts`.

### `eslint.config.mjs`

```js
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    // Must stay last: disables ESLint rules that conflict with Prettier.
    prettier,
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        // Convex codegen and test/coverage output are not ours to lint.
        '**/_generated/**',
        'coverage/**',
        'playwright-report/**',
        'test-results/**',
    ]),
]);
```

`globalIgnores` **replaces** `eslint-config-next`'s defaults, so the first four entries
must be restated. `**/_generated/**` (not `convex/_generated`) is required because the
Better Auth local component adds a second codegen dir at `convex/betterAuth/_generated`.

### `.prettierrc.json`

4-space indent, 100 cols, single quotes (JSX included), semicolons, trailing commas.
Two plugins, **in this order** (`prettier-plugin-tailwindcss` must be last):

```json
{
    "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    "importOrder": [
        "^(react|react-dom)$",
        "^next(/.*)?$",
        "<THIRD_PARTY_MODULES>",
        "^@/(.*)$",
        "^[./]"
    ],
    "importOrderSeparation": true,
    "importOrderSortSpecifiers": true,
    "importOrderCaseInsensitive": true,
    "importOrderParserPlugins": ["typescript", "jsx", "decorators-legacy"],
    "tailwindStylesheet": "./app/globals.css",
    "tailwindFunctions": ["cn", "cva"]
}
```

`tailwindStylesheet` is how the v4 plugin finds the theme — there is no config file to
infer it from.

`.prettierignore`:

```
node_modules
.next
out
build
coverage
playwright-report
test-results

**/_generated

# generated / vendored agent tooling
.claude
.agents
skills-lock.json

bun.lock
next-env.d.ts
```

### `.gitignore`

The create-next-app default, plus `/coverage`, `/playwright-report`, `/test-results`,
`/blob-report`, `/playwright/.cache`. Note `.env*` is ignored wholesale — `.env.example`
must be force-added (`git add -f .env.example`) or excluded with a `!.env.example` rule.

### `postcss.config.mjs`

```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

---

## 4. Environment variables

Two separate stores. Getting this wrong is the most common setup mistake.

| Where                  | What goes there                                                                                      | How to set                |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------- |
| `.env.local` (Next.js) | `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `NEXT_PUBLIC_SITE_URL` | file, gitignored          |
| Convex deployment      | `BETTER_AUTH_SECRET`, `SITE_URL`, OAuth client secrets, API keys                                     | `bunx convex env set K V` |

The Better Auth instance **runs inside Convex**, not in the Next.js server — so its
secrets belong to the deployment, never to `.env.local`.

```bash
bunx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
bunx convex env set SITE_URL http://localhost:3000
bunx convex env list                                 # verify
```

`NEXT_PUBLIC_CONVEX_SITE_URL` is the same host as `NEXT_PUBLIC_CONVEX_URL` but ending in
`.site` instead of `.convex.cloud` (self-hosted: one port higher).

### `lib/env.ts`

```ts
import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const env = createEnv({
    server: {
        CONVEX_DEPLOYMENT: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_CONVEX_URL: z.url(),
        NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
        NEXT_PUBLIC_SITE_URL: z.url(),
    },
    runtimeEnv: {
        CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
        NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    },
    emptyStringAsUndefined: true,
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
```

Every `NEXT_PUBLIC_*` key must be repeated verbatim in `runtimeEnv` — Next inlines them
at build time and dynamic lookup does not work.

**Adding an env var is a four-file change.** Miss one and CI breaks:
`lib/env.ts` → `.env.example` → `.env.local` → the CI `env:` block.

Convex-side env vars are declared in `convex/convex.config.ts` under `defineApp({ env })`
and read via `import { env } from './_generated/server'` — not `process.env`. The one
exception is `convex/betterAuth/auth.ts`, which reads `process.env.SITE_URL` and
`process.env.BETTER_AUTH_SECRET` directly because the `auth` CLI evaluates that module
outside a deployment.

---

## 5. Convex + Better Auth wiring

Uses the **local component install** (`convex/betterAuth/`) rather than the NPM
component, so the generated schema is ours to extend with custom indexes.

### File map

```
convex/
  convex.config.ts            defineApp({ env }) + app.use(betterAuth)
  auth.config.ts              registers Better Auth as the Convex auth provider
  http.ts                     authComponent.registerRoutes(http, createAuth)
  auth.ts                     app-level auth queries (getCurrentUser, ...)
  schema.ts                   your app tables (add as the domain appears)
  betterAuth/
    convex.config.ts          defineComponent('betterAuth')
    auth.ts                   createClient + createAuthOptions + createAuth
    adapter.ts                createApi(schema, createAuthOptions) re-exports
    schema.ts                 GENERATED — bun run auth:generate
lib/
  auth-client.ts              createAuthClient({ plugins: [convexClient()] })
  auth-server.ts              convexBetterAuthNextJs({ ... })
  env.ts                      validated env
  utils.ts                    cn()
components/
  convex-client-provider.tsx  'use client' ConvexBetterAuthProvider
app/
  api/auth/[...all]/route.ts  export const { GET, POST } = handler
  layout.tsx                  await getToken() → <ConvexClientProvider initialToken>
```

### `convex/convex.config.ts`

```ts
import { defineApp } from 'convex/server';

import betterAuth from './betterAuth/convex.config';

const app = defineApp({
    // Declare backend env vars here for type-safe, deploy-time-validated access.
    env: {},
});

app.use(betterAuth);

export default app;
```

### `convex/auth.config.ts`

```ts
import { getAuthConfigProvider } from '@convex-dev/better-auth/auth-config';
import type { AuthConfig } from 'convex/server';

export default {
    providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
```

### `convex/betterAuth/auth.ts`

```ts
import { createClient } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import type { GenericCtx } from '@convex-dev/better-auth/utils';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';

import { components } from '../_generated/api';
import type { DataModel } from '../_generated/dataModel';
import authConfig from '../auth.config';
import schema from './schema';

export const authComponent = createClient<DataModel, typeof schema>(components.betterAuth, {
    local: { schema },
    verbose: false,
});

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
    return {
        appName: 'My App',
        baseURL: process.env.SITE_URL,
        secret: process.env.BETTER_AUTH_SECRET,
        database: authComponent.adapter(ctx),
        emailAndPassword: { enabled: true },
        plugins: [convex({ authConfig })],
    } satisfies BetterAuthOptions;
};

// Consumed by the `auth` CLI when regenerating ./schema.ts.
export const options = createAuthOptions({} as GenericCtx<DataModel>);

export const createAuth = (ctx: GenericCtx<DataModel>) => betterAuth(createAuthOptions(ctx));
```

### `convex/betterAuth/adapter.ts`

```ts
import { createApi } from '@convex-dev/better-auth';

import { createAuthOptions } from './auth';
import schema from './schema';

export const { create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany } =
    createApi(schema, createAuthOptions);
```

### `convex/http.ts`

```ts
import { httpRouter } from 'convex/server';

import { authComponent, createAuth } from './betterAuth/auth';

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;
```

### Generating the schema

`convex/betterAuth/schema.ts` does not exist until you generate it — expect TS errors in
`auth.ts` and `adapter.ts` until then:

```bash
bun run auth:generate
bunx convex dev --once      # installs the component into the deployment
```

**Re-run both after every change to `createAuthOptions`** (new plugin, new
`user.additionalFields`, changed `emailAndPassword` options, …). The generated file is
committed; regenerating is not optional, the adapter is typed against it.

The generator emits `user`, `session`, `account`, and `verification` tables with the
indexes Better Auth needs. To add your own indexes, generate to an alternate path and
re-export the table definitions from a hand-written `schema.ts` — see
<https://labs.convex.dev/better-auth/features/local-install#adding-custom-indexes>.

### `lib/auth-server.ts`

```ts
import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs';

import { env } from './env';

export const {
    handler,
    preloadAuthQuery,
    isAuthenticated,
    getToken,
    fetchAuthQuery,
    fetchAuthMutation,
    fetchAuthAction,
} = convexBetterAuthNextJs({
    convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
    convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL,
});
```

Feed it the validated `env` object rather than `process.env.X!` — same values, but a
misconfiguration fails at build with a named error instead of at runtime.

### `app/layout.tsx`

```tsx
export default async function RootLayout({ children }: LayoutProps<'/'>) {
    const initialToken = await getToken();

    return (
        <html lang='en' className={cn(/* fonts */)}>
            <body className='flex min-h-full flex-col'>
                <ConvexClientProvider initialToken={initialToken}>{children}</ConvexClientProvider>
            </body>
        </html>
    );
}
```

**Consequence:** `getToken()` reads cookies, so the root layout is dynamic and every
route renders on demand (`ƒ` in the build output). If a project needs statically
prerendered marketing pages, move the provider below the root layout, into the
authenticated segment's layout only.

### Usage patterns

| Need                                   | Use                                                           |
| -------------------------------------- | ------------------------------------------------------------- |
| Sign in / up / out from the client     | `authClient.signIn.email()`, `.signIn.social()`, `.signOut()` |
| Reactive data in a client component    | `useQuery(api.foo.bar)` from `convex/react`                   |
| Gate a server component                | `await isAuthenticated()`                                     |
| Read data in a server component        | `await fetchAuthQuery(api.foo.bar)`                           |
| SSR a query, hydrate on the client     | `preloadAuthQuery` → `usePreloadedAuthQuery`                  |
| Call a Better Auth `auth.api.*` method | Wrap it in a Convex function; call that                       |

`preloadAuthQuery` is for rendering different UI per data state — it is **not** an
access control mechanism. Enforce authorization inside the Convex functions themselves.

### Adding an OAuth provider

```bash
bunx convex env set GITHUB_CLIENT_ID xxx
bunx convex env set GITHUB_CLIENT_SECRET xxx
```

Add `socialProviders: { github: { clientId: process.env.GITHUB_CLIENT_ID!, ... } }` to
`createAuthOptions`, then `bun run auth:generate && bunx convex dev --once`. The OAuth
callback URL is on the **Convex site domain**: `$NEXT_PUBLIC_CONVEX_SITE_URL/api/auth/callback/github`.

### Verifying the wiring

```bash
curl "$NEXT_PUBLIC_CONVEX_SITE_URL/api/auth/ok"   # backend mounted → {"ok":true}
curl http://localhost:3000/api/auth/ok            # Next proxy works  → {"ok":true}

# full round trip
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H 'Content-Type: application/json' -H 'Origin: http://localhost:3000' \
  -d '{"email":"probe@example.com","password":"probe-password-123","name":"Probe"}'
```

The `Origin` header is required — without one Better Auth's CSRF check returns
`403 MISSING_OR_NULL_ORIGIN`. Browsers send it automatically; `curl` does not.

Delete probe users from the Convex dashboard afterwards — component tables are not
reachable from the CLI.

---

## 6. Styling and UI

`app/globals.css` is the single source of truth. Tailwind v4 has no JS config, so
`components.json` sets `"tailwind": { "config": "" }`.

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';

@custom-variant dark (&:is(.dark *));

@theme inline {
    /* maps CSS vars → Tailwind utilities: --color-primary → bg-primary */
}

:root {
    /* light palette, oklch */
}
.dark {
    /* dark palette */
}

@layer base {
    * {
        @apply border-border outline-ring/50;
    }
    body {
        @apply bg-background text-foreground;
    }
    html {
        @apply font-sans;
    }
}
```

- Dark mode is **class-based** (`.dark`), via `@custom-variant` — not
  `prefers-color-scheme`. Something has to put `.dark` on `<html>`.
- Colors are oklch. Keep new tokens in the same space so opacity modifiers behave.
- Fonts are wired in `app/layout.tsx` with `next/font` (Geist Sans, Geist Mono, Inter)
  and exposed as `--font-sans` / `--font-geist-mono`, which `@theme inline` maps to
  `font-sans` / `font-mono`.

`components.json`: style `base-nova`, `rsc: true`, `tsx: true`, `baseColor: neutral`,
`cssVariables: true`, `iconLibrary: lucide`, aliases pointing at `@/components`,
`@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`.

Add components with `bunx shadcn@latest add <name>` (or through the shadcn MCP server,
see §11). They land in `components/ui/` and are yours to edit.

`lib/utils.ts` is the standard `cn()`:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

Both `cn` and `cva` are registered in `.prettierrc.json` (`tailwindFunctions`) and in
`.vscode/settings.json` (`tailwindCSS.experimental.classRegex`) so class sorting and
IntelliSense work inside them.

### Route progress bar

`nextjs-toploader` renders the top loading bar on client-side navigation. It mounts once
in `app/layout.tsx`, above the Convex provider:

```tsx
<NextTopLoader color='var(--primary)' height={2} shadow={false} showSpinner={false} zIndex={9999} />
```

- `color` takes any CSS colour **string**, so a `var()` works — the bar then tracks the
  theme token through light/dark with no second definition and no client-side theme read.
- The component is `'use client'` internally; importing it into the server layout is
  fine and needs no wrapper.
- It injects its `<style>` during SSR, so the CSS is in the initial HTML — but that alone
  does **not** prove the component hydrated.
- The package advertises Next 14/15; it works on 16, but that is not a supported claim
  upstream. Re-verify after a Next major upgrade.

**How to verify it, since it is easy to fake:** the bar is only triggered by `next/link`
clicks. A plain `<a>` causes a full page load and a raw `history.pushState()` is not
hooked — both look like a broken loader when the loader is fine. Test with a real `Link`
navigation between two routes and a `MutationObserver` watching for `#nprogress .bar`;
the bar's computed `backgroundColor` should resolve to the theme colour, not the literal
string `var(--primary)`.

---

## 7. Testing

### `vitest.config.ts` — two projects in one run

```ts
projects: [
    {
        // Convex functions run against an in-memory backend in the
        // edge runtime, matching the real Convex JS environment.
        extends: true,
        test: {
            name: 'convex',
            include: ['convex/**/*.test.{ts,tsx}'],
            environment: 'edge-runtime',
            server: { deps: { inline: ['convex-test'] } },
        },
    },
    {
        extends: true,
        plugins: [react()],
        test: {
            name: 'frontend',
            include: ['{app,components,lib}/**/*.test.{ts,tsx}'],
            environment: 'jsdom',
            setupFiles: ['./vitest.setup.ts'],
            globals: true,
        },
    },
];
```

`@` is aliased to the repo root in `resolve.alias` — Vitest does not read `tsconfig.paths`.
Coverage is v8, reporting `text` + `lcov` over `app|components|lib|convex`, excluding
`_generated`, test files, and configs.

`vitest.setup.ts` (frontend project only) loads `@testing-library/jest-dom/vitest` and
runs `cleanup()` after each test.

The frontend `include` glob is `{app,components,features,lib}` and coverage `include`
lists the same four. **A new top-level source directory must be added to both** — a slice
outside the glob has tests that silently never run, which looks identical to passing.

### Coverage thresholds

Enforced by `test:coverage`, which is what CI runs — a failing floor fails the build.

| Scope       | Statements | Branches | Functions | Lines |
| ----------- | ---------- | -------- | --------- | ----- |
| Global      | 80         | 80       | 75        | 80    |
| `convex/**` | 90         | 90       | 90        | 90    |

Convex carries the higher floor because every function there is a public network surface
and the place authorization is enforced.

**Never lower a threshold to merge** — that inverts the tool. Raise the global floor as
real code lands.

What is excluded from measurement, and why the list is short on purpose:

- `**/_generated/**` and `convex/betterAuth/schema.ts` — generated, not ours to test.
  Note the glob is `**/_generated/**`: `convex/betterAuth/` has its own codegen directory,
  and an exclude naming only `convex/_generated` silently counts it.
- A named list of **declaration-only wiring** modules — `lib/auth-server.ts`,
  `convex/http.ts`, `app/api/**`, the provider, and similar. Each is one factory call or
  re-export with no branches; a unit test would assert that an assignment happened. They
  are exercised by the build and the e2e smoke tests.

That second list is the one that rots. **Anything on it that grows a conditional comes
off it** — an exclusion is how untested logic hides behind a green number.

Coverage counts executed lines, not covered cases. Read the report for missing error and
authorization paths rather than chasing the percentage.

### Proving a threshold is real

A threshold that never fires is decoration. Both of these were verified rather than
assumed, and the same check is worth repeating whenever the config changes:

- Raise the global floor above the current number → the run must fail with
  `does not meet global threshold`.
- Add an uncovered branch under `convex/` → the run must fail citing
  `does not meet "convex/**" threshold`, which also proves the glob matches real files
  rather than nothing.

The same skepticism applies to the tests themselves: `convex/auth.test.ts` passed on
first write, so the handler was deliberately broken to confirm the assertions could fail.

Convex tests: `convexTest(schema)`, `t.withIdentity({ subject: 'user_1' })` for auth
paths, `t.finishInProgressScheduledFunctions()` for scheduled work. Always add the
negative authz case, not just the happy path.

### `playwright.config.ts`

Chromium only, `testDir: ./e2e`, `baseURL` from `PORT` (default 3000), trace on first
retry, screenshot on failure. `webServer` runs `bun run start` in CI (CI builds in an
earlier step) and `bun run build && bun run start` locally, with
`reuseExistingServer: !process.env.CI`. CI adds retries `2`, `workers: 1`, `forbidOnly`,
and the `github` reporter.

**E2E runs against a production build, not `next dev`.** A local `test:e2e` therefore
triggers a full build first — expect it to be slow on a cold cache.

### Starter tests

Two seeds ship with the scaffold and are meant to be replaced, not deleted:

- `convex/setup.test.ts` — proves the in-memory harness boots under the edge runtime.
- `e2e/smoke.spec.ts` — asserts `/` returns 200, renders an `h1`, and logs no console
  errors.

The smoke test's `h1` assertion means the placeholder `app/page.tsx` must render a real
heading. A bare `<div>Hello World</div>` fails the suite.

---

## 8. CI — `.github/workflows/quality.yml`

One job, fail-fast ordering (cheapest checks first):

1. `bun install --frozen-lockfile`
2. `bun run check` (Prettier + ESLint)
3. `bun run typecheck`
4. `bun run test:coverage`
5. `bun run build`
6. `bunx playwright install --with-deps chromium`
7. `bun run test:e2e`
8. Upload `coverage`, `playwright-report`, `test-results` on `!cancelled()`

Triggers on push/PR to `main` and `dev`; `permissions: contents: read`;
`concurrency` group with `cancel-in-progress`; `timeout-minutes: 20`;
Bun pinned to the same version as `packageManager`.

Placeholder env vars at the job level satisfy `lib/env.ts` during the build — CI never
touches a real deployment:

```yaml
env:
    CONVEX_DEPLOYMENT: dev:ci-placeholder
    NEXT_PUBLIC_CONVEX_URL: https://placeholder.convex.cloud
    NEXT_PUBLIC_CONVEX_SITE_URL: https://placeholder.convex.site
    NEXT_PUBLIC_SITE_URL: http://localhost:3000
```

This means **CI e2e tests cannot exercise auth** — the app boots against a URL that does
not resolve. Smoke tests of public pages pass; anything hitting Convex needs either a
preview deployment with a real `CONVEX_DEPLOY_KEY` or an in-test mock.

Never interpolate `${{ github.event.* }}` into a `run:` block — pass it through `env:`
and reference it as `"$VAR"`.

---

## 9. Production deployment

> Not yet exercised in this repo — this is the intended path, verify on first deploy.

The Next.js app and the Convex backend deploy as one unit: the hosting provider's build
command runs `convex deploy`, which pushes functions and then builds the frontend
against the resulting production URL.

**Host build command:**

```bash
bunx convex deploy --cmd 'bun run build'
```

**Host env vars:** `CONVEX_DEPLOY_KEY` (from the Convex dashboard, production scope) plus
the `NEXT_PUBLIC_*` keys pointing at the production URLs. `convex deploy --cmd` injects
`NEXT_PUBLIC_CONVEX_URL` itself; `NEXT_PUBLIC_CONVEX_SITE_URL` and `NEXT_PUBLIC_SITE_URL`
you set manually.

**Production Convex env vars** — set once per deployment, they do not carry over from dev:

```bash
bunx convex env set --prod BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
bunx convex env set --prod SITE_URL https://example.com
```

Use a **different** `BETTER_AUTH_SECRET` than dev, and point `SITE_URL` at the real
domain — it is the CSRF/origin anchor, so a stale localhost value rejects every
production sign-in. Re-register OAuth callback URLs against the production
`.convex.site` host.

Checklist per environment: deploy key → Convex env vars → `NEXT_PUBLIC_*` → OAuth
callbacks → `curl https://<prod>.convex.site/api/auth/ok`.

---

## 10. Repo layout

```
app/            routes — thin; api/auth/[...all] is the Better Auth proxy
features/       feature slices, the bulk of the code (see 02 §6)
components/     shared project components (kebab-case); ui/ is shadcn-owned
convex/         backend; betterAuth/ is a local component
data/           static seed / fixture data
docs/           NN_TITLE.md, numbered in reading order
e2e/            Playwright specs
lib/            env, utils, auth client/server
public/         static assets
.github/        CI
.vscode/        shared editor settings + extension recommendations
```

`docs/` is numbered: `00_SPEC.md`, `01_PROJECT_SCAFFOLD.md`, … Keep new docs in reading
order rather than alphabetical, and add a row to [`docs/README.md`](README.md) in the
same commit — that index is what `AGENTS.md` points agents at.

Branches: `dev` is the working branch, `main` is the release branch. CI runs on both.

---

## 11. Editor and agent tooling

`.vscode/extensions.json` recommends Prettier, ESLint, Tailwind CSS IntelliSense,
Playwright, and Vitest Explorer.

`.vscode/settings.json`: format on save with Prettier, `prettier.requireConfig`,
workspace TS SDK, LF endings, 4-space tabs, `tailwindCSS.experimental.classRegex` for
`cn()`/`cva()`, and generated/output dirs excluded from search. Code actions on save:

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.removeUnusedImports": "explicit"
}
```

`source.fixAll.eslint` alone will not strip unused imports — it only reports them.

### Agent context files

- **`AGENTS.md`** — the canonical instructions file. Note that `next dev` **rewrites** a
  block into it on every run (see `node_modules/next/dist/server/lib/generate-agent-files.js`);
  commit that block with your work instead of fighting the diff.
- **`CLAUDE.md`** — one line, `@AGENTS.md`, plus the Convex block. Keeps a single source
  of truth.
- **`convex/_generated/ai/guidelines.md`** — version-accurate Convex rules that override
  general model knowledge. Read before writing Convex code. Installed and refreshed by
  `bunx convex ai-files install`.
- **`.claude/skills/` + `.agents/skills/` + `skills-lock.json`** — the Convex agent skill
  pack, vendored from `get-convex/agent-skills` with hashes. Gitignored from Prettier;
  refresh with the same install command.
- **`.mcp.json`** — registers the `shadcn` MCP server so components can be searched and
  added without leaving the editor.

---

## 12. Conventions

- **Files:** kebab-case (`convex-client-provider.tsx`). Exception: the Convex
  `betterAuth/` component directory, whose name the component definition dictates.
- **`components/ui/`** is shadcn-owned. `components/` holds components shared across
  features; anything belonging to one feature lives in its slice under `features/`.
- **No `src/` directory** — Next.js does not scaffold one, so the tree stays flat at the
  repo root and `@/*` aliases from there.
- **Colocated tests:** `button.tsx` ↔ `button.test.tsx`.
- **Imports** are auto-grouped by Prettier: react → next → third-party → `@/` → relative.
- **Convex functions** always declare `args` validators; anything not meant for the
  public internet uses `internalQuery`/`internalMutation`/`internalAction`.
- **Server-only secrets** never reach a `NEXT_PUBLIC_*` name.
- Generated files (`convex/**/_generated`, `convex/betterAuth/schema.ts`) are committed
  but never hand-edited.

---

## 13. Relationship to the coding guidelines

[`02_CODING_GUIDELINES.md`](02_CODING_GUIDELINES.md) is the portable document — it is
copied between projects and is deliberately framework-agnostic. This document is the
Next.js + Convex instance of it. Most of it applies unchanged. The places where this
project does something different are listed here rather than left for someone to trip
over, because an undocumented deviation reads as an oversight and gets "fixed" back.

### Changes made to this project to match the guidelines

| Guideline                          | Action taken                                                           |
| ---------------------------------- | ---------------------------------------------------------------------- |
| §4 strictness flags non-negotiable | All five added to `tsconfig.json`; typecheck and build pass clean      |
| §3 standard script verbs           | `test` is the single run, `test:watch` the watcher (they were swapped) |
| §5/§6 feature slices               | `features/` registered in the Vitest include and coverage globs        |

### Decided deviations

Each was considered and settled deliberately. They are **not** open questions — do not
"fix" them back toward the generic document.

| Topic         | Guidelines say                             | This project does              | Why                                                                                                                                                      |
| ------------- | ------------------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint / format | **Biome** — "one binary, no plugin matrix" | Prettier + ESLint + 3 plugins  | Biome cannot replace `eslint-config-next`'s React/Next rules, and the Tailwind class sorter is Prettier-only. The plugin matrix buys real coverage here. |
| UI primitives | **Radix**, shadcn pattern                  | **Base UI** (`@base-ui/react`) | What the shadcn `base-nova` style ships. Identical ownership model — copied in, owned by us, no domain knowledge — different primitive library.          |

### Resolved by amending the guidelines

These were apparent conflicts that turned out to be the generic document being too
specific. `02` was updated, so every project inherits the change — nothing is pending here.

| Topic        | Resolution                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Path aliases | Use the framework's own default. For Next.js that is `@/*` from `create-next-app`. A second `#backend/*`-style alias stays optional. |
| Layout       | Follow the framework's root convention — no `src/` where Next does not use one. `features/` sits at the project root.                |
| Fonts        | The framework's font pipeline where it has one. `next/font` self-hosts at build time, so Fontsource adds nothing.                    |
| Env package  | `@t3-oss/env-nextjs` is the Next.js binding of `@t3-oss/env-core` — the same library.                                                |

### Where feature code goes

Nothing lives in `features/` yet. The first feature creates it, following §6 of the
guidelines:

```
features/<feature>/
  <feature>-screen.tsx     composition only
  <feature>-api.ts         typed Convex references, declared once
  <feature>-domain.ts      pure logic, no framework imports
  use-<thing>.ts           hooks
  <component>.tsx          one exported component per file
  <feature>.test.ts(x)     colocated
```

`app/` route files stay thin — validate params, declare metadata and an error boundary,
render one screen component from the slice. Business logic in a route file cannot be
tested without mounting a router.

The directory is already wired into `vitest.config.ts` (both the frontend `include` glob
and the coverage `include`), so slice tests are collected the moment they exist. Verified
by adding a throwaway test under `features/` and confirming the collected count rose.

### Not yet applied

Called for by the guidelines, absent here because nothing needs them yet. Add them with
the first feature that does, not speculatively (§2 of the guidelines: adding a dependency
is a decision):

- **Sentry and Pino** (§16) — no error tracking or structured logging.
- **TanStack Query / Form / Table, Recharts, Sonner, date-fns, Faker** (§2) — none
  installed. Convex's reactive client covers the server-state role for now.
- **`convex/lib/`** (§14) — the place for `ctx`-free pure logic. Create it with the first
  domain rule worth testing without a database.
- **Work-tracking identifiers** (§21) — `BUG-###`/`FEAT-###`, branch naming, and
  conventional commits are not yet in use in this repo's history.

---

## 14. New-project checklist

**Setup**

- [ ] `bunx convex dev --once` — deployment created, `.env.local` populated
- [ ] `NEXT_PUBLIC_CONVEX_SITE_URL` and `NEXT_PUBLIC_SITE_URL` added to `.env.local`
- [ ] `BETTER_AUTH_SECRET` + `SITE_URL` set on the deployment (`convex env list` to verify)
- [ ] `bun run auth:generate` then `bunx convex dev --once` (component installs)
- [ ] `bunx convex ai-files install` (Convex guidelines + skills)
- [ ] `bunx playwright install --with-deps chromium`

**Verify**

- [ ] `curl $NEXT_PUBLIC_CONVEX_SITE_URL/api/auth/ok` → `{"ok":true}`
- [ ] `curl localhost:3000/api/auth/ok` → `{"ok":true}` (Next proxy)
- [ ] A real `sign-up/email` POST returns a token; probe user deleted afterwards
- [ ] `bun run check && bun run typecheck && bun run test && bun run build`
- [ ] `bun run test:e2e` passes against the production build

**Personalize**

- [ ] `name` in `package.json`, `appName` in `convex/betterAuth/auth.ts`,
      `metadata` in `app/layout.tsx`
- [ ] `README.md` replaced (create-next-app's default is still there by default)
- [ ] Placeholder `app/page.tsx` renders an `h1` so the smoke test passes
- [ ] `.env.example` lists every key (values blank); CI `env:` block matches `lib/env.ts`
- [ ] Theme tokens in `app/globals.css` adjusted; something toggles `.dark` on `<html>`
