import Image from "next/image";
import { FadeIn } from "@/components/ui/motion";
import SectionTitle from "@/components/ui/section-title";
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
        <section className="relative py-16 md:py-24 overflow-hidden">
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

            <div className="relative z-10 container-page">
                <SectionTitle
                    subtitle="Why Flower Pune"
                    title="The Art of Botanical Luxury"
                    description="Where every petal tells a story and every arrangement is a masterpiece."
                    variant="dark"
                    className="mb-10 md:mb-16"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                    {brandValues.map((value, index) => (
                        <FadeIn key={value.title} delay={index * 0.15}>
                            <div className="text-center group">
                                <div className="mx-auto mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/10 border border-white/10 backdrop-blur-sm group-hover:bg-burgundy/30 transition-colors duration-500">
                                    <value.icon className="h-5 w-5 sm:h-7 sm:w-7 text-champagne" />
                                </div>
                                <h3 className="font-serif text-lg sm:text-xl text-white mb-1.5 sm:mb-2">{value.title}</h3>
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
