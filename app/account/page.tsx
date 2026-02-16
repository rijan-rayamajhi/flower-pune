import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountClient from "./account-client";

export default async function AccountPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, role")
        .eq("id", user.id)
        .single();

    return (
        <AccountClient
            user={{
                id: user.id,
                email: user.email ?? "",
                fullName: profile?.full_name ?? "",
                phone: profile?.phone ?? "",
                role: profile?.role ?? "customer",
                createdAt: user.created_at,
            }}
        />
    );
}
