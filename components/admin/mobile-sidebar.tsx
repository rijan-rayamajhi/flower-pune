"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, ShoppingBag, Package, Users, BarChart3, Settings, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const pathname = usePathname();

    async function handleLogout() {
        setLoggingOut(true);
        await logout();
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-charcoal/60 hover:text-burgundy lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Drawer */}
            <div
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <span className="font-serif text-xl font-bold text-charcoal">Flower Pune</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-charcoal/60 hover:text-burgundy"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 p-4 flex-1">
                    {sidebarLinks.map((link) => {
                        const isActive =
                            link.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
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

                <div className="border-t border-gray-100 p-4">
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
            </div>
        </>
    );
}
