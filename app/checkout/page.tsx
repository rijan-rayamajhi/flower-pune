"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Smartphone, Banknote, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FloatingInput } from "@/components/ui/floating-input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder, type CreateOrderInput } from "./actions";
import { QRCodeSVG } from "qrcode.react";
import { getUpiId, getServiceablePincodes } from "@/lib/supabase/settings";

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
});

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
    const [upiTransactionId, setUpiTransactionId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
    const [pincodeMessage, setPincodeMessage] = useState("");

    // UPI ID + serviceable pincodes from database
    const [upiId, setUpiId] = useState("");
    const [upiLoading, setUpiLoading] = useState(true);
    const [serviceablePincodes, setServiceablePincodes] = useState<string[]>([]);

    useEffect(() => {
        async function loadSettings() {
            try {
                const [id, pins] = await Promise.all([getUpiId(), getServiceablePincodes()]);
                setUpiId(id);
                setServiceablePincodes(pins);
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                setUpiLoading(false);
            }
        }
        loadSettings();
    }, []);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    const upiLink = upiId
        ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Flower Pune")}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Flower Pune Order")}`
        : "";

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
        },
    });

    const { register, handleSubmit, watch, formState: { errors } } = form;
    const postalCodeValue = watch("postalCode");

    // Pincode Validation (against admin-configured pincodes)
    useEffect(() => {
        if (postalCodeValue && postalCodeValue.length === 6) {
            setPincodeStatus('checking');
            const timer = setTimeout(() => {
                // If admin hasn't configured any pincodes, accept all
                if (serviceablePincodes.length === 0) {
                    setPincodeStatus('valid');
                    setPincodeMessage("Delivery available for this location.");
                } else if (serviceablePincodes.includes(postalCodeValue)) {
                    setPincodeStatus('valid');
                    setPincodeMessage("Delivery available for this location.");
                } else {
                    setPincodeStatus('invalid');
                    setPincodeMessage("Sorry, we do not deliver to this pincode yet.");
                }
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setPincodeStatus('idle');
            setPincodeMessage("");
        }
    }, [postalCodeValue, serviceablePincodes]);

    // UPI transaction ID validation
    const isUpiValid = paymentMethod !== 'upi' || upiTransactionId.trim().length > 0;

    const onSubmit = async (formData: z.infer<typeof checkoutSchema>) => {
        if (items.length === 0) return;

        // Validate UPI transaction ID
        if (paymentMethod === 'upi' && !upiTransactionId.trim()) {
            setOrderError("Please enter your UPI Transaction ID / UTR number after making the payment.");
            return;
        }

        setIsSubmitting(true);
        setOrderError(null);

        const orderInput: CreateOrderInput = {
            items: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            shipping: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                apartment: formData.apartment || undefined,
                city: formData.city,
                state: "Maharashtra",
                postalCode: formData.postalCode,
                phone: formData.phone,
                email: formData.email,
            },
            deliveryDate: formData.deliveryDate,
            deliverySlot: formData.deliverySlot,
            paymentMethod: paymentMethod,
            upiTransactionId: paymentMethod === 'upi' ? upiTransactionId.trim() : undefined,
        };

        const result = await createOrder(orderInput);

        if (result.success) {
            clearCart();
            router.push(`/order-confirmation?order=${result.orderNumber}`);
        } else {
            setOrderError(result.error);
            setIsSubmitting(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-ivory pb-24 lg:pb-0">
            <div className="container-page py-6 sm:py-8">

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

                {/* Order Error Banner */}
                {orderError && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <p className="font-medium">Order could not be placed</p>
                        <p className="mt-1 text-red-600">{orderError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12">

                    {/* Left Column: Forms (7 cols) */}
                    <div className="space-y-8 sm:space-y-12 lg:col-span-7">

                        {/* Contact */}
                        <section>
                            <h2 className="mb-4 sm:mb-6 font-serif text-xl sm:text-2xl font-medium text-charcoal">Contact Information</h2>
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
                            <h2 className="mb-4 sm:mb-6 font-serif text-xl sm:text-2xl font-medium text-charcoal">Delivery Details</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FloatingInput id="firstName" label="First Name" type="text" {...register("firstName")} error={errors.firstName?.message} />
                                <FloatingInput id="lastName" label="Last Name" type="text" {...register("lastName")} error={errors.lastName?.message} />
                                <div className="sm:col-span-2">
                                    <FloatingInput id="address" label="Address" type="text" {...register("address")} error={errors.address?.message} />
                                </div>
                                <div className="sm:col-span-2">
                                    <FloatingInput id="apartment" label="Apartment, suite, etc. (optional)" type="text" {...register("apartment")} error={errors.apartment?.message} />
                                </div>
                                <FloatingInput id="city" label="City" type="text" {...register("city")} error={errors.city?.message} />
                                <div className="relative">
                                    <FloatingInput id="postalCode" label="Postal Code (e.g. 123456)" type="text" maxLength={6} {...register("postalCode")} error={errors.postalCode?.message} />
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
                                    <FloatingInput id="phone" label="Phone" type="tel" {...register("phone")} error={errors.phone?.message} />
                                </div>
                            </div>
                        </section>

                        {/* Delivery Schedule */}
                        <section>
                            <h2 className="mb-4 sm:mb-6 font-serif text-xl sm:text-2xl font-medium text-charcoal">Delivery Schedule</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="relative">
                                    <FloatingInput id="deliveryDate" label="Delivery Date" type="date" min={today} {...register("deliveryDate")} error={errors.deliveryDate?.message} />
                                </div>
                                <div className="relative">
                                    <select
                                        id="deliverySlot"
                                        className={`w-full rounded-lg border bg-white px-4 pt-6 pb-2 text-charcoal focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy ${errors.deliverySlot ? "border-red-500" : "border-gray-200"}`}
                                        {...register("deliverySlot")}
                                    >
                                        <option value="" disabled hidden></option>
                                        <option value="Morning">Morning (9 AM - 12 PM)</option>
                                        <option value="Afternoon">Afternoon (1 PM - 5 PM)</option>
                                        <option value="Evening">Evening (6 PM - 9 PM)</option>
                                    </select>
                                    <label htmlFor="deliverySlot" className="absolute left-4 top-2 text-xs font-medium text-charcoal/60">Time Slot</label>
                                    {errors.deliverySlot?.message && (
                                        <p className="mt-1 text-xs text-red-500">{String(errors.deliverySlot.message)}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Payment */}
                        <section>
                            <h2 className="mb-4 sm:mb-6 font-serif text-xl sm:text-2xl font-medium text-charcoal">Payment Method</h2>

                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
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
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-300 ${paymentMethod === 'cod'
                                        ? 'border-burgundy bg-burgundy/5 text-burgundy shadow-sm'
                                        : 'border-gray-200 bg-white text-charcoal/60 hover:border-burgundy/30 hover:bg-gray-50'
                                        }`}
                                >
                                    <Banknote className="h-6 w-6" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Cash on Delivery</span>
                                </button>
                            </div>

                            {/* Payment Details Container */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500">

                                {paymentMethod === 'upi' && (
                                    <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex flex-col items-center text-center">
                                            <h3 className="mb-2 font-medium text-charcoal">Scan to Pay via UPI</h3>
                                            <p className="mb-6 max-w-xs text-sm text-charcoal/60">
                                                Scan the QR code below using any UPI app (Google Pay, PhonePe, Paytm, etc.) to complete your payment.
                                            </p>

                                            {/* QR Code */}
                                            {upiLoading ? (
                                                <div className="flex items-center justify-center h-[232px] w-[232px] rounded-2xl border-2 border-dashed border-gray-200 mb-4">
                                                    <Loader2 className="h-6 w-6 animate-spin text-burgundy" />
                                                </div>
                                            ) : upiId ? (
                                                <div className="rounded-2xl border-2 border-dashed border-burgundy/20 bg-white p-4 sm:p-6 mb-4">
                                                    <QRCodeSVG
                                                        value={upiLink}
                                                        size={200}
                                                        level="H"
                                                        includeMargin
                                                        bgColor="#FFFFFF"
                                                        fgColor="#1a1a1a"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-[232px] w-[232px] rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 mb-4 p-6 text-center">
                                                    <p className="text-sm text-red-500">UPI payment is not configured yet. Please contact the store.</p>
                                                </div>
                                            )}

                                            {/* Amount */}
                                            <div className="rounded-lg bg-burgundy/5 px-6 py-3 mb-3">
                                                <p className="text-sm text-charcoal/60">Amount</p>
                                                <p className="text-2xl font-bold text-burgundy">₹{total.toFixed(2)}</p>
                                            </div>

                                            {/* UPI ID */}
                                            {upiId && (
                                                <p className="text-xs text-charcoal/40 mb-6">
                                                    UPI ID: <span className="font-mono font-medium text-charcoal/60">{upiId}</span>
                                                </p>
                                            )}

                                            {/* Transaction ID Input */}
                                            <div className="w-full max-w-sm space-y-3 border-t border-gray-100 pt-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-2 w-2 rounded-full bg-burgundy animate-pulse"></div>
                                                    <h4 className="text-sm font-medium text-charcoal">After Payment</h4>
                                                </div>
                                                <p className="text-xs text-charcoal/50 text-left">
                                                    After completing the payment via your UPI app, enter the <strong>Transaction ID</strong> or <strong>UTR number</strong> from the payment confirmation below.
                                                </p>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={upiTransactionId}
                                                        onChange={(e) => setUpiTransactionId(e.target.value)}
                                                        placeholder="e.g. 412345678901"
                                                        className={`w-full rounded-lg border bg-white px-4 py-3 text-charcoal text-sm placeholder:text-charcoal/30 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy ${!isUpiValid ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                                                            }`}
                                                    />
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-medium text-charcoal/50">
                                                        UPI Transaction ID / UTR *
                                                    </label>
                                                </div>
                                                {!isUpiValid && (
                                                    <p className="text-xs text-red-500 text-left">Transaction ID is required to place order.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'cod' && (
                                    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="mb-4 rounded-full bg-green-50 p-4">
                                            <Banknote className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="mb-2 font-medium text-charcoal">Cash on Delivery</h3>
                                        <p className="max-w-xs text-sm text-charcoal/60 mb-4">
                                            Pay with cash when your beautiful flowers are delivered to your doorstep.
                                        </p>
                                        <div className="rounded-lg bg-green-50 px-6 py-3">
                                            <p className="text-sm text-green-700/70">Amount to pay on delivery</p>
                                            <p className="text-2xl font-bold text-green-700">₹{total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Secure Badge Footer */}
                                <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                                    <div className="flex items-center justify-center gap-2 text-charcoal/50">
                                        <Lock className="h-3 w-3" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Payments are Secure &amp; Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Actions (Desktop) */}
                        <div className="hidden pt-4 lg:block">
                            <button
                                type="submit"
                                disabled={isSubmitting || items.length === 0 || (paymentMethod === 'upi' && !isUpiValid)}
                                className="group relative w-full overflow-hidden rounded-xl bg-burgundy py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                                <span className="relative flex items-center justify-center gap-2 font-medium tracking-wide">
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4" />
                                            Place Order — ₹{total.toFixed(2)}
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-xl lg:p-8">
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
                                                <p className="font-medium text-charcoal">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="my-6 h-px w-full bg-burgundy/10" />

                            <div className="space-y-3 text-sm text-charcoal/80">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                            </div>

                            <div className="my-6 h-px w-full bg-burgundy/10" />

                            <div className="flex items-baseline justify-between">
                                <span className="font-serif text-xl font-medium text-charcoal">Total</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-charcoal/50">INR</span>
                                    <span className="text-2xl font-bold text-charcoal">₹{total.toFixed(2)}</span>
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
                        disabled={isSubmitting || items.length === 0 || (paymentMethod === 'upi' && !isUpiValid)}
                        className="w-full btn-primary h-12 sm:h-14 text-sm sm:text-base shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Processing...' : `Place Order — ₹${total.toFixed(2)}`}
                    </button>
                </div>

            </div>
        </div>
    );
}
