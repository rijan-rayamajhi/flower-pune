import { createClient } from "@/lib/supabase/client";

/**
 * Fetch the UPI ID from site_settings (client-side).
 * Falls back to empty string if not set.
 */
export async function getUpiId(): Promise<string> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "upi_id")
        .single();

    if (error || !data) {
        console.error("[getUpiId] Error:", error);
        return "";
    }

    return data.value || "";
}

/**
 * Fetch the serviceable pincodes from site_settings (client-side).
 * Returns an array of 6-digit pincode strings.
 */
export async function getServiceablePincodes(): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "serviceable_pincodes")
        .single();

    if (error || !data || !data.value) {
        return [];
    }

    return data.value.split(",").map((p: string) => p.trim()).filter(Boolean);
}
