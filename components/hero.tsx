import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blush/30 to-ivory py-20 lg:py-32">
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-8">

                {/* Left Content */}
                <div className="flex flex-col justify-center gap-8 lg:col-span-7">
                    <div className="flex animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-1.5 text-sm font-medium text-burgundy backdrop-blur-sm border border-burgundy/10">
                            <Sparkles className="h-4 w-4" />
                            <span>New Collection 2026</span>
                        </span>
                    </div>

                    <h1 className="max-w-2xl text-balance font-serif text-5xl font-medium leading-[1.1] text-charcoal sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                        Curating nature’s <span className="text-burgundy italic">finest poetry</span> for your moments.
                    </h1>

                    <p className="max-w-xl text-lg leading-relaxed text-charcoal/80 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        We craft bespoke floral narratives that transform spaces and elevate emotions. Experience the art of botanical luxury designed for the modern romantic.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                        <button className="btn-primary group h-14 px-8 text-base">
                            Explore Collection
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="btn-outline h-14 px-8 text-base bg-white/50 backdrop-blur-sm hover:bg-burgundy/5">
                            Book Consultation
                        </button>
                    </div>

                    <div className="flex items-center gap-8 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                                    <Image
                                        src={`https://images.unsplash.com/photo-${i === 1 ? '1534528741775-53994a69daeb' : i === 2 ? '1506794778202-cad84cf45f1d' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&w=64&q=80`}
                                        alt="User avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-charcoal/80">
                            Trusted by <span className="text-burgundy font-semibold">500+</span> brides this season
                        </p>
                    </div>
                </div>

                {/* Right Content (Image) */}
                <div className="relative lg:col-span-5 animate-in fade-in zoom-in-95 duration-1000 delay-200">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm lg:aspect-[3/4]">
                        <Image
                            src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=1280&auto=format&fit=crop"
                            alt="Luxury floral bouquet"
                            fill
                            priority
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Floating Badge */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="glass-panel rounded-sm p-4 backdrop-blur-md bg-white/70 border border-white/40 shadow-luxury">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-burgundy">Featured</p>
                                        <p className="font-serif text-lg text-charcoal">The Royal Blush</p>
                                    </div>
                                    <span className="text-sm font-medium text-charcoal">$185</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -right-12 -z-10 h-64 w-64 rounded-full bg-blush/40 blur-3xl opacity-60" />
                    <div className="absolute -bottom-12 -left-12 -z-10 h-64 w-64 rounded-full bg-champagne/30 blur-3xl opacity-60" />
                </div>

            </div>
        </section>
    );
}
