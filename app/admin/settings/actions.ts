"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSiteSettings(): Promise<Record<string, string>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

    if (error) {
        console.error("[getSiteSettings] Error:", error);
        return {};
    }

    const settings: Record<string, string> = {};
    for (const row of data || []) {
        settings[row.key] = row.value;
    }
    return settings;
}

export async function updateSiteSetting(
    key: string,
    value: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    // Verify the user is an admin
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "You must be logged in." };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { success: false, error: "Only admins can update settings." };
    }

    const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (error) {
        console.error("[updateSiteSetting] Error:", error);
        return { success: false, error: "Failed to save setting." };
    }

    return { success: true };
}
