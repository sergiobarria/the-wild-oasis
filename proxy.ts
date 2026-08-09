import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js gives Server Components no built-in way to read the current
 * request's pathname (that's `usePathname`, client-only). Route guards
 * (`lib/require-auth.ts`) need it to build a `redirectTo` back to the page
 * that got bounced -- this proxy's only job is forwarding it via a header.
 * No auth/redirect logic here: that stays server-side in the guards
 * themselves, per Next's own guidance that proxy isn't a full auth solution.
 */
export function proxy(request: NextRequest) {
    const headers = new Headers(request.headers);
    headers.set('x-pathname', request.nextUrl.pathname + request.nextUrl.search);

    return NextResponse.next({ request: { headers } });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (route handlers, including Better Auth's)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
