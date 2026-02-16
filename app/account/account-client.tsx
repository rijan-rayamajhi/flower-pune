"use client";

import { useState } from "react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FadeIn } from "@/components/ui/motion";
import {
    User,
    Mail,
    Phone,
    Calendar,
    LogOut,
    Loader2,
    Check,
    ShoppingBag,
    Heart,
    Shield,
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";

interface AccountUser {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    createdAt: string;
}

export default function AccountClient({ user }: { user: AccountUser }) {
    const [fullName, setFullName] = useState(user.fullName);
    const [phone, setPhone] = useState(user.phone);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSaved(false);

        const supabase = createClient();
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ full_name: fullName, phone })
            .eq("id", user.id);

        if (updateError) {
            setError(updateError.message);
        } else {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }

        setSaving(false);
    }

    async function handleLogout() {
        setLoggingOut(true);
        await logout();
    }

    return (
        <div className="min-h-screen bg-ivory pt-24 pb-16">
            <div className="container mx-auto max-w-2xl px-4 sm:px-6">
                {/* Header */}
                <FadeIn>
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blush">
                            <User className="h-10 w-10 text-burgundy" />
                        </div>
                        <h1 className="font-serif text-3xl font-medium text-charcoal">
                            {user.fullName || "Welcome"}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                            Member since {memberSince}
                        </p>
                    </div>
                </FadeIn>

                {/* Quick Links */}
                <FadeIn delay={0.1}>
                    <div className="mb-8 grid grid-cols-2 gap-4">
                        <Link
                            href="/shop"
                            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-luxury transition-all hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blush">
                                <ShoppingBag className="h-5 w-5 text-burgundy" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-charcoal">
                                    Shop
                                </p>
                                <p className="text-xs text-gray-400">
                                    Browse flowers
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/wishlist"
                            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-luxury transition-all hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blush">
                                <Heart className="h-5 w-5 text-burgundy" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-charcoal">
                                    Wishlist
                                </p>
                                <p className="text-xs text-gray-400">
                                    Saved items
                                </p>
                            </div>
                        </Link>
                        {user.role === "admin" && (
                            <Link
                                href="/admin"
                                className="col-span-2 flex items-center gap-3 rounded-xl bg-burgundy/5 p-4 shadow-luxury transition-all hover:shadow-xl hover:-translate-y-0.5 border border-burgundy/10"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-burgundy">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal">
                                        Admin Dashboard
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Manage your store
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                </FadeIn>

                {/* Profile Form */}
                <FadeIn delay={0.2}>
                    <div className="rounded-2xl bg-white p-6 shadow-luxury sm:p-8">
                        <h2 className="mb-6 font-serif text-xl font-medium text-charcoal">
                            Profile Information
                        </h2>

                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {saved && (
                            <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                <Check className="h-4 w-4" />
                                Profile updated successfully
                            </div>
                        )}

                        <form onSubmit={handleSaveProfile} className="space-y-5">
                            <FloatingInput
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <div className="relative">
                                <FloatingInput
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    value={user.email}
                                    disabled
                                />
                                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                            </div>

                            <div className="relative">
                                <FloatingInput
                                    id="phone"
                                    name="phone"
                                    label="Phone Number"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                            </div>

                            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                    Joined {memberSince}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-burgundy px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-burgundy/90 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </form>
                    </div>
                </FadeIn>

                {/* Logout */}
                <FadeIn delay={0.3}>
                    <div className="mt-6">
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-all hover:border-red-200 hover:text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                            {loggingOut ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </>
                            )}
                        </button>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
