import { createFileRoute } from '@tanstack/react-router'

import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

import { Typography } from '@/components/shared/typography'
import { APP_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '@/config/constants'
import { ContactForm } from '@/features/contact/components/contact-form'

export const Route = createFileRoute('/(web)/contact')({
    head: () => ({
        meta: [{ title: `Contact | ${APP_NAME}` }],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <section id="contact" className="container mx-auto max-w-5xl px-8 py-12">
            <Typography variant="h1" size="4xl" className="text-primary">
                Get in touch
            </Typography>

            <div className="space-y-8">
                <Typography variant="body" size="lg">
                    We'd love to hear from you! Whether you have questions, want to book a cabin, or just want to say
                    hello, our team is here to help. Fill out the form below and we'll get back to you as soon as
                    possible.
                </Typography>
            </div>

            <ContactForm />

            <div className="mx-auto mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="group border-border/50 from-background to-muted/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex flex-col items-center text-center">
                        <div className="bg-primary/10 ring-primary/5 group-hover:bg-primary/15 mb-5 rounded-full p-4 ring-4 transition-all duration-300 group-hover:scale-110">
                            <MapPinIcon className="text-primary size-7" />
                        </div>
                        <Typography variant="h3" size="lg" className="mb-3 font-semibold">
                            Address
                        </Typography>
                        <Typography variant="body" size="sm" className="text-muted-foreground mb-0 leading-relaxed">
                            The Wild Oasis, Via delle Dolomiti 25
                            <br />
                            39030 Cortina d'Ampezzo (BZ), Italy
                        </Typography>
                    </div>
                </div>

                <div className="group border-border/50 from-background to-muted/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex flex-col items-center text-center">
                        <div className="bg-primary/10 ring-primary/5 group-hover:bg-primary/15 mb-5 rounded-full p-4 ring-4 transition-all duration-300 group-hover:scale-110">
                            <MailIcon className="text-primary size-7" />
                        </div>
                        <Typography variant="h3" size="lg" className="mb-3 font-semibold">
                            Email
                        </Typography>
                        <Typography
                            variant="body"
                            size="sm"
                            className="text-muted-foreground mb-0 leading-relaxed break-all"
                        >
                            {CONTACT_EMAIL}
                        </Typography>
                    </div>
                </div>

                <div className="group border-border/50 from-background to-muted/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex flex-col items-center text-center">
                        <div className="bg-primary/10 ring-primary/5 group-hover:bg-primary/15 mb-5 rounded-full p-4 ring-4 transition-all duration-300 group-hover:scale-110">
                            <PhoneIcon className="text-primary size-7" />
                        </div>
                        <Typography variant="h3" size="lg" className="mb-3 font-semibold">
                            Phone
                        </Typography>
                        <Typography variant="body" size="sm" className="text-muted-foreground mb-0 leading-relaxed">
                            {CONTACT_PHONE}
                        </Typography>
                    </div>
                </div>
            </div>
        </section>
    )
}
