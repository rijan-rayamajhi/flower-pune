"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, FolderOpen, CalendarHeart, Flower2, Users, BarChart3, Settings, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";
import { useState } from "react";

interface AdminUser {
    fullName: string;
    email: string;
}

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: FolderOpen, label: "Categories", href: "/admin/categories" },
    { icon: CalendarHeart, label: "Occasions", href: "/admin/occasions" },
    { icon: Flower2, label: "Flowers", href: "/admin/flowers" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar({ user }: { user: AdminUser }) {
    const pathname = usePathname();
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        setLoggingOut(true);
        await logout();
    }

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-100 bg-white hidden lg:flex lg:flex-col">
            {/* Logo */}
            <div className="flex h-20 items-center justify-center border-b border-gray-100">
                <Link href="/admin" className="font-serif text-2xl font-bold text-charcoal">
                    Flower Pune
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 p-4 flex-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-burgundy/5 text-burgundy"
                                    : "text-charcoal/60 hover:bg-gray-50 hover:text-charcoal"
                            )}
                        >
                            <link.icon className={cn("h-5 w-5", isActive ? "text-burgundy" : "text-charcoal/40")} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info + Logout */}
            <div className="border-t border-gray-100 p-4 space-y-3">
                <div className="px-2">
                    <p className="text-sm font-medium text-charcoal truncate">{user.fullName || "Admin"}</p>
                    <p className="text-xs text-charcoal/50 truncate">{user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-charcoal/60 hover:bg-gray-50 hover:text-red-600 transition-colors disabled:opacity-60"
                >
                    {loggingOut ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <LogOut className="h-5 w-5" />
                    )}
                    {loggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
        </aside>
    );
}
