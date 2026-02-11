import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
    {
        title: "Bridal Bouquets",
        image: "https://images.unsplash.com/photo-1673001161631-198351b9b933?q=80&w=800&auto=format&fit=crop",
        href: "/shop/bridal",
    },
    {
        title: "Centerpieces",
        image: "https://images.unsplash.com/photo-1769812343462-84c46af1e156?q=80&w=800&auto=format&fit=crop",
        href: "/shop/centerpieces",
    },
    {
        title: "Luxury Gifts",
        image: "https://images.unsplash.com/photo-1653380399372-4cfa7cfcfab9?q=80&w=800&auto=format&fit=crop",
        href: "/shop/gifts",
    },
    {
        title: "Sympathy",
        image: "https://images.unsplash.com/photo-1547098842-dcdd773e3390?q=80&w=800&auto=format&fit=crop",
        href: "/shop/sympathy",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" id="shop">
            <div className="mx-auto max-w-[1280px]">
                {/* Section Header */}
                <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="mb-4 font-serif text-4xl font-medium text-charcoal sm:text-5xl">
                        Shop by Category
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-charcoal/70">
                        Explore our curated collections, designed to bring elegance to every occasion.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category, index) => (
                        <Link
                            key={category.title}
                            href={category.href}
                            className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 animate-in fade-in zoom-in-95 duration-700"
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 opacity-90 group-hover:opacity-100" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                                <div className="flex items-end justify-between">
                                    <h3 className="font-serif text-2xl font-medium text-white">
                                        {category.title}
                                    </h3>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
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
