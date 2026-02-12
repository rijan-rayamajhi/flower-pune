"use client";

import { useState } from "react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FadeIn } from "@/components/ui/motion";
import { User, Package, MapPin, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

type Tab = "profile" | "orders" | "addresses" | "wishlist";

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    const tabs = [
        { id: "profile" as Tab, label: "Profile", icon: User },
        { id: "orders" as Tab, label: "Orders", icon: Package },
        { id: "addresses" as Tab, label: "Addresses", icon: MapPin },
        { id: "wishlist" as Tab, label: "Wishlist", icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-ivory pt-24 pb-16">
            <div className="container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h1 className="font-serif text-4xl font-medium text-charcoal mb-2">
                        My Account
                    </h1>
                    <p className="text-gray-500 mb-8">Manage your profile and orders</p>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <FadeIn delay={0.1}>
                            <nav className="bg-white rounded-2xl shadow-luxury p-6 sticky top-24">
                                <ul className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <li key={tab.id}>
                                                <button
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                            ? "bg-blush text-burgundy"
                                                            : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    {tab.label}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </FadeIn>
                    </aside>

                    {/* Content Panel */}
                    <main className="lg:col-span-3">
                        <FadeIn delay={0.2}>
                            {activeTab === "profile" && <ProfileSection />}
                            {activeTab === "orders" && <OrdersSection />}
                            {activeTab === "addresses" && <AddressesSection />}
                            {activeTab === "wishlist" && <WishlistSection />}
                        </FadeIn>
                    </main>
                </div>
            </div>
        </div>
    );
}

function ProfileSection() {
    return (
        <div className="bg-white rounded-2xl shadow-luxury p-8">
            <h2 className="font-serif text-2xl font-medium text-charcoal mb-6">
                Profile Information
            </h2>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <FloatingInput
                    id="fullName"
                    label="Full Name"
                    type="text"
                    defaultValue="John Doe"
                />
                <FloatingInput
                    id="email"
                    label="Email Address"
                    type="email"
                    defaultValue="john@example.com"
                />
                <FloatingInput
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                />
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-burgundy px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-burgundy/90 hover:shadow-xl hover:-translate-y-0.5"
                >
                    Save Changes
                    <ArrowRight className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}

function OrdersSection() {
    const orders = [
        {
            id: "#ORD-1234",
            date: "Jan 15, 2026",
            total: 120,
            status: "Delivered",
            items: "Velvet Rose Bouquet, White Elegance",
        },
        {
            id: "#ORD-1233",
            date: "Jan 10, 2026",
            total: 85,
            status: "In Transit",
            items: "Summer Breeze",
        },
        {
            id: "#ORD-1232",
            date: "Dec 28, 2025",
            total: 200,
            status: "Delivered",
            items: "Crimson Passion, Pink Paradise",
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="font-serif text-2xl font-medium text-charcoal mb-6">
                Order History
            </h2>
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-luxury p-6 hover:shadow-xl transition-shadow"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-charcoal">
                                    {order.id}
                                </h3>
                                <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${order.status === "Delivered"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-blue-50 text-blue-700"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                                {order.date}
                            </p>
                            <p className="text-sm text-gray-600">{order.items}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-semibold text-burgundy">
                                    ${order.total}
                                </p>
                            </div>
                            <Link
                                href={`/orders/${order.id}`}
                                className="text-sm font-medium text-burgundy hover:text-burgundy/80 transition-colors"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function AddressesSection() {
    const addresses = [
        {
            id: 1,
            type: "Home",
            name: "John Doe",
            street: "123 Floral Avenue",
            city: "San Francisco, CA 94102",
            isDefault: true,
        },
        {
            id: 2,
            type: "Work",
            name: "John Doe",
            street: "456 Business Blvd",
            city: "San Francisco, CA 94103",
            isDefault: false,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-medium text-charcoal">
                    Saved Addresses
                </h2>
                <button className="text-sm font-medium text-burgundy hover:text-burgundy/80 transition-colors">
                    + Add New
                </button>
            </div>
            {addresses.map((address) => (
                <div
                    key={address.id}
                    className="bg-white rounded-2xl shadow-luxury p-6 hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-charcoal">
                                    {address.type}
                                </h3>
                                {address.isDefault && (
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blush text-burgundy">
                                        Default
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">{address.name}</p>
                            <p className="text-sm text-gray-600">
                                {address.street}
                            </p>
                            <p className="text-sm text-gray-600">{address.city}</p>
                        </div>
                        <button className="text-sm font-medium text-gray-400 hover:text-burgundy transition-colors">
                            Edit
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function WishlistSection() {
    return (
        <div className="bg-white rounded-2xl shadow-luxury p-12 text-center">
            <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-medium text-charcoal mb-2">
                Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-6">
                Save your favorite items to review them later
            </p>
            <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-burgundy px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-burgundy/90 hover:shadow-xl hover:-translate-y-0.5"
            >
                Browse Shop
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}
