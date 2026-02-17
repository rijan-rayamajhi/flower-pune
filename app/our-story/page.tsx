import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Story | Flower Pune",
    description: "The journey of Flower Pune.",
};

export default function OurStoryPage() {
    return (
        <main className="min-h-[70vh] bg-ivory pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6">Our Story</h1>
            <p className="text-charcoal/70 max-w-2xl text-lg font-light leading-relaxed">
                Founded with a passion for bringing nature&apos;s finest poetry to your doorstep.
                Flower Pune is more than just a florist; we are curators of emotion and beauty.
                Read our full journey here soon.
            </p>
        </main>
    );
}
