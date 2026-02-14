import Hero from "@/components/hero";
import CategoryGrid from "@/components/category-grid";
import ProductCard from "@/components/product-card";
import { FadeIn } from "@/components/ui/motion";
import OccasionsSection from "@/components/occasions-section";
import CustomizePromo from "@/components/customize-promo";
import TestimonialsMarquee from "@/components/testimonials-marquee";
import BrandStory from "@/components/brand-story";
import NewsletterCTA from "@/components/newsletter-cta";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredProducts = [
    {
      id: "1",
      title: "The Royal Blush",
      price: 185,
      image: "https://images.unsplash.com/photo-1712258091779-48b46ad77437?q=80&w=800&auto=format&fit=crop",
      category: "Bouquets"
    },
    {
      id: "2",
      title: "Velvet Touch",
      price: 145,
      image: "https://images.unsplash.com/photo-1547848803-2937f52e76f5?q=80&w=800&auto=format&fit=crop",
      category: "Signature Boxes"
    },
    {
      id: "3",
      title: "Opulent Orchid",
      price: 120,
      image: "https://images.unsplash.com/photo-1687299443525-96f91e129053?q=80&w=800&auto=format&fit=crop",
      category: "Plants"
    },
    {
      id: "4",
      title: "Summer Breeze",
      price: 95,
      image: "https://plus.unsplash.com/premium_photo-1661308363998-56016ff5843a?q=80&w=800&auto=format&fit=crop",
      category: "Seasonal"
    }
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <CategoryGrid />
      <OccasionsSection />

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blush/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-[1280px] relative">
          {/* Gold Divider */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-px w-12 bg-champagne/60" />
            <div className="mx-4 h-1.5 w-1.5 rounded-full bg-champagne" />
            <div className="h-px w-12 bg-champagne/60" />
          </div>

          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-burgundy/70 mb-3">
                  Handpicked for You
                </p>
                <h2 className="font-serif text-3xl md:text-5xl text-charcoal">
                  Our Featured Collection
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-sm font-medium text-burgundy hover:text-burgundy/80 transition-colors border-b border-burgundy/30 pb-1"
              >
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-10 sm:hidden">
            <Link
              href="/shop"
              className="btn-outline w-full py-3.5"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <CustomizePromo />
      <TestimonialsMarquee />
      <BrandStory />
      <NewsletterCTA />
    </main>
  );
}
