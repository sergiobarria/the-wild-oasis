import { Link, createFileRoute } from '@tanstack/react-router'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import { BENEFITS } from '@/content/benefits'
import { TESTIMONIALS } from '@/content/testimonials'

export const Route = createFileRoute('/(web)/')({
    component: App,
})

function App() {
    return (
        <>
            <section id="hero" className="relative h-[80dvh]">
                <img src="/bg.webp" alt="hero" className="absolute inset-0 size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/50"></div>

                <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform text-center">
                    <Typography variant="h1" size="5xl" className="font-medium text-white md:text-7xl">
                        Welcome To Paradise
                    </Typography>
                    <Typography
                        variant="body"
                        size="lg"
                        className="mx-auto max-w-xl text-base text-white/70 md:text-lg"
                    >
                        Escape to the heart of nature and unwind in our handcrafted luxury cabins — where tranquility,
                        comfort, and adventure meet.
                    </Typography>

                    <Button size="lg" asChild>
                        <Link to="/cabins">Explore our luxury cabins</Link>
                    </Button>
                </div>
            </section>

            <section id="benefits" className="mx-auto max-w-6xl space-y-16 px-6 py-16 text-center">
                <div>
                    <Typography variant="h2" size="3xl" className="text-primary font-bold">
                        Why Choose Us?
                    </Typography>
                    <Typography
                        variant="body"
                        size="lg"
                        className="mx-auto mt-4 max-w-xl text-base text-zinc-400 md:text-lg"
                    >
                        We offer more than just a stay. Discover a curated experience surrounded by nature, designed for
                        those who seek comfort, privacy, and beauty.
                    </Typography>
                </div>

                <div className="grid gap-8 text-left md:grid-cols-3">
                    {BENEFITS.map((benefit) => (
                        <div
                            key={benefit.title}
                            className="group border-border/50 from-background to-muted/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            {benefit.icon}
                            <Typography variant="h3" size="lg" className="text-xl font-semibold">
                                {benefit.title}
                            </Typography>
                            <Typography
                                variant="body"
                                size="lg"
                                className="mx-auto mt-4 max-w-xl text-base text-zinc-400 md:text-lg"
                            >
                                {benefit.description}
                            </Typography>
                        </div>
                    ))}
                </div>
            </section>

            <section id="testimonials" className="mx-auto max-w-6xl space-y-16 px-6 py-12">
                <div className="text-center">
                    <Typography variant="h2" size="3xl" className="text-primary font-bold">
                        What Our Guests Say
                    </Typography>
                    <Typography variant="body" size="lg" className="mx-auto mt-4 max-w-xl text-zinc-400 md:text-lg">
                        We&apos;re proud to share the stories of our happy guests who&apos;ve experienced the
                        tranquility and charm of our cabins.
                    </Typography>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {TESTIMONIALS.map((testimonial) => (
                        <div className="bg-base-100 flex flex-col items-center space-y-4 rounded-2xl p-6 text-center shadow-lg">
                            <img
                                src="/placeholder.jpg"
                                alt={testimonial.name}
                                className="ring-primary h-20 w-20 rounded-full object-cover shadow-sm ring-2"
                            />

                            <Typography variant="body" size="lg" className="text-zinc-4T0 text-sm italic">
                                {testimonial.message}
                            </Typography>

                            <Typography variant="h3" size="lg" className="text-primary text-sm font-semibold">
                                {testimonial.name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-base-200 px-6 py-12">
                <div className="mx-auto max-w-xl space-y-6 text-center">
                    <Typography variant="h2" size="3xl" className="text-primary font-bold">
                        Join Our Newsletter
                    </Typography>
                    <Typography
                        variant="body"
                        size="lg"
                        className="mx-auto mt-4 max-w-xl text-base text-zinc-400 md:text-lg"
                    >
                        Be the first to know about new cabins, exclusive offers, and travel inspiration.
                    </Typography>

                    {/* <NewsletterForm /> */}
                </div>
            </section>
        </>
    )
}
