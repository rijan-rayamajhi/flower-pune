"use client";

import { Search } from "lucide-react";
import MobileSidebar from "./mobile-sidebar";
import NotificationsDropdown from "./notifications-dropdown";

interface AdminUser {
    fullName: string;
    email: string;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function Topbar({ user }: { user: AdminUser }) {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white px-4 lg:px-8">
            {/* Mobile Menu + Search */}
            <div className="flex items-center gap-3">
                <MobileSidebar />
                <div className="hidden sm:flex w-96 items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                    <Search className="h-4 w-4 text-charcoal/40" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <NotificationsDropdown />

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-medium text-charcoal">
                            {user.fullName || "Admin"}
                        </span>
                        <span className="text-xs text-charcoal/50">
                            {user.email}
                        </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/10 text-burgundy text-sm font-semibold">
                        {getInitials(user.fullName || "A")}
                    </div>
                </div>
            </div>
        </header>
    );
}
