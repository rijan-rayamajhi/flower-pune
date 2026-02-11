import Hero from "@/components/hero";
import CategoryGrid from "@/components/category-grid";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <CategoryGrid />
    </main>
  );
}
