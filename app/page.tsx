import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />

      {/* Feature Grid - Adjusted padding */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto grid max-w-[1280px] w-full grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Bespoke Weddings",
              description: "Tailored floral narratives for your special day.",
              bg: "bg-blush/20"
            },
            {
              title: "Corporate Events",
              description: "Elevating brand experiences with botanical art.",
              bg: "bg-champagne/20"
            },
            {
              title: "Private Residences",
              description: "Weekly luxury arrangements for your home.",
              bg: "bg-sage/10"
            }
          ].map((item, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-sm ${item.bg} p-10 transition-all duration-300 hover:shadow-luxury hover:-translate-y-1`}>
              <h3 className="mb-3 font-serif text-2xl font-medium text-charcoal">{item.title}</h3>
              <p className="text-charcoal/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
