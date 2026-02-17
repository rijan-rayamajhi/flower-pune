import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gift Cards | Flower Pune",
    description: "The perfect gift for any occasion.",
};

export default function GiftCardsPage() {
    return (
        <main className="min-h-[70vh] bg-ivory pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6">Gift Cards</h1>
            <p className="text-charcoal/70 max-w-xl text-lg font-light leading-relaxed">
                Give the gift of choice with our digital gift cards.
                This feature is launching soon.
            </p>
        </main>
    );
}
