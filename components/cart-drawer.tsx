"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
    const { isOpen, closeCart, items, updateQuantity, removeItem, totalItems } = useCart();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="font-serif text-xl font-medium text-charcoal">
                                Shopping Cart ({totalItems})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 text-charcoal/60 hover:text-burgundy transition-colors rounded-full hover:bg-gray-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                    <div className="rounded-full bg-gray-50 p-6 mb-4">
                                        <ShoppingBag className="h-10 w-10 text-charcoal/20" />
                                    </div>
                                    <h3 className="font-serif text-lg font-medium text-charcoal mb-1">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-sm text-charcoal/50 mb-6 max-w-xs">
                                        Browse our collection and add beautiful flowers to your cart.
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={closeCart}
                                        className="btn-primary px-6 py-2.5 text-sm"
                                    >
                                        Browse Shop
                                    </Link>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const isAtMax = item.stockQuantity > 0 && item.quantity >= item.stockQuantity;
                                    return (
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
                                                        <h3 className="font-medium text-charcoal text-sm leading-tight">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-charcoal/60 mt-0.5">
                                                            ₹{item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-charcoal/40 hover:text-red-500 transition-colors p-1"
                                                        aria-label={`Remove ${item.title} from cart`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center border border-gray-200 rounded-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1.5 text-charcoal/60 hover:text-charcoal transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={isAtMax}
                                                            className="p-1.5 text-charcoal/60 hover:text-charcoal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-charcoal">
                                                            ₹{(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                        {isAtMax && (
                                                            <p className="text-[10px] text-amber-600 font-medium">Max stock</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer — only show when cart has items */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-100 bg-white px-6 py-6 pb-8 space-y-4">
                                <div className="flex justify-between items-center text-charcoal">
                                    <span className="text-base font-medium">Subtotal</span>
                                    <span className="text-lg font-bold">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-charcoal/50 text-center">Shipping and taxes calculated at checkout.</p>

                                <Link href="/checkout" onClick={closeCart} className="block w-full">
                                    <button className="w-full btn-primary h-14 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 group flex items-center justify-center">
                                        Checkout
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
