import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { getOccasions } from "@/lib/supabase/occasions";

export const metadata: Metadata = {
    title: "Occasions | Flower Pune",
    description: "Find the perfect blooms for every special moment in life.",
};

export default async function OccasionsPage() {
    const occasions = await getOccasions();

    return (
        <div className="min-h-screen bg-ivory">
            {/* Hero Section */}
            <section className="relative flex h-[40vh] sm:h-[50vh] min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center overflow-hidden bg-charcoal text-center text-white">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2000&auto=format&fit=crop"
                        alt="Occasions Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 px-4">
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight animate-fade-in-up">
                        Celebrate Every Moment
                    </h1>
                    <p className="mt-3 sm:mt-4 max-w-lg mx-auto font-sans text-base sm:text-lg font-light leading-relaxed tracking-wide text-white/90 md:text-xl animate-fade-in-up delay-100">
                        From birthdays to weddings, find the perfect expression of your sentiments.
                    </p>
                </div>
            </section>

            {/* Occasions Grid */}
            <section className="container-page py-16 sm:py-24">
                {occasions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12">
                        {occasions.map((occasion) => (
                            <Link
                                href={`/occasion/${occasion.slug}`}
                                key={occasion.id}
                                className="group relative block overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-luxury transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="relative aspect-[16/9] w-full overflow-hidden">
                                    <Image
                                        src={occasion.hero_image || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=2000&auto=format&fit=crop"}
                                        alt={occasion.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 w-full">
                                        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium text-white group-hover:text-blush transition-colors">
                                            {occasion.name}
                                        </h2>
                                        <p className="mt-2 line-clamp-2 text-white/90 text-sm font-light leading-relaxed tracking-wide">
                                            {occasion.description}
                                        </p>
                                        <div className="mt-3 sm:mt-6 flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                                            Explore Collection
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="font-serif text-xl text-charcoal/60">
                            Occasions are being curated. Check back soon!
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
