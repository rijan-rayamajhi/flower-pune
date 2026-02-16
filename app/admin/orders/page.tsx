import Link from "next/link";
import PageHeader from "@/components/admin/page-header";
import OrderActions from "@/components/admin/order-actions";
import { cn } from "@/lib/utils";
import { getAdminOrders } from "@/lib/supabase/admin-queries";

interface OrdersPageProps {
    searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const statusFilter = params.status || "all";
    const { orders, total, totalPages } = await getAdminOrders(page, 10, statusFilter);

    const statusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "cancelled": return "bg-red-50 text-red-700 border-red-100";
            case "placed":
            case "confirmed": return "bg-blue-50 text-blue-700 border-blue-100";
            case "preparing":
            case "dispatched": return "bg-amber-50 text-amber-700 border-amber-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const filters = [
        { value: "all", label: "All Orders" },
        { value: "placed", label: "Placed" },
        { value: "confirmed", label: "Confirmed" },
        { value: "preparing", label: "Preparing" },
        { value: "dispatched", label: "Dispatched" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
    ];

    return (
        <div>
            <PageHeader
                title="Orders"
                description={`${total} total order${total !== 1 ? "s" : ""}`}
            />

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                        {filters.map((f) => (
                            <Link
                                key={f.value}
                                href={`/admin/orders?status=${f.value}&page=1`}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors border",
                                    statusFilter === f.value
                                        ? "bg-burgundy text-white border-burgundy"
                                        : "text-charcoal/60 hover:text-charcoal border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                {f.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-charcoal/60">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Items</th>
                                    <th className="px-6 py-4 font-medium">Total</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-charcoal">
                                            <Link href={`/admin/orders/${order.id}`} className="text-burgundy hover:underline">
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/80">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-charcoal">{order.shipping_full_name}</span>
                                                <span className="text-xs text-charcoal/50">{order.shipping_city}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/60">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/80">{order.order_items?.length || 0} items</td>
                                        <td className="px-6 py-4 font-medium text-charcoal">₹{Number(order.total).toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border capitalize",
                                                statusColor(order.status)
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <OrderActions orderId={order.id} currentStatus={order.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-charcoal/40">
                        <p>No orders found.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <span className="text-sm text-charcoal/60">
                            Page {page} of {totalPages} ({total} entries)
                        </span>
                        <div className="flex gap-2">
                            {page > 1 ? (
                                <Link
                                    href={`/admin/orders?status=${statusFilter}&page=${page - 1}`}
                                    className="px-3 py-1 text-sm border border-gray-200 rounded-md text-charcoal/60 hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span className="px-3 py-1 text-sm border border-gray-200 rounded-md text-charcoal/30 cursor-not-allowed">
                                    Previous
                                </span>
                            )}
                            {page < totalPages ? (
                                <Link
                                    href={`/admin/orders?status=${statusFilter}&page=${page + 1}`}
                                    className="px-3 py-1 text-sm border border-gray-200 rounded-md text-charcoal/60 hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            ) : (
                                <span className="px-3 py-1 text-sm border border-gray-200 rounded-md text-charcoal/30 cursor-not-allowed">
                                    Next
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
