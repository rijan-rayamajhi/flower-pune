"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, CreditCard, Smartphone, Globe } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FloatingInput } from "@/components/ui/floating-input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
    email: z.string().email("Invalid email address"),
    newsletter: z.boolean().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    apartment: z.string().optional(),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required").regex(/^\d{6}$/, "Postal code must be 6 digits"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    deliveryDate: z.string().min(1, "Delivery date is required"),
    deliverySlot: z.string().min(1, "Delivery slot is required"),
    cardNumber: z.string().min(1, "Card number is required"),
    expiry: z.string().min(1, "Expiration is required"),
    cvc: z.string().min(1, "CVC is required"),
    cardName: z.string().min(1, "Name on card is required"),
});



export default function CheckoutPage() {
    const { items } = useCart();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal'>('card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
    const [pincodeMessage, setPincodeMessage] = useState("");

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 25; // Flat rate for example
    const total = subtotal + shipping;

    const form = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            email: "",
            newsletter: false,
            firstName: "",
            lastName: "",
            address: "",
            apartment: "",
            city: "",
            postalCode: "",
            phone: "",
            deliveryDate: "",
            deliverySlot: "",
            cardNumber: "",
            expiry: "",
            cvc: "",
            cardName: "",
        },
    });

    const { register, handleSubmit, watch, formState: { errors } } = form;
    const postalCodeValue = watch("postalCode");

    // Fake Pincode Validation
    useEffect(() => {
        if (postalCodeValue && postalCodeValue.length === 6) {
            setPincodeStatus('checking');
            const timer = setTimeout(() => {
                if (['110001', '400001', '560001', '411001', '123456'].includes(postalCodeValue)) {
                    setPincodeStatus('valid');
                    setPincodeMessage("Delivery available for this location.");
                } else {
                    setPincodeStatus('invalid');
                    setPincodeMessage("Sorry, we do not deliver to this pincode yet.");
                }
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setPincodeStatus('idle');
            setPincodeMessage("");
        }
    }, [postalCodeValue]);

    const onSubmit = async (_data: z.infer<typeof checkoutSchema>) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const orderId = `FLR-${Math.floor(Math.random() * 1000000)}`;
        // Redirect to confirmation
        router.push(`/order-confirmation?orderId=${orderId}`);
    };

    // Get today's date for min date attribute
    const today = new Date().toISOString().split('T')[0];

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

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-12 lg:grid-cols-12">

                    {/* Left Column: Forms (7 cols) */}
                    <div className="space-y-12 lg:col-span-7">

                        {/* Contact */}
                        <section>
                            <h2 className="mb-6 font-serif text-2xl font-medium text-charcoal">Contact Information</h2>
                            <div className="space-y-4">
                                <FloatingInput
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message}
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="newsletter"
                                        className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                        {...register("newsletter")}
                                    />
                                    <label htmlFor="newsletter" className="text-sm text-charcoal/70">Keep me updated on news and exclusive offers</label>
                                </div>
                            </div>
                        </section>

                        {/* Delivery */}
                        <section>
                            <h2 className="mb-6 font-serif text-2xl font-medium text-charcoal">Delivery Details</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FloatingInput
                                    id="firstName"
                                    label="First Name"
                                    type="text"
                                    {...register("firstName")}
                                    error={errors.firstName?.message}
                                />
                                <FloatingInput
                                    id="lastName"
                                    label="Last Name"
                                    type="text"
                                    {...register("lastName")}
                                    error={errors.lastName?.message}
                                />
                                <div className="sm:col-span-2">
                                    <FloatingInput
                                        id="address"
                                        label="Address"
                                        type="text"
                                        {...register("address")}
                                        error={errors.address?.message}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <FloatingInput
                                        id="apartment"
                                        label="Apartment, suite, etc. (optional)"
                                        type="text"
                                        {...register("apartment")}
                                        error={errors.apartment?.message}
                                    />
                                </div>
                                <FloatingInput
                                    id="city"
                                    label="City"
                                    type="text"
                                    {...register("city")}
                                    error={errors.city?.message}
                                />
                                <div className="relative">
                                    <FloatingInput
                                        id="postalCode"
                                        label="Postal Code (e.g. 123456)"
                                        type="text"
                                        maxLength={6}
                                        {...register("postalCode")}
                                        error={errors.postalCode?.message}
                                    />
                                    {/* Pincode Feedback */}
                                    <div className="absolute right-3 top-3">
                                        {pincodeStatus === 'checking' && <span className="text-xs text-charcoal/60 animate-pulse">Checking...</span>}
                                        {pincodeStatus === 'valid' && <span className="text-xs text-green-600 font-medium">✓ Available</span>}
                                        {pincodeStatus === 'invalid' && <span className="text-xs text-red-500 font-medium">✕ Unavailable</span>}
                                    </div>
                                    {pincodeMessage && (
                                        <p className={`mt-1 text-xs ${pincodeStatus === 'valid' ? 'text-green-600' : pincodeStatus === 'invalid' ? 'text-red-500' : 'text-charcoal/60'}`}>
                                            {pincodeMessage}
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <FloatingInput
                                        id="phone"
                                        label="Phone"
                                        type="tel"
                                        {...register("phone")}
                                        error={errors.phone?.message}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Delivery Schedule (New) */}
                        <section>
                            <h2 className="mb-6 font-serif text-2xl font-medium text-charcoal">Delivery Schedule</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="relative">
                                    <FloatingInput
                                        id="deliveryDate"
                                        label="Delivery Date"
                                        type="date"
                                        min={today}
                                        {...register("deliveryDate")}
                                        error={errors.deliveryDate?.message}
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        id="deliverySlot"
                                        className={`w-full rounded-lg border bg-white px-4 pt-6 pb-2 text-charcoal focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy ${errors.deliverySlot ? "border-red-500" : "border-gray-200"
                                            }`}
                                        {...register("deliverySlot")}
                                    >
                                        <option value="" disabled hidden></option>
                                        <option value="Morning">Morning (9 AM - 12 PM)</option>
                                        <option value="Afternoon">Afternoon (1 PM - 5 PM)</option>
                                        <option value="Evening">Evening (6 PM - 9 PM)</option>
                                    </select>
                                    <label
                                        htmlFor="deliverySlot"
                                        className="absolute left-4 top-2 text-xs font-medium text-charcoal/60"
                                    >
                                        Time Slot
                                    </label>
                                    {errors.deliverySlot?.message && (
                                        <p className="mt-1 text-xs text-red-500">{String(errors.deliverySlot.message)}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Payment */}
                        <section>
                            <h2 className="mb-6 font-serif text-2xl font-medium text-charcoal">Payment Method</h2>

                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-300 ${paymentMethod === 'card'
                                        ? 'border-burgundy bg-burgundy/5 text-burgundy shadow-sm'
                                        : 'border-gray-200 bg-white text-charcoal/60 hover:border-burgundy/30 hover:bg-gray-50'
                                        }`}
                                >
                                    <CreditCard className="h-6 w-6" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Card</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-300 ${paymentMethod === 'upi'
                                        ? 'border-burgundy bg-burgundy/5 text-burgundy shadow-sm'
                                        : 'border-gray-200 bg-white text-charcoal/60 hover:border-burgundy/30 hover:bg-gray-50'
                                        }`}
                                >
                                    <Smartphone className="h-6 w-6" />
                                    <span className="text-xs font-medium uppercase tracking-wider">UPI</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-300 ${paymentMethod === 'paypal'
                                        ? 'border-burgundy bg-burgundy/5 text-burgundy shadow-sm'
                                        : 'border-gray-200 bg-white text-charcoal/60 hover:border-burgundy/30 hover:bg-gray-50'
                                        }`}
                                >
                                    <Globe className="h-6 w-6" />
                                    <span className="text-xs font-medium uppercase tracking-wider">PayPal</span>
                                </button>
                            </div>

                            {/* Payment Details Container */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500">

                                {paymentMethod === 'card' && (
                                    <div className="p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="mb-6 flex items-center justify-between">
                                            <h3 className="font-medium text-charcoal">Credit Card Details</h3>
                                            <div className="flex gap-2 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                                                <div className="h-6 w-8 rounded bg-gray-200"></div>
                                                <div className="h-6 w-8 rounded bg-gray-200"></div>
                                                <div className="h-6 w-8 rounded bg-gray-200"></div>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <FloatingInput
                                                id="cardNumber"
                                                label="Card Number"
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                {...register("cardNumber")}
                                                error={errors.cardNumber?.message}
                                                className="font-mono tracking-wider"
                                            />
                                            <div className="grid grid-cols-2 gap-5">
                                                <FloatingInput
                                                    id="expiry"
                                                    label="Expiry (MM/YY)"
                                                    type="text"
                                                    {...register("expiry")}
                                                    error={errors.expiry?.message}
                                                    className="font-mono"
                                                />
                                                <FloatingInput
                                                    id="cvc"
                                                    label="CVC"
                                                    type="text"
                                                    {...register("cvc")}
                                                    error={errors.cvc?.message}
                                                    className="font-mono"
                                                />
                                            </div>
                                            <FloatingInput
                                                id="cardName"
                                                label="Name on Card"
                                                type="text"
                                                {...register("cardName")}
                                                error={errors.cardName?.message}
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="mb-4 rounded-full bg-gray-50 p-4">
                                            <Smartphone className="h-8 w-8 text-burgundy" />
                                        </div>
                                        <h3 className="mb-2 font-medium text-charcoal">Pay via UPI</h3>
                                        <p className="max-w-xs text-sm text-charcoal/60">
                                            You will be redirected to your UPI app to complete the payment securely.
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="mb-4 rounded-full bg-gray-50 p-4">
                                            <Globe className="h-8 w-8 text-burgundy" />
                                        </div>
                                        <h3 className="mb-2 font-medium text-charcoal">Pay with PayPal</h3>
                                        <p className="max-w-xs text-sm text-charcoal/60">
                                            You will be redirected to PayPal to complete your purchase securely.
                                        </p>
                                    </div>
                                )}

                                {/* Secure Badge Footer */}
                                <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                                    <div className="flex items-center justify-center gap-2 text-charcoal/50">
                                        <Lock className="h-3 w-3" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Payments are SSL Encrypted & Secure</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Actions (Desktop) */}
                        <div className="hidden pt-4 lg:block">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full overflow-hidden rounded-xl bg-burgundy py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                                <span className="relative flex items-center justify-center gap-2 font-medium tracking-wide">
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4" />
                                            Complete Payment — ${total.toFixed(2)}
                                        </>
                                    )}
                                </span>
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

                </form>

                {/* Mobile Sticky Payment */}
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white p-4 shadow-top lg:hidden">
                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="w-full btn-primary h-14 text-base shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Processing...' : `Pay Now - $${total.toFixed(2)}`}
                    </button>
                </div>

            </div>
        </div>
    );
}
