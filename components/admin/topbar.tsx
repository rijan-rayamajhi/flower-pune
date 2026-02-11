"use client";

import { Search, Bell, User } from "lucide-react";

export default function Topbar() {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8">
            {/* Search */}
            <div className="flex w-96 items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                <Search className="h-4 w-4 text-charcoal/40" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button className="relative text-charcoal/60 hover:text-burgundy transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-burgundy ring-2 ring-white" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-charcoal">Admin User</span>
                        <span className="text-xs text-charcoal/50">Store Manager</span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
