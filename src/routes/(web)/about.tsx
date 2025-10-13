import { Link, createFileRoute } from '@tanstack/react-router'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/config/constants'

export const Route = createFileRoute('/(web)/about')({
    head: () => ({
        meta: [{ title: `About | ${APP_NAME}` }],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <section className="container mx-auto max-w-7xl px-8 py-12">
            <div className="grid grid-cols-5 items-center gap-x-24 gap-y-32 text-lg">
                <div className="col-span-3">
                    <Typography variant="h1" size="4xl" className="text-primary">
                        Welcome to The Wild Oasis
                    </Typography>

                    <div className="space-y-8">
                        <Typography variant="body" size="lg">
                            Where nature's beauty and comfortable living blend seamlessly. Hidden away in the heart of
                            the Italian Dolomites, this is your paradise away from home. But it's not just about the
                            luxury cabins. It's about the experience of reconnecting with nature and enjoying simple
                            pleasures with family.
                        </Typography>
                        <Typography variant="body" size="lg">
                            Our 8 luxury cabins provide a cozy base, but the real freedom and peace you'll find in the
                            surrounding mountains. Wander through lush forests, breathe in the fresh air, and watch the
                            stars twinkle above from the warmth of a campfire or your hot oub.
                        </Typography>
                        <Typography variant="body" size="lg">
                            This is where memorable moments are made, surrounded by nature's splendor. It's a place to
                            slow down, relax, and feel the joy of being together in a beautiful setting.
                        </Typography>
                    </div>
                </div>

                <div className="col-span-2">
                    <img src="/about-1.webp" alt="Family sitting around a fire pit in front of cabin" />
                </div>

                <div className="col-span-2">
                    <img src="/about-2.webp" alt="Family that manages The Wild Oasis" />
                </div>

                <div className="col-span-3">
                    <Typography variant="h1" size="4xl" className="text-primary">
                        Managed by our family since 1962
                    </Typography>

                    <div className="space-y-8">
                        <Typography variant="body" size="lg">
                            Since 1962, The Wild Oasis has been a cherished family-run retreat. Started by our
                            grandparents, this haven has been nurtured with love and care, passing down through our
                            family as a testament to our dedication to creating a warm, welcoming envirTnment.
                        </Typography>
                        <Typography variant="body" size="lg">
                            Over the years, we've maintained the essence of The Wild Oasis, blending the timeless beauty
                            of the mountains with the personal touch only a family business can offer. Here, you're not
                            just a guest; you're part of our extended family. So join us at The Wild Oasis soon, where
                            tradition meets tranquility, and every visit is like coming home.
                        </Typography>

                        <div>
                            <Button asChild>
                                <Link
                                    to="/cabins"
                                    className="bg-accent text-primary-foreground hover:bg-accent-content mt-4 inline-block rounded-lg px-4 py-3 text-lg font-semibold transition-all"
                                >
                                    Explore our luxury cabins
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
