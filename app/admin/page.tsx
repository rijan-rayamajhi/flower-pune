import Link from "next/link";
import { ArrowUpRight, IndianRupee, ShoppingBag, Users, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardStats, getRecentOrders } from "@/lib/supabase/admin-queries";

export default async function AdminDashboard() {
    const [stats, recentOrders] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(5),
    ]);

    const STATS = [
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee },
        { label: "Active Orders", value: String(stats.activeOrders), icon: ShoppingBag },
        { label: "Today's Orders", value: String(stats.todaysOrders), icon: CalendarDays },
        { label: "New Customers", value: String(stats.newCustomers), icon: Users },
    ];

    const statusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-50 text-emerald-700";
            case "cancelled": return "bg-red-50 text-red-700";
            case "placed":
            case "confirmed": return "bg-blue-50 text-blue-700";
            case "preparing":
            case "dispatched": return "bg-amber-50 text-amber-700";
            default: return "bg-gray-50 text-gray-700";
        }
    };

    return (
        <div className="space-y-8">

            {/* Page Header */}
            <div>
                <h1 className="font-serif text-3xl font-medium text-charcoal">Dashboard</h1>
                <p className="text-charcoal/60">Welcome back, here&apos;s what&apos;s happening today.</p>
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
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/5 text-burgundy">
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <h2 className="font-serif text-lg font-medium text-charcoal">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs font-medium text-burgundy hover:text-burgundy/80 transition-colors flex items-center gap-1">
                        View All <ArrowUpRight className="h-3 w-3" />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-charcoal/60">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Order</th>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-6 py-3 font-medium">Product</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-charcoal">{order.order_number}</td>
                                        <td className="px-6 py-4 text-charcoal/80">{order.shipping_full_name}</td>
                                        <td className="px-6 py-4 text-charcoal/80">
                                            {order.order_items?.[0]?.product_name || "—"}
                                            {order.order_items?.length > 1 && (
                                                <span className="text-charcoal/40 text-xs ml-1">
                                                    +{order.order_items.length - 1} more
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/60">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-charcoal">₹{Number(order.total).toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                                statusColor(order.status)
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-charcoal/40">
                        <p>No orders yet.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
