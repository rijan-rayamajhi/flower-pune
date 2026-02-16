import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Clock, FileText, Phone, User, Smartphone } from "lucide-react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/page-header";
import OrderActions from "@/components/admin/order-actions";
import { getAdminOrderById } from "@/lib/supabase/admin-queries";
import { cn } from "@/lib/utils";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const order = await getAdminOrderById(id);

    if (!order) {
        notFound();
    }

    const statusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "cancelled": return "bg-red-50 text-red-700 border-red-200";
            case "placed":
            case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
            case "preparing":
            case "dispatched": return "bg-amber-50 text-amber-700 border-amber-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const paymentStatusColor = (status: string) => {
        switch (status) {
            case "paid": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "failed": return "bg-red-50 text-red-700 border-red-200";
            case "refunded": return "bg-purple-50 text-purple-700 border-purple-200";
            default: return "bg-amber-50 text-amber-700 border-amber-200";
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-5xl">
            {/* Back + Header */}
            <div className="mb-6">
                <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={`Order ${order.order_number}`}
                        description={`Placed on ${formatDate(order.placed_at)}`}
                    />
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border capitalize",
                            statusColor(order.status)
                        )}>
                            {order.status}
                        </span>
                        <OrderActions orderId={order.id} currentStatus={order.status} />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Order Items (spans 2 cols) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Items Card */}
                    <section className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Package className="h-5 w-5 text-burgundy" />
                            <h2 className="font-serif text-lg font-medium text-charcoal">
                                Order Items ({order.order_items.length})
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="relative h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                        {item.product_image ? (
                                            <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full text-charcoal/20">
                                                <Package className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-charcoal truncate">{item.product_name}</p>
                                        <p className="text-sm text-charcoal/50">
                                            ₹{Number(item.unit_price).toLocaleString("en-IN")} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium text-charcoal whitespace-nowrap">
                                        ₹{Number(item.line_total || item.unit_price * item.quantity).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-5 border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-charcoal/60">
                                <span>Subtotal</span>
                                <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-sm text-charcoal/60">
                                <span>Shipping</span>
                                <span>{Number(order.shipping_fee) === 0 ? "Free" : `₹${Number(order.shipping_fee).toLocaleString("en-IN")}`}</span>
                            </div>
                            {Number(order.discount) > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{Number(order.discount).toLocaleString("en-IN")}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-semibold text-charcoal pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Clock className="h-5 w-5 text-burgundy" />
                            <h2 className="font-serif text-lg font-medium text-charcoal">Order Timeline</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: "Placed", time: order.placed_at, active: true },
                                { label: "Confirmed", time: order.confirmed_at, active: !!order.confirmed_at },
                                { label: "Dispatched", time: order.dispatched_at, active: !!order.dispatched_at },
                                { label: "Delivered", time: order.delivered_at, active: !!order.delivered_at },
                                ...(order.cancelled_at ? [{ label: "Cancelled", time: order.cancelled_at, active: true }] : []),
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-2.5 w-2.5 rounded-full shrink-0",
                                        step.active
                                            ? step.label === "Cancelled" ? "bg-red-500" : "bg-emerald-500"
                                            : "bg-gray-200"
                                    )} />
                                    <span className={cn(
                                        "text-sm font-medium",
                                        step.active ? "text-charcoal" : "text-charcoal/30"
                                    )}>
                                        {step.label}
                                    </span>
                                    <span className="text-xs text-charcoal/40 ml-auto">
                                        {step.time ? formatDate(step.time) : "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Customer & Shipping */}
                    <section className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <MapPin className="h-5 w-5 text-burgundy" />
                            <h2 className="font-serif text-lg font-medium text-charcoal">Shipping Details</h2>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                                <span className="font-medium text-charcoal">{order.shipping_full_name}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                                <span className="text-charcoal/70">{order.shipping_phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-charcoal/40 mt-0.5 shrink-0" />
                                <div className="text-charcoal/70">
                                    <p>{order.shipping_address}</p>
                                    <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <CreditCard className="h-5 w-5 text-burgundy" />
                            <h2 className="font-serif text-lg font-medium text-charcoal">Payment</h2>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-charcoal/50">Method</span>
                                <span className="font-medium text-charcoal uppercase">{order.payment_method || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-charcoal/50">Status</span>
                                <span className={cn(
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize",
                                    paymentStatusColor(order.payment_status)
                                )}>
                                    {order.payment_status}
                                </span>
                            </div>
                            {order.upi_transaction_id && (
                                <div className="flex justify-between items-start">
                                    <span className="text-charcoal/50 flex items-center gap-1">
                                        <Smartphone className="h-3 w-3" /> UPI Txn ID
                                    </span>
                                    <span className="font-mono text-xs font-medium text-charcoal bg-gray-50 px-2 py-1 rounded">
                                        {order.upi_transaction_id}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Delivery Schedule */}
                    <section className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Calendar className="h-5 w-5 text-burgundy" />
                            <h2 className="font-serif text-lg font-medium text-charcoal">Delivery Schedule</h2>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-charcoal/50">Date</span>
                                <span className="font-medium text-charcoal">
                                    {order.delivery_date
                                        ? new Date(order.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                                        : "Not set"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-charcoal/50">Slot</span>
                                <span className="font-medium text-charcoal">{order.delivery_slot || "Not set"}</span>
                            </div>
                        </div>
                    </section>

                    {/* Notes */}
                    {order.notes && (
                        <section className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <FileText className="h-5 w-5 text-burgundy" />
                                <h2 className="font-serif text-lg font-medium text-charcoal">Notes</h2>
                            </div>
                            <p className="text-sm text-charcoal/70 whitespace-pre-wrap">{order.notes}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
