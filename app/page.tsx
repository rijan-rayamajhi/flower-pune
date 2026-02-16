import Hero from "@/components/hero";
import CategoryGrid from "@/components/category-grid";
import ProductCard from "@/components/product-card";
import SectionTitle from "@/components/ui/section-title";
import OccasionsSection from "@/components/occasions-section";
import CustomizePromo from "@/components/customize-promo";
import TestimonialsMarquee from "@/components/testimonials-marquee";
import BrandStory from "@/components/brand-story";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/supabase/products";
import { getOccasions } from "@/lib/supabase/occasions";
import { toProductCardData } from "@/lib/types/product";

export default async function Home() {
  const [products, occasions] = await Promise.all([
    getFeaturedProducts(4),
    getOccasions(),
  ]);

  const featuredProducts = products.map(toProductCardData);

  // Map occasions for the section component
  const occasionsData = occasions.slice(0, 4).map((o) => ({
    key: o.slug,
    title: o.name,
    subtitle: o.subtitle || "",
    heroImage: o.hero_image || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=2000&auto=format&fit=crop",
    href: `/occasion/${o.slug}`,
  }));

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <CategoryGrid />
      <OccasionsSection occasions={occasionsData} />

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blush/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-page relative">
          <SectionTitle
            subtitle="Handpicked for You"
            title="Our Featured Collection"
            className="mb-10 md:mb-16"
          />

          <div className="flex justify-center mb-6">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm font-medium text-burgundy hover:text-burgundy/80 transition-colors border-b border-burgundy/30 pb-1"
            >
              View All Arrangements
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 xl:gap-x-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal/50 py-12 font-serif text-lg">
              Featured products coming soon.
            </p>
          )}

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
    </main>
  );
}
