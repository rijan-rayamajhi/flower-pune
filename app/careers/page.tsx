import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Careers | Flower Pune",
    description: "Join our team of floral artists and enthusiasts.",
};

export default function CareersPage() {
    return (
        <main className="min-h-[70vh] bg-ivory pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6">Careers at Flower Pune</h1>
            <p className="text-charcoal/70 max-w-xl text-lg font-light leading-relaxed">
                We are always looking for passionate individuals to join our growing team.
                Currently, there are no open positions, but feel free to check back later.
            </p>
        </main>
    );
}
