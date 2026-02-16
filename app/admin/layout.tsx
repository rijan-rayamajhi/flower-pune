import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";

export const metadata: Metadata = {
    title: "Admin Dashboard | Flower Pune",
    description: "Manage your luxury floral business.",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile to check role
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

    // Only admins can access the admin dashboard
    if (profile?.role !== "admin") {
        redirect("/account");
    }

    const adminUser = {
        fullName: profile?.full_name ?? "Admin",
        email: user.email ?? "",
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar user={adminUser} />
            <div className="flex flex-1 flex-col lg:pl-64 transition-all duration-300">
                <Topbar user={adminUser} />
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
