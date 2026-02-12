"use client";

import Link from "next/link";
import { Check, ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
    // Mock Data
    const orderId = "#ORD-7829-XJ";
    const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Mock Items (simulating what was just bought)
    const mockItems = [
        { id: 1, name: "Velvet Red Roses", quantity: 1, price: 129.00 },
        { id: 2, name: "Premium Gift Wrap", quantity: 1, price: 15.00 },
    ];

    // Calculate totals
    const subtotal = mockItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 25.00;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-ivory via-rose-50/50 to-ivory flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                {/* Status Header */}
                <div className="bg-burgundy/5 p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-burgundy shadow-lg shadow-burgundy/20"
                    >
                        <Check className="h-10 w-10 text-white" strokeWidth={3} />
                    </motion.div>
                    <h1 className="mb-2 font-serif text-3xl font-medium text-charcoal">Thank You!</h1>
                    <p className="text-charcoal/60">Your order has been received</p>
                </div>

                {/* Order Details */}
                <div className="p-8">
                    <div className="mb-8 flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-charcoal/40">Order Number</p>
                            <p className="font-mono text-lg font-medium text-charcoal">{orderId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium uppercase tracking-wider text-charcoal/40">Date</p>
                            <p className="font-medium text-charcoal">{orderDate}</p>
                        </div>
                    </div>

                    <div className="mb-8 space-y-4">
                        <h2 className="text-sm font-medium uppercase tracking-wider text-charcoal/40">Order Summary</h2>
                        <div className="space-y-3">
                            {mockItems.map((item) => (
                                <div key={item.id} className="flex justify-between text-charcoal">
                                    <div className="flex gap-2">
                                        <span className="text-charcoal/60">{item.quantity}x</span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-medium">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="my-4 h-px w-full bg-gray-100" />
                        <div className="space-y-2 text-sm text-charcoal/60">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between text-lg font-medium text-charcoal">
                                <span>Total</span>
                                <span className="text-2xl">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link href="/" className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-burgundy py-4 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                            <span className="relative flex items-center justify-center gap-2 font-medium">
                                Continue Shopping
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>

                        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-charcoal transition-colors hover:border-burgundy hover:text-burgundy hover:bg-burgundy/5">
                            <Download className="h-4 w-4" />
                            Download Receipt
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
