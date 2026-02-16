import { createAdminClient } from "@/lib/supabase/admin";

let synced = false;

/**
 * Parses ADMIN_EMAILS from env and upserts them into the admin_emails table.
 * Safe to call multiple times — only runs once per server lifecycle.
 * Uses the service-role client to bypass RLS.
 */
export async function syncAdminEmails() {
    if (synced) return;
    synced = true;

    const raw = process.env.ADMIN_EMAILS;
    if (!raw) {
        console.log("[Admin Sync] No ADMIN_EMAILS env var found. Skipping.");
        return;
    }

    const emails = raw
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    if (emails.length === 0) {
        console.log("[Admin Sync] ADMIN_EMAILS is empty. Skipping.");
        return;
    }

    try {
        const supabase = createAdminClient();

        // Insert emails, ignore duplicates
        const { error } = await supabase
            .from("admin_emails")
            .upsert(
                emails.map((email) => ({ email })),
                { onConflict: "email", ignoreDuplicates: true }
            );

        if (error) {
            console.error("[Admin Sync] Error syncing admin emails:", error.message);
        } else {
            console.log(`[Admin Sync] Synced ${emails.length} admin email(s):`, emails);
        }
    } catch (err) {
        // Fail silently — don't break the app if service role key is missing
        console.error("[Admin Sync] Failed:", err instanceof Error ? err.message : err);
    }
}
