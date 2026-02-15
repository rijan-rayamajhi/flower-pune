"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-100 bg-white hidden lg:block">
            {/* Logo */}
            <div className="flex h-20 items-center justify-center border-b border-gray-100">
                <Link href="/admin" className="font-serif text-2xl font-bold text-charcoal">
                    Flower Pune
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 p-4">
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

            {/* Logout */}
            <div className="absolute bottom-4 left-4 right-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-charcoal/60 hover:bg-gray-50 hover:text-red-600 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
