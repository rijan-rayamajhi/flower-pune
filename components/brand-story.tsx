import Image from "next/image";
import { FadeIn } from "@/components/ui/motion";
import { Leaf, Truck, Sparkles } from "lucide-react";

const brandValues = [
    {
        icon: Leaf,
        title: "Hand-Crafted",
        description: "Every arrangement is meticulously designed by our master florists.",
    },
    {
        icon: Truck,
        title: "Same-Day Delivery",
        description: "Order before 2 PM for guaranteed same-day delivery across Pune.",
    },
    {
        icon: Sparkles,
        title: "100% Fresh",
        description: "We source the finest blooms daily from trusted local growers.",
    },
];

export default function BrandStory() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=2000&auto=format&fit=crop"
                    alt="Beautiful garden of fresh flowers"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-charcoal/85 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        {/* Gold Divider */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px w-12 bg-champagne/40" />
                            <div className="mx-4 h-1.5 w-1.5 rounded-full bg-champagne/60" />
                            <div className="h-px w-12 bg-champagne/40" />
                        </div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne/80 mb-3">
                            Why Luxe Floral
                        </p>
                        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                            The Art of Botanical Luxury
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto font-serif italic text-lg">
                            Where every petal tells a story and every arrangement is a masterpiece.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {brandValues.map((value, index) => (
                        <FadeIn key={value.title} delay={index * 0.15}>
                            <div className="text-center group">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/10 backdrop-blur-sm group-hover:bg-burgundy/30 transition-colors duration-500">
                                    <value.icon className="h-7 w-7 text-champagne" />
                                </div>
                                <h3 className="font-serif text-xl text-white mb-2">{value.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                                    {value.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
