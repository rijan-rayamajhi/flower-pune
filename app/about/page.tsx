import StaticLayout from "@/components/static-layout";

export default function AboutPage() {
    return (
        <StaticLayout
            title="Our Story"
            subtitle="Cultivating beauty, one bloom at a time."
            maxWidth="3xl"
        >
            <div className="space-y-12">
                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Rooted in Passion</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Luxe Floral Design was born from a deep appreciation for the language of flowers.
                        What started as a small garden studio in Pune has blossomed into a full-service floral design atelier,
                        creating bespoke arrangements for life&apos;s most memorable moments. We believe that flowers are more than just decorations;
                        they are living art that evokes emotion and transforms spaces.
                    </p>
                </section>

                <section>
                    <div className="relative aspect-[16/9] w-full bg-stone-200 overflow-hidden mb-8">
                        <div className="absolute inset-0 flex items-center justify-center text-charcoal/30 font-serif italic">
                            [Atelier Image Placeholder]
                        </div>
                    </div>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Our Philosophy</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        We source our blooms from sustainable local growers and premium international suppliers to ensure
                        unrivaled freshness and variety. Our aesthetic is guided by nature&apos;s rhythm—wild, organic, and effortlessly elegant.
                        Each arrangement is thoughtfully composed, balancing texture, color, and movement to tell a unique story.
                    </p>
                    <p className="text-charcoal/80 font-light leading-loose mt-4">
                        Whether it&apos;s a grand wedding installation or a simple hand-tied bouquet, our commitment to craftsmanship
                        and attention to detail remains unwavering. We take pride in delivering not just flowers, but an
                        experience of timeless beauty.
                    </p>
                </section>

                <section className="bg-white p-8 border border-stone-100">
                    <h3 className="font-serif text-xl text-charcoal mb-2 text-center">Meet the Designer</h3>
                    <p className="text-charcoal/70 font-light leading-relaxed text-center italic">
                        &quot;Flowers whisper what words cannot say.&quot;
                    </p>
                </section>
            </div>
        </StaticLayout>
    );
}
