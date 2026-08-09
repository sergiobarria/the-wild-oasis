/**
 * `role` is stored as a plain `string` in the generated Convex schema, not a
 * literal union -- the pinned `@better-auth/cli@1.4.21` generates a broken
 * validator for `type: ['guest', 'admin']` (see the comment in
 * `convex/betterAuth/auth.ts`). `isAdmin` is the single place this app
 * narrows it, so no call site (server or client) re-derives its own
 * comparison. Kept dependency-free (no `next/headers`, no `next/navigation`)
 * so both server code (`lib/require-auth.ts`) and client components
 * (`features/auth/sign-in-screen.tsx`) can import it.
 */
export type UserRole = 'guest' | 'admin';

export function isAdmin(role: string | null | undefined): role is 'admin' {
    return role === 'admin';
}
