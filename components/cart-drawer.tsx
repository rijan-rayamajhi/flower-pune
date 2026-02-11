"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
    const { isOpen, closeCart, items } = useCart();
    const [isVisible, setIsVisible] = useState(false);

    // Handle animation persistence
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 500); // Match transition duration
            document.body.style.overflow = "";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-500 ease-out transform",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="font-serif text-xl font-medium text-charcoal">Shopping Cart ({items.length})</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 text-charcoal/60 hover:text-burgundy transition-colors rounded-full hover:bg-gray-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="relative h-24 w-20 overflow-hidden rounded-md bg-gray-100 shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-charcoal">{item.title}</h3>
                                        <p className="text-sm text-charcoal/60">$185.00</p>
                                    </div>
                                    <button className="text-charcoal/40 hover:text-red-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center border border-gray-200 rounded-sm">
                                        <button className="p-1.5 text-charcoal/60 hover:text-charcoal transition-colors">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button className="p-1.5 text-charcoal/60 hover:text-charcoal transition-colors">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <p className="font-bold text-charcoal">${item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-white px-6 py-6 pb-8 space-y-4">
                    <div className="flex justify-between items-center text-charcoal">
                        <span className="text-base font-medium">Subtotal</span>
                        <span className="text-lg font-bold">${subtotal}</span>
                    </div>
                    <p className="text-xs text-charcoal/50 text-center">Shipping and taxes calculated at checkout.</p>

                    <Link href="/checkout" onClick={closeCart} className="block w-full">
                        <button className="w-full btn-primary h-14 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 group flex items-center justify-center">
                            Checkout
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
