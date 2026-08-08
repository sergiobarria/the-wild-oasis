# The Wild Oasis

Cabin booking app built on Next.js (App Router), Convex, and Better Auth.

## Quick start

Requires [Bun](https://bun.sh) `1.3.14` and a [Convex](https://convex.dev) account.

```bash
bun install

# Creates the Convex deployment and writes CONVEX_DEPLOYMENT +
# NEXT_PUBLIC_CONVEX_URL into .env.local. Keep this running while developing.
bunx convex dev
```

Then complete `.env.local` (see `.env.example`) and set the auth secrets on the
deployment — they live in Convex, not in the env file, because the Better Auth instance
runs inside Convex:

```bash
bunx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
bunx convex env set SITE_URL http://localhost:3000
bun run auth:generate && bunx convex dev --once
```

In a second terminal:

```bash
bun run dev          # http://localhost:3000
```

Full setup, including the parts that are easy to get wrong, is in
[`docs/01_PROJECT_SCAFFOLD.md`](docs/01_PROJECT_SCAFFOLD.md).

## Scripts

| Command                 | What it does                                         |
| ----------------------- | ---------------------------------------------------- |
| `bun run dev`           | Next dev server                                      |
| `bun run build`         | Production build                                     |
| `bun run start`         | Serve the production build                           |
| `bun run check`         | Prettier check + ESLint                              |
| `bun run format`        | Write Prettier formatting                            |
| `bun run typecheck`     | `tsc --noEmit`                                       |
| `bun run test`          | Vitest, single run (`convex` + `frontend` projects)  |
| `bun run test:watch`    | Vitest, watch mode                                   |
| `bun run test:coverage` | Vitest with v8 coverage                              |
| `bun run test:e2e`      | Playwright — builds first, runs against `next start` |
| `bun run auth:generate` | Regenerate `convex/betterAuth/schema.ts`             |

CI runs check → typecheck → tests → build → e2e on every push and PR to `main` and `dev`.

## Documentation

[`docs/README.md`](docs/README.md) indexes everything — spec, scaffold, guidelines, and
decision records.

Contributors using AI agents: [`AGENTS.md`](AGENTS.md) is the entry point.
