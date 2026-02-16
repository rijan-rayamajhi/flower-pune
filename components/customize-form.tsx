"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check, Sparkles, Flower2, Leaf, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useCart, CartItem } from "@/context/cart-context";
import type { Flower } from "@/lib/types/product";

interface CustomizeFormProps {
    flowers: Flower[];
    serviceablePincodes: string[];
}

export default function CustomizeForm({ flowers }: CustomizeFormProps) {
    const { addToCart, openCart } = useCart();
    const [quantities, setQuantities] = useState<Record<string, number>>(() =>
        flowers.reduce((acc, f) => ({ ...acc, [f.id]: 0 }), {} as Record<string, number>)
    );
    const [message, setMessage] = useState("");
    const [addedToCart, setAddedToCart] = useState(false);

    // Calculate totals
    const { totalPrice, totalItems, selectedFlowers } = useMemo(() => {
        const selected = flowers
            .map(f => ({ ...f, qty: quantities[f.id] || 0 }))
            .filter(f => f.qty > 0);

        return {
            totalPrice: selected.reduce((sum, f) => sum + (Number(f.price) * f.qty), 0),
            totalItems: selected.reduce((sum, f) => sum + f.qty, 0),
            selectedFlowers: selected,
        };
    }, [quantities, flowers]);

    const handleQuantityChange = useCallback((flowerId: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[flowerId] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [flowerId]: next };
        });
        setAddedToCart(false);
    }, []);

    const handleAddToCart = () => {
        if (totalItems === 0) return;

        const description = selectedFlowers
            .map(f => `${f.qty}x ${f.name}`)
            .join(", ");

        const firstSelectedFlower = selectedFlowers[0];
        const cartImage = firstSelectedFlower?.image_url ||
            "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop";

        const customProduct: CartItem = {
            id: `custom-${Date.now()}`,
            title: "Custom Bouquet",
            price: totalPrice,
            image: cartImage,
            quantity: 1,
            stockQuantity: 999,
            description: message ? `${description} | Note: ${message}` : description,
            category: "Custom",
            href: "/customize",
            occasions: ["custom"],
        };

        addToCart(customProduct);
        setAddedToCart(true);
        setTimeout(() => openCart(), 300);
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12">

            {/* Left Column: Flower Selection */}
            <div className="lg:col-span-8 space-y-8">

                {/* Choose Blooms */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-4 sm:mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-burgundy text-white text-sm font-sans">1</span>
                        Choose Your Blooms
                        {totalItems > 0 && (
                            <span className="ml-auto text-sm font-sans font-medium text-burgundy bg-burgundy/5 px-3 py-1 rounded-full">
                                {totalItems} stem{totalItems !== 1 ? "s" : ""} selected
                            </span>
                        )}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {flowers.map((flower) => {
                            const qty = quantities[flower.id] || 0;
                            return (
                                <motion.div
                                    key={flower.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border bg-white transition-all hover:shadow-md ${qty > 0
                                        ? "border-burgundy/60 shadow-sm shadow-burgundy/5"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <div className="flex gap-4 items-center p-3 sm:p-4">
                                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl">
                                            <Image
                                                src={flower.image_url || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=400&auto=format&fit=crop"}
                                                alt={flower.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {qty > 0 && (
                                                <div className="absolute inset-0 bg-burgundy/10" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-charcoal text-base sm:text-lg">{flower.name}</h3>
                                            <p className="text-burgundy font-semibold mt-0.5">
                                                ₹{Number(flower.price)}
                                                <span className="text-charcoal/40 text-xs font-normal ml-1">/ stem</span>
                                            </p>
                                            <div className="mt-2.5 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(flower.id, -1)}
                                                    disabled={qty === 0}
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${qty > 0
                                                        ? "border-gray-300 text-charcoal hover:border-burgundy hover:text-burgundy active:scale-95"
                                                        : "border-gray-100 text-gray-200 cursor-not-allowed"
                                                        }`}
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={qty}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        className={`min-w-[2rem] text-center font-semibold ${qty > 0 ? "text-burgundy" : "text-charcoal/30"}`}
                                                    >
                                                        {qty}
                                                    </motion.span>
                                                </AnimatePresence>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(flower.id, 1)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-charcoal transition-all hover:border-burgundy hover:bg-burgundy hover:text-white active:scale-95"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                                {qty > 0 && (
                                                    <span className="text-xs text-charcoal/40 ml-1">
                                                        = ₹{Number(flower.price) * qty}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Optional Card Message */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-4 sm:mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-burgundy text-white text-sm font-sans">2</span>
                        Add a Note
                        <span className="text-sm font-sans font-normal text-charcoal/40">(Optional)</span>
                    </h2>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                        <label className="text-sm font-medium text-charcoal/80 mb-1.5 block">
                            <MessageSquare className="inline h-4 w-4 mr-1.5 text-charcoal/40" />
                            Card Message
                        </label>
                        <textarea
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a lovely note to accompany your bouquet..."
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy resize-none transition-colors"
                            maxLength={200}
                        />
                        <p className="mt-1 text-xs text-charcoal/30 text-right">{message.length}/200</p>
                    </div>
                </section>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                    <div className="rounded-xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="h-5 w-5 text-burgundy" />
                            <h3 className="font-serif text-xl font-medium text-charcoal">Your Creation</h3>
                        </div>

                        <AnimatePresence mode="sync">
                            {totalItems > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3 mb-5 max-h-[280px] overflow-y-auto pr-1"
                                >
                                    {selectedFlowers.map(flower => (
                                        <motion.div
                                            key={flower.id}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50"
                                        >
                                            <div className="relative h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                                                {flower.image_url ? (
                                                    <Image src={flower.image_url} alt={flower.name} fill className="object-cover" />
                                                ) : (
                                                    <div className={`w-full h-full ${flower.color_class} rounded-lg`} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-charcoal truncate">{flower.name}</p>
                                                <p className="text-xs text-charcoal/40">x{flower.qty} stems</p>
                                            </div>
                                            <span className="text-sm font-semibold text-charcoal whitespace-nowrap">₹{Number(flower.price) * flower.qty}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-5 py-8 text-center border-2 border-dashed border-gray-100 rounded-xl"
                                >
                                    <Flower2 className="h-8 w-8 text-charcoal/15 mx-auto mb-2" />
                                    <p className="text-charcoal/40 text-sm">Select flowers to begin</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Price Breakdown */}
                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-charcoal/60">Flowers ({totalItems} stems)</span>
                                <span className="font-medium text-charcoal">₹{totalPrice.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-charcoal/40">
                                <span className="flex items-center gap-1">
                                    <Leaf className="h-3 w-3" />
                                    Arrangement Fee
                                </span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-100 pt-4 mt-3">
                            <div className="flex justify-between items-end mb-5">
                                <span className="font-serif text-lg text-charcoal">Total</span>
                                <span className="text-2xl font-bold text-burgundy">₹{totalPrice.toLocaleString("en-IN")}</span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={totalItems === 0}
                                className={`w-full py-3.5 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${addedToCart
                                    ? "bg-green-600 text-white"
                                    : "btn-primary"
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Added to Cart!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Add Custom Bouquet to Cart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-charcoal/50">
                        <div className="p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-lg block mb-0.5">🌿</span>
                            <span className="font-medium text-charcoal/70">Fresh</span>
                            <span className="block">Guaranteed</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-lg block mb-0.5">✋</span>
                            <span className="font-medium text-charcoal/70">Hand</span>
                            <span className="block">Arranged</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-lg block mb-0.5">🔒</span>
                            <span className="font-medium text-charcoal/70">Secure</span>
                            <span className="block">Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
