/**
 * Shared with `components/ui/sidebar.tsx` (a client-boundary file) so server
 * components can read the same cookie name -- a value imported directly from
 * a 'use client' module resolves to undefined on the server.
 */
export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
