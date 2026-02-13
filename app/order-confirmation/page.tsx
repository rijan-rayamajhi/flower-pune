"use client";

import { useCart } from "@/context/cart-context";
import { motion } from "framer-motion";
import { Check, ArrowRight, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center"><div className="animate-pulse text-charcoal">Loading...</div></div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}

function OrderConfirmationContent() {
    const { items, openCart } = useCart();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        const id = searchParams.get("orderId");
        if (id) {
            setOrderId(id);
        } else {
            // Fallback if no ID is passed (e.g. direct access)
            const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
            setOrderId(`FLR-2026-${randomStr}`);
        }
    }, [searchParams]);

    // Calculate total from cart items (using the context items for summary)
    // Note: In a real app, you'd likely clear the cart after successful payment
    // and pass the order details via state or URL parameters.
    // For this frontend-only demo, we'll display the current cart items.

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 15; // Mock shipping cost
    const total = subtotal + shipping;

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#E5E5E5]"
            >
                <div className="p-8 md:p-12 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-[#5E2C2C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                        <Check className="text-[#FDFBF7] w-10 h-10" strokeWidth={3} />
                    </motion.div>

                    <motion.h1
                        {...fadeInUp}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-3"
                    >
                        Order Confirmed
                    </motion.h1>

                    <motion.p
                        {...fadeInUp}
                        transition={{ delay: 0.4 }}
                        className="text-[#5E2C2C] text-lg font-medium mb-8"
                    >
                        Your flowers are on their way 🌸
                    </motion.p>

                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.5 }}
                        className="bg-[#F9F5F1] rounded-xl p-6 mb-8 border border-[#EBEBEB] max-w-md mx-auto"
                    >
                        <p className="text-[#7D7D7D] text-sm uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-2xl font-serif text-[#1A1A1A] tracking-wider">{orderId}</p>
                    </motion.div>

                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.6 }}
                        className="text-left max-w-xl mx-auto"
                    >
                        <h2 className="text-xl font-serif text-[#1A1A1A] mb-4 border-b border-[#E5E5E5] pb-2">Order Summary</h2>

                        {items.length > 0 ? (
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#F5F5F5] w-12 h-12 rounded-md overflow-hidden relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1A1A1A]">{item.title}</p>
                                                <p className="text-sm text-[#7D7D7D]">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-[#1A1A1A]">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="border-t border-[#E5E5E5] pt-4 mt-4 space-y-2">
                                    <div className="flex justify-between text-[#7D7D7D]">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#7D7D7D]">
                                        <span>Shipping</span>
                                        <span>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-serif text-xl text-[#1A1A1A] pt-2">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-[#7D7D7D] py-4 italic">No items in this order summary (cart is empty).</p>
                        )}
                    </motion.div>

                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col md:flex-row gap-4 justify-center mt-8"
                    >
                        <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#333] transition-all duration-300 shadow-md hover:shadow-lg">
                            <Package size={18} />
                            <span>Track Order</span>
                        </button>

                        <Link href="/" className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#1A1A1A] border border-[#1A1A1A] rounded-full hover:bg-[#F9F5F1] transition-all duration-300">
                            <ShoppingBag size={18} />
                            <span>Continue Shopping</span>
                        </Link>
                    </motion.div>
                </div>

                <div className="bg-[#F9F5F1] p-4 text-center border-t border-[#EBEBEB]">
                    <p className="text-sm text-[#7D7D7D]">
                        Need help? <a href="#" className="underline hover:text-[#5E2C2C]">Contact Support</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
