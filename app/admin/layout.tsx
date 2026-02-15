import type { Metadata } from "next";
import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";

export const metadata: Metadata = {
    title: "Admin Dashboard | Flower Pune",
    description: "Manage your luxury floral business.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar />
            <div className="flex flex-1 flex-col lg:pl-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
