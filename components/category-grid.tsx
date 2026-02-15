import Link from "next/link";
import { Baby, CalendarHeart, Cake, Flower2, Gem } from "lucide-react";

const categories = [
    {
        title: "New Baby",
        icon: Baby,
        href: "/shop/new-baby",
        delay: 0,
    },
    {
        title: "Anniversaries",
        icon: CalendarHeart,
        href: "/shop/anniversary",
        delay: 100,
    },
    {
        title: "Birthdays",
        icon: Cake,
        href: "/shop/birthday",
        delay: 200,
    },
    {
        title: "Roses",
        icon: Flower2,
        href: "/shop/roses",
        delay: 300,
    },
    {
        title: "Weddings",
        icon: Gem,
        href: "/shop/wedding",
        delay: 400,
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-16 md:py-24 bg-white relative" id="shop">
            <div className="container-page">
                {/* Gold Decorative Divider */}
                <div className="flex items-center justify-center mb-10 md:mb-12">
                    <div className="h-px w-12 bg-champagne/60" />
                    <div className="mx-4 h-1.5 w-1.5 rounded-full bg-champagne" />
                    <div className="h-px w-12 bg-champagne/60" />
                </div>

                {/* Section Header */}
                <div className="mb-12 md:mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="mb-4 font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-burgundy/90 uppercase tracking-wide">
                        Flower Categories
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-charcoal/70 leading-relaxed px-4">
                        Explore our Flower Categories to find the perfect blooms for any occasion.<br className="hidden sm:block" />
                        From vibrant roses to delicate lilies, our selection offers something for every taste and celebration.
                    </p>
                </div>

                {/* Circular Icons Grid */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
                    {categories.map((category) => (
                        <Link
                            key={category.title}
                            href={category.href}
                            className="group flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
                            style={{ animationDelay: `${category.delay}ms` }}
                        >
                            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-burgundy/30 bg-burgundy/5 text-burgundy transition-all duration-300 group-hover:bg-burgundy group-hover:text-white group-hover:scale-110 group-hover:shadow-lg">
                                <category.icon strokeWidth={1.5} className="h-10 w-10 sm:h-12 sm:w-12 transition-transform duration-300 group-hover:scale-90" />
                            </div>
                            <span className="font-medium text-charcoal text-base sm:text-lg tracking-wide transition-colors group-hover:text-burgundy">
                                {category.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
