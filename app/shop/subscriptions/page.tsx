import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subscriptions | Flower Pune",
    description: "Enjoy fresh blooms delivered regularly to your doorstep.",
};

export default function SubscriptionsPage() {
    return (
        <main className="min-h-[70vh] bg-ivory pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6">Floral Subscriptions</h1>
            <p className="text-charcoal/70 max-w-xl text-lg font-light leading-relaxed">
                Regular deliveries of nature&apos;s finest poetry. Our subscription service is currently invite-only.
                Please check back soon for public availability.
            </p>
        </main>
    );
}
