import { Search, Filter, Eye, MoreHorizontal } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { cn } from "@/lib/utils";

const ORDERS = [
    { id: "ORD-001", customer: "Liam Johnson", product: "The Royal Blush", date: "Oct 24, 2024", amount: "$185.00", status: "Paid", items: 2 },
    { id: "ORD-002", customer: "Olivia Smith", product: "Velvet Touch", date: "Oct 24, 2024", amount: "$145.00", status: "Pending", items: 1 },
    { id: "ORD-003", customer: "Noah Williams", product: "Golden Hour", date: "Oct 23, 2024", amount: "$210.00", status: "Paid", items: 3 },
    { id: "ORD-004", customer: "Emma Brown", product: "Pure Elegance", date: "Oct 23, 2024", amount: "$160.00", status: "Failed", items: 1 },
    { id: "ORD-005", customer: "Ava Jones", product: "Midnight Rose", date: "Oct 22, 2024", amount: "$290.00", status: "Paid", items: 2 },
    { id: "ORD-006", customer: "William Taylor", product: "Spring Whisper", date: "Oct 21, 2024", amount: "$120.00", status: "Paid", items: 1 },
    { id: "ORD-007", customer: "Sophia Davis", product: "Autumn Breeze", date: "Oct 20, 2024", amount: "$195.00", status: "Paid", items: 2 },
];

export default function OrdersPage() {
    return (
        <div>
            <PageHeader
                title="Orders"
                description="Manage and track your customer orders."
                action={
                    <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2 shadow-sm">
                        Export Orders
                    </button>
                }
            />

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-gray-100">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-burgundy"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-charcoal/60 hover:text-charcoal border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-charcoal/60">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Items</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {ORDERS.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-charcoal">{order.id}</td>
                                    <td className="px-6 py-4 text-charcoal/80">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-charcoal">{order.customer}</span>
                                            <span className="text-xs text-charcoal/50">{order.product}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-charcoal/60">{order.date}</td>
                                    <td className="px-6 py-4 text-charcoal/80">{order.items} items</td>
                                    <td className="px-6 py-4 font-medium text-charcoal">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                                order.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                    order.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                        "bg-red-50 text-red-700 border-red-100"
                                            )}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-charcoal/40 hover:text-burgundy hover:bg-burgundy/5 rounded-full transition-colors">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-charcoal/40 hover:text-charcoal hover:bg-gray-100 rounded-full transition-colors">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <span className="text-sm text-charcoal/60">Showing 1 to 7 of 124 entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-charcoal/60 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-charcoal/60 hover:bg-gray-50">Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
