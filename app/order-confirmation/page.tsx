import { getOrderByNumber } from "@/lib/supabase/orders";
import { Check, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Order Confirmed | Flower Pune",
};

interface PageProps {
    searchParams: Promise<{ order?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const orderNumber = params.order;

    if (!orderNumber) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-serif text-charcoal mb-4">No Order Found</h1>
                    <p className="text-charcoal/60 mb-8">Missing order reference.</p>
                    <Link href="/" className="btn-primary px-8 py-3 inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const order = await getOrderByNumber(orderNumber);

    if (!order) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-serif text-charcoal mb-4">Order Not Found</h1>
                    <p className="text-charcoal/60 mb-8">We couldn&apos;t find order <strong>{orderNumber}</strong>.</p>
                    <Link href="/" className="btn-primary px-8 py-3 inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 md:p-8">
            <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#E5E5E5]">
                <div className="p-8 md:p-12 text-center">
                    {/* Success Check */}
                    <div className="w-20 h-20 bg-[#5E2C2C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Check className="text-[#FDFBF7] w-10 h-10" strokeWidth={3} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-3">
                        Order Confirmed
                    </h1>

                    <p className="text-[#5E2C2C] text-lg font-medium mb-8">
                        Your flowers are on their way 🌸
                    </p>

                    {/* Order Number */}
                    <div className="bg-[#F9F5F1] rounded-xl p-6 mb-8 border border-[#EBEBEB] max-w-md mx-auto">
                        <p className="text-[#7D7D7D] text-sm uppercase tracking-wider mb-1">Order Number</p>
                        <p className="text-2xl font-serif text-[#1A1A1A] tracking-wider">{order.order_number}</p>
                    </div>

                    {/* Order Summary */}
                    <div className="text-left max-w-xl mx-auto">
                        <h2 className="text-xl font-serif text-[#1A1A1A] mb-4 border-b border-[#E5E5E5] pb-2">Order Summary</h2>

                        {order.order_items.length > 0 ? (
                            <div className="space-y-4 mb-6">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#F5F5F5] w-12 h-12 rounded-md overflow-hidden relative">
                                                {item.product_image ? (
                                                    <Image
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1A1A1A]">{item.product_name}</p>
                                                <p className="text-sm text-[#7D7D7D]">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-[#1A1A1A]">₹{Number(item.line_total).toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="border-t border-[#E5E5E5] pt-4 mt-4 space-y-2">
                                    <div className="flex justify-between text-[#7D7D7D]">
                                        <span>Subtotal</span>
                                        <span>₹{Number(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#7D7D7D]">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    {Number(order.discount) > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-₹{Number(order.discount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-serif text-xl text-[#1A1A1A] pt-2">
                                        <span>Total</span>
                                        <span>₹{Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-[#7D7D7D] py-4 italic">No items in this order.</p>
                        )}

                        {/* Delivery Info */}
                        {order.delivery_date && (
                            <div className="mt-6 p-4 bg-[#F9F5F1] rounded-xl border border-[#EBEBEB]">
                                <p className="text-sm text-[#7D7D7D] uppercase tracking-wider mb-2">Delivery</p>
                                <p className="font-medium text-[#1A1A1A]">
                                    {new Date(order.delivery_date).toLocaleDateString("en-IN", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                    {order.delivery_slot && ` · ${order.delivery_slot}`}
                                </p>
                                <p className="text-sm text-[#7D7D7D] mt-1">
                                    {order.shipping_full_name} · {order.shipping_address}, {order.shipping_city} {order.shipping_pincode}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                        <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#333] transition-all duration-300 shadow-md hover:shadow-lg">
                            <Package size={18} />
                            <span>Track Order</span>
                        </button>

                        <Link href="/" className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#1A1A1A] border border-[#1A1A1A] rounded-full hover:bg-[#F9F5F1] transition-all duration-300">
                            <ShoppingBag size={18} />
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-[#F9F5F1] p-4 text-center border-t border-[#EBEBEB]">
                    <p className="text-sm text-[#7D7D7D]">
                        Need help? <a href="#" className="underline hover:text-[#5E2C2C]">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
