import { ArrowUpRight, DollarSign, ShoppingBag, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
    { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign },
    { label: "Active Orders", value: "+573", change: "+180.1%", icon: ShoppingBag },
    { label: "New Customers", value: "+2,350", change: "+19%", icon: Users },
    { label: "Active Now", value: "+45", change: "+201", icon: Activity },
];

const RECENT_ORDERS = [
    { id: "ORD-001", customer: "Liam Johnson", product: "The Royal Blush", date: "Oct 24, 2024", amount: "$185.00", status: "Paid" },
    { id: "ORD-002", customer: "Olivia Smith", product: "Velvet Touch", date: "Oct 24, 2024", amount: "$145.00", status: "Pending" },
    { id: "ORD-003", customer: "Noah Williams", product: "Golden Hour", date: "Oct 23, 2024", amount: "$210.00", status: "Paid" },
    { id: "ORD-004", customer: "Emma Brown", product: "Pure Elegance", date: "Oct 23, 2024", amount: "$160.00", status: "Failed" },
    { id: "ORD-005", customer: "Ava Jones", product: "Midnight Rose", date: "Oct 22, 2024", amount: "$290.00", status: "Paid" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">

            {/* Page Header */}
            <div>
                <h1 className="font-serif text-3xl font-medium text-charcoal">Dashboard</h1>
                <p className="text-charcoal/60">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {STATS.map((stat, i) => (
                    <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-charcoal/60">{stat.label}</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-charcoal">{stat.value}</span>
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/5 text-burgundy">
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders - Minimal Luxury Table */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <h2 className="font-serif text-lg font-medium text-charcoal">Recent Orders</h2>
                    <button className="text-xs font-medium text-burgundy hover:text-burgundy/80 transition-colors flex items-center gap-1">
                        View All <ArrowUpRight className="h-3 w-3" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-charcoal/60">
                            <tr>
                                <th className="px-6 py-3 font-medium">Order ID</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Product</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {RECENT_ORDERS.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-charcoal">{order.id}</td>
                                    <td className="px-6 py-4 text-charcoal/80">{order.customer}</td>
                                    <td className="px-6 py-4 text-charcoal/80">{order.product}</td>
                                    <td className="px-6 py-4 text-charcoal/60">{order.date}</td>
                                    <td className="px-6 py-4 font-medium text-charcoal">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                order.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                                                    order.status === "Pending" ? "bg-amber-50 text-amber-700" :
                                                        "bg-red-50 text-red-700"
                                            )}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
