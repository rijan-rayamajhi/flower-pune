import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sustainability | Flower Pune",
    description: "Our commitment to the planet and ethical sourcing.",
};

export default function SustainabilityPage() {
    return (
        <main className="min-h-[70vh] bg-ivory pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6">Our Commitment to Sustainability</h1>
            <p className="text-charcoal/70 max-w-2xl text-lg font-light leading-relaxed">
                We believe in beauty that doesn&apos;t cost the earth. From locally sourced blooms to eco-friendly packaging,
                learn how we&apos;re minimizing our footprint while maximizing joy. Full report coming soon.
            </p>
        </main>
    );
}
