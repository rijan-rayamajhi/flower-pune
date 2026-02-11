"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { FloatingInput } from "@/components/ui/floating-input";

export default function CheckoutPage() {
    const { items } = useCart();
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 25; // Flat rate for example
    const total = subtotal + shipping;

    return (
        <div className="bg-ivory pb-24 lg:pb-0">
            <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Continue Shopping</span>
                    </Link>
                    <div className="flex items-center gap-2 text-charcoal/40">
                        <Lock className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Secure Checkout</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

                    {/* Left Column: Forms (7 cols) */}
                    <div className="space-y-12 lg:col-span-7">

                        {/* Contact */}
                        <section>
                            <h2 className="mb-6 font-serif text-2xl font-medium text-charcoal">Contact Information</h2>
                            <div className="space-y-4">
                                <FloatingInput id="email" label="Email Address" type="email" />
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="newsletter" className="rounded border-gray-300 text-burgundy focus:ring-burgundy" />
                                    <label htmlFor="newsletter" className="text-sm text-charcoal/70">Keep me updated on news and exclusive offers</label>
                                </div>
                            </div>
                        </section>

                        {/* Delivery */}
                        <section>
                            <h2 className="mb-6 font-serif text-2xl font-medium text-charcoal">Delivery Details</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FloatingInput id="firstName" label="First Name" type="text" />
                                <FloatingInput id="lastName" label="Last Name" type="text" />
                                <div className="sm:col-span-2">
                                    <FloatingInput id="address" label="Address" type="text" />
                                </div>
                                <div className="sm:col-span-2">
                                    <FloatingInput id="apartment" label="Apartment, suite, etc. (optional)" type="text" />
                                </div>
                                <FloatingInput id="city" label="City" type="text" />
                                <FloatingInput id="postalCode" label="Postal Code" type="text" />
                                <div className="sm:col-span-2">
                                    <FloatingInput id="phone" label="Phone" type="tel" />
                                </div>
                            </div>
                        </section>

                        {/* Payment */}
                        <section>
                            <h2 className="mb-6 font-serif text-2xl font-medium text-charcoal">Payment</h2>
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="h-5 w-5 text-burgundy" />
                                    <span className="font-medium text-charcoal">Credit Card</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <FloatingInput id="cardNumber" label="Card Number" type="text" placeholder="0000 0000 0000 0000" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput id="expiry" label="Expiration (MM/YY)" type="text" />
                                        <FloatingInput id="cvc" label="CVC" type="text" />
                                    </div>
                                    <FloatingInput id="cardName" label="Name on Card" type="text" />
                                </div>
                            </div>
                        </section>

                        {/* Actions (Desktop) */}
                        <div className="hidden pt-4 lg:block">
                            <button className="w-full btn-primary h-14 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                Pay Now - ${total.toFixed(2)}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl lg:p-8">
                            <h2 className="mb-6 font-serif text-xl font-medium text-charcoal">Order Summary</h2>

                            {/* Items */}
                            <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {items.length === 0 ? (
                                    <p className="text-charcoal/50 italic">Your cart is empty.</p>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100 shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-xs font-medium text-white shadow-sm">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex flex-1 items-center justify-between">
                                                <h3 className="font-medium text-charcoal">{item.title}</h3>
                                                <p className="font-medium text-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Divider */}
                            <div className="my-6 h-px w-full bg-burgundy/10" />

                            {/* Totals */}
                            <div className="space-y-3 text-sm text-charcoal/80">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-medium">${shipping.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="my-6 h-px w-full bg-burgundy/10" />

                            <div className="flex items-baseline justify-between">
                                <span className="font-serif text-xl font-medium text-charcoal">Total</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-charcoal/50">USD</span>
                                    <span className="text-2xl font-bold text-charcoal">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Mobile Sticky Payment */}
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white p-4 shadow-top lg:hidden">
                    <button className="w-full btn-primary h-14 text-base shadow-md">
                        Pay Now - ${total.toFixed(2)}
                    </button>
                </div>

            </div>
        </div>
    );
}
