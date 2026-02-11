import { ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-20 text-center">
      {/* Hero Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 flex max-w-3xl flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sage/10 px-4 py-1.5 text-sm font-medium text-sage">
          <Star className="h-4 w-4 fill-sage" />
          <span>Award Winning Floral Design</span>
        </div>

        <h1 className="text-balance text-5xl font-semibold leading-tight tracking-tight text-charcoal sm:text-7xl">
          Curating nature’s finest <span className="text-burgundy italic">masterpieces.</span>
        </h1>

        <p className="max-w-xl text-lg text-charcoal/80">
          Experience the art of botanical luxury. We craft bespoke arrangements that transform spaces and elevate moments into memories.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="btn-primary group">
            View Collection
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="btn-outline">
            Book Consultation
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mt-32 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
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
          <div key={i} className={`group relative overflow-hidden rounded-lg ${item.bg} p-8 transition-all hover:shadow-luxury`}>
            <h3 className="mb-2 text-2xl font-medium text-charcoal">{item.title}</h3>
            <p className="text-charcoal/70">{item.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
