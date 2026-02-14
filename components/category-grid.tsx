import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
    {
        title: "Bridal Bouquets",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        href: "/shop/bridal",
    },
    {
        title: "Centerpieces",
        image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
        href: "/shop/centerpieces",
    },
    {
        title: "Luxury Gifts",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
        href: "/shop/gifts",
    },
    {
        title: "Sympathy",
        image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
        href: "/shop/sympathy",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative" id="shop">
            <div className="mx-auto max-w-[1280px]">
                {/* Gold Decorative Divider */}
                <div className="flex items-center justify-center mb-16">
                    <div className="h-px w-12 bg-champagne/60" />
                    <div className="mx-4 h-1.5 w-1.5 rounded-full bg-champagne" />
                    <div className="h-px w-12 bg-champagne/60" />
                </div>

                {/* Section Header */}
                <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-burgundy/70 mb-3">
                        Curated Collections
                    </p>
                    <h2 className="mb-4 font-serif text-4xl font-medium text-charcoal sm:text-5xl">
                        Shop by Category
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-charcoal/60 italic font-serif">
                        Explore our hand-selected arrangements, designed to bring elegance to every occasion.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category, index) => (
                        <Link
                            key={category.title}
                            href={category.href}
                            className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-shadow duration-500 animate-in fade-in zoom-in-95 duration-700"
                            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
                        >
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-100" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="h-px w-8 bg-champagne/60 mb-3 transition-all duration-500 group-hover:w-12 group-hover:bg-champagne" />
                                        <h3 className="font-serif text-2xl font-medium text-white">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100">
                                        <ArrowUpRight className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
