import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Journal | Flower Pune",
    description: "Floral inspiration, care tips, and stories from our garden.",
};

export default function JournalPage() {
    return (
        <main className="min-h-[70vh] bg-ivory pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6">The Floral Journal</h1>
            <p className="text-charcoal/70 max-w-xl text-lg font-light leading-relaxed">
                Explore our collection of stories, floral care guides, and design inspiration.
                First articles will be published shortly.
            </p>
        </main>
    );
}
