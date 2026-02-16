import { Metadata } from "next";
import { getFlowers } from "@/lib/supabase/flowers";
import { createClient } from "@/lib/supabase/server";
import CustomizeForm from "@/components/customize-form";

export const metadata: Metadata = {
    title: "Customize Your Bouquet | Flower Pune",
    description: "Build your dream bouquet by selecting your favorite blooms. We'll arrange them into a masterpiece just for you.",
};

async function getServiceablePincodesServer(): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "serviceable_pincodes")
        .single();

    if (error || !data || !data.value) return [];
    return data.value.split(",").map((p: string) => p.trim()).filter(Boolean);
}

export default async function CustomizePage() {
    const [flowers, pincodes] = await Promise.all([
        getFlowers(),
        getServiceablePincodesServer(),
    ]);

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <div className="container-page py-8 sm:py-12">

                <div className="mb-8 sm:mb-12 text-center">
                    <div className="inline-block rounded-full bg-burgundy/5 px-4 py-1.5 text-sm font-medium text-burgundy mb-4">
                        Create Your Own
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-charcoal md:text-5xl">
                        Build Your Dream Bouquet
                    </h1>
                    <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-charcoal/60">
                        Select your favorite blooms and we&apos;ll arrange them into a masterpiece just for you.
                    </p>
                </div>

                {flowers.length > 0 ? (
                    <CustomizeForm flowers={flowers} serviceablePincodes={pincodes} />
                ) : (
                    <p className="text-center text-charcoal/50 py-12 font-serif text-lg">
                        Flowers coming soon.
                    </p>
                )}

            </div>
        </div>
    );
}
