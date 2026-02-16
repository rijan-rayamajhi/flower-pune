import Link from "next/link";
import {
    TrendingUp, Users, ShoppingCart, IndianRupee,
    ArrowUpRight, Package, CreditCard, Activity, Smartphone, Banknote
} from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { cn } from "@/lib/utils";
import {
    getAnalyticsOverview,
    getDailyRevenue,
    getTopProducts,
    getOrderStatusBreakdown,
    getPaymentMethodBreakdown,
    getRecentActivity,
} from "@/lib/supabase/analytics-queries";

interface AnalyticsPageProps {
    searchParams: Promise<{ period?: string }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
    const params = await searchParams;
    const period = params.period || "30";
    const daysBack = Number(period) || 30;

    const [overview, dailyRevenue, topProducts, statusBreakdown, paymentBreakdown, recentActivity] =
        await Promise.all([
            getAnalyticsOverview(daysBack),
            getDailyRevenue(daysBack),
            getTopProducts(5),
            getOrderStatusBreakdown(),
            getPaymentMethodBreakdown(),
            getRecentActivity(8),
        ]);

    const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.revenue), 1);

    const statusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-500";
            case "cancelled": return "bg-red-400";
            case "placed": return "bg-blue-400";
            case "confirmed": return "bg-sky-400";
            case "preparing": return "bg-amber-400";
            case "dispatched": return "bg-purple-400";
            default: return "bg-gray-400";
        }
    };

    const statusBgColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-50 text-emerald-700";
            case "cancelled": return "bg-red-50 text-red-700";
            case "placed": return "bg-blue-50 text-blue-700";
            case "confirmed": return "bg-sky-50 text-sky-700";
            case "preparing": return "bg-amber-50 text-amber-700";
            case "dispatched": return "bg-purple-50 text-purple-700";
            default: return "bg-gray-50 text-gray-700";
        }
    };

    const paymentIcon = (method: string) => {
        switch (method) {
            case "upi": return Smartphone;
            case "cod": return Banknote;
            default: return CreditCard;
        }
    };

    const totalStatusOrders = statusBreakdown.reduce((sum, s) => sum + s.count, 0);
    const maxProductQty = Math.max(...topProducts.map(p => p.total_quantity), 1);

    const periodOptions = [
        { value: "7", label: "Last 7 Days" },
        { value: "30", label: "Last 30 Days" },
        { value: "90", label: "Last 3 Months" },
        { value: "365", label: "This Year" },
    ];

    return (
        <div>
            <PageHeader
                title="Analytics"
                description="Detailed insights into store performance."
                action={
                    <div className="flex gap-2">
                        {periodOptions.map((opt) => (
                            <Link
                                key={opt.value}
                                href={`/admin/analytics?period=${opt.value}`}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors border",
                                    period === opt.value
                                        ? "bg-burgundy text-white border-burgundy"
                                        : "text-charcoal/60 hover:text-charcoal border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                {opt.label}
                            </Link>
                        ))}
                    </div>
                }
            />

            {/* Overview Stats */}
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                    {
                        title: "Total Revenue",
                        value: `₹${overview.totalRevenue.toLocaleString("en-IN")}`,
                        icon: IndianRupee,
                        color: "bg-emerald-50 text-emerald-600",
                    },
                    {
                        title: "Total Orders",
                        value: overview.totalOrders.toLocaleString(),
                        icon: ShoppingCart,
                        color: "bg-blue-50 text-blue-600",
                    },
                    {
                        title: "Avg. Order Value",
                        value: `₹${overview.averageOrderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                        icon: TrendingUp,
                        color: "bg-amber-50 text-amber-600",
                    },
                    {
                        title: "Total Customers",
                        value: overview.totalCustomers.toLocaleString(),
                        icon: Users,
                        color: "bg-purple-50 text-purple-600",
                    },
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl bg-white p-5 sm:p-6 border border-gray-100/50 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">{stat.title}</p>
                        <p className="text-2xl font-bold text-charcoal mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Revenue Chart (spans 2 cols) */}
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-serif text-lg font-medium text-charcoal">Revenue Trend</h3>
                            <p className="text-xs text-charcoal/40 mt-1">
                                Last {daysBack} days • {dailyRevenue.filter(d => d.orders > 0).length} active days
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-charcoal/50">
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-burgundy"></span>Revenue
                            </span>
                        </div>
                    </div>

                    {dailyRevenue.length > 0 ? (
                        <>
                            <div className="h-52 flex items-end gap-px sm:gap-0.5">
                                {dailyRevenue.map((day, i) => {
                                    const pct = maxDailyRevenue > 0 ? (day.revenue / maxDailyRevenue) * 100 : 0;
                                    return (
                                        <div key={i} className="flex-1 relative group cursor-pointer min-w-0">
                                            <div className="w-full bg-gray-50 rounded-t h-52 relative">
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-burgundy/80 rounded-t transition-all duration-300 hover:bg-burgundy"
                                                    style={{ height: `${Math.max(pct, day.revenue > 0 ? 3 : 0)}%` }}
                                                />
                                            </div>
                                            {day.revenue > 0 && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                    ₹{day.revenue.toLocaleString("en-IN")}
                                                    <br />{day.orders} order{day.orders !== 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-3 text-[10px] text-charcoal/30 font-medium">
                                <span>{new Date(dailyRevenue[0]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                {dailyRevenue.length > 2 && (
                                    <span>{new Date(dailyRevenue[Math.floor(dailyRevenue.length / 2)]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                )}
                                <span>{new Date(dailyRevenue[dailyRevenue.length - 1]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            </div>
                        </>
                    ) : (
                        <div className="h-52 flex items-center justify-center text-charcoal/30">
                            <p>No revenue data for this period</p>
                        </div>
                    )}
                </div>

                {/* Order Status Breakdown */}
                <div className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                    <h3 className="font-serif text-lg font-medium text-charcoal mb-6">Order Status</h3>

                    {statusBreakdown.length > 0 ? (
                        <>
                            {/* Visual bar */}
                            <div className="h-4 w-full rounded-full overflow-hidden flex mb-6">
                                {statusBreakdown.map((s, i) => (
                                    <div
                                        key={i}
                                        className={cn("h-full transition-all", statusColor(s.status))}
                                        style={{ width: `${(s.count / totalStatusOrders) * 100}%` }}
                                        title={`${s.status}: ${s.count}`}
                                    />
                                ))}
                            </div>

                            <div className="space-y-3">
                                {statusBreakdown.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("h-2.5 w-2.5 rounded-full", statusColor(s.status))} />
                                            <span className="text-sm capitalize text-charcoal/70">{s.status}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-charcoal">{s.count}</span>
                                            <span className="text-xs text-charcoal/40 w-10 text-right">
                                                {((s.count / totalStatusOrders) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-12 text-charcoal/30">
                            <p>No orders yet</p>
                        </div>
                    )}
                </div>

                {/* Top Products */}
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-burgundy" />
                            <h3 className="font-serif text-lg font-medium text-charcoal">Top Products</h3>
                        </div>
                        <Link href="/admin/products" className="text-xs font-medium text-burgundy hover:text-burgundy/80 transition-colors flex items-center gap-1">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {topProducts.length > 0 ? (
                        <div className="space-y-4">
                            {topProducts.map((product, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-charcoal/30 w-5">#{i + 1}</span>
                                            <span className="font-medium text-charcoal">{product.product_name}</span>
                                        </div>
                                        <span className="text-charcoal/60">{product.total_quantity} sold</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden ml-7">
                                        <div
                                            className="h-full bg-burgundy rounded-full transition-all duration-700"
                                            style={{ width: `${(product.total_quantity / maxProductQty) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-right mt-1 text-xs font-bold text-charcoal ml-7">
                                        ₹{product.total_revenue.toLocaleString("en-IN")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12 text-charcoal/30">
                            <p>No products sold yet</p>
                        </div>
                    )}
                </div>

                {/* Payment Methods */}
                <div className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <CreditCard className="h-5 w-5 text-burgundy" />
                        <h3 className="font-serif text-lg font-medium text-charcoal">Payment Methods</h3>
                    </div>

                    {paymentBreakdown.length > 0 ? (
                        <div className="space-y-4">
                            {paymentBreakdown.map((pm, i) => {
                                const Icon = paymentIcon(pm.payment_method);
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50">
                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shrink-0">
                                            <Icon className="h-5 w-5 text-charcoal/50" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-charcoal uppercase">{pm.payment_method || "Other"}</p>
                                            <p className="text-xs text-charcoal/40">{pm.count} order{pm.count !== 1 ? 's' : ''}</p>
                                        </div>
                                        <p className="text-sm font-bold text-charcoal">₹{pm.revenue.toLocaleString("en-IN")}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12 text-charcoal/30">
                            <p>No payment data yet</p>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-3 rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-burgundy" />
                            <h3 className="font-serif text-lg font-medium text-charcoal">Recent Activity</h3>
                        </div>
                        <Link href="/admin/orders" className="text-xs font-medium text-burgundy hover:text-burgundy/80 transition-colors flex items-center gap-1">
                            All Orders <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-charcoal/50 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-3 font-medium">Order</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentActivity.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3">
                                                <Link href={`/admin/orders/${order.id}`} className="font-medium text-burgundy hover:underline">
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="py-3 text-charcoal/70">{order.shipping_full_name}</td>
                                            <td className="py-3 font-medium text-charcoal">₹{Number(order.total).toLocaleString("en-IN")}</td>
                                            <td className="py-3">
                                                <span className={cn(
                                                    "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                                    statusBgColor(order.status)
                                                )}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-charcoal/50 text-right text-xs">
                                                {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12 text-charcoal/30">
                            <p>No recent activity</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
