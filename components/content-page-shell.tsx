/** Shared prose container for the site's static content pages (About, Contact, Privacy,
 *  Terms) so each doesn't hand-roll the same heading + width wrapper. */
export function ContentPageShell({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className='mx-auto w-full max-w-2xl space-y-8 px-6 py-12 lg:px-8'>
            <div className='space-y-2'>
                <h1 className='font-heading text-3xl font-medium'>{title}</h1>
                {description && <p className='text-muted-foreground'>{description}</p>}
            </div>
            {children}
        </div>
    );
}
