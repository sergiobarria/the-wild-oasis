'use client';

/**
 * Root-layout error boundary (app/api-reference/file-conventions/error#global-error)
 * -- only fires when the root layout itself throws, which app/error.tsx can't
 * catch. Next.js explicitly does not carry global styles, fonts, or the
 * `dark` theme class into this document (it replaces the root layout
 * entirely), so this stays inline-styled rather than depending on Tailwind
 * output that may not be present.
 */
export default function GlobalError({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    return (
        <html lang='en'>
            <body
                style={{
                    margin: 0,
                    display: 'flex',
                    minHeight: '100svh',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'oklch(0.145 0 0)',
                    color: 'oklch(0.985 0 0)',
                    fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
                }}
            >
                <h2 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0 }}>
                    Something went wrong
                </h2>
                <p style={{ maxWidth: '28rem', opacity: 0.8, margin: 0 }}>
                    The application hit an unexpected error and couldn&apos;t recover on its own.
                </p>
                {error.digest && (
                    <p style={{ fontSize: '0.875rem', opacity: 0.6, margin: 0 }}>
                        Reference: {error.digest}
                    </p>
                )}
                <button
                    type='button'
                    onClick={() => retry()}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: 'oklch(0.7394 0.112 83.18)',
                        color: 'oklch(0.145 0 0)',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
