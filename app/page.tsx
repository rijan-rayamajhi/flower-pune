import Hero from "@/components/hero";
import CategoryGrid from "@/components/category-grid";
import ProductCard from "@/components/product-card";

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

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl font-medium text-charcoal sm:text-4xl">Featured Arrivals</h2>
              <p className="mt-2 text-charcoal/60">Season's most coveted arrangements.</p>
            </div>
            <button className="hidden sm:block text-sm font-medium text-burgundy border-b border-burgundy hover:text-burgundy/80 transition-colors">
              View All Products
            </button>
          </div>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-10 sm:hidden">
            <button className="w-full text-sm font-medium text-burgundy border border-burgundy rounded-sm py-3 hover:bg-burgundy/5 transition-colors">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
