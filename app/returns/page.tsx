import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Returns & Exchanges | Flower Pune",
    description: "Our policy for returns and exchanges.",
};

export default function ReturnsPage() {
    return (
        <main className="min-h-[70vh] bg-ivory pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6">Returns & Exchanges</h1>
            <p className="text-charcoal/70 max-w-2xl text-lg font-light leading-relaxed">
                We take pride in the quality of our fresh blooms. If you are not completely satisfied with your order,
                please contact our support team within 24 hours of delivery. Detailed policy information will be updated here.
            </p>
        </main>
    );
}
