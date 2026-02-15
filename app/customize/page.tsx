"use client";

import { useState, useEffect } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check, AlertCircle, Calendar, Clock, MapPin, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useCart, CartItem } from "@/context/cart-context";

// --- Mock Data ---
type FlowerId = 'rose_red' | 'lily_white' | 'tulip_pink' | 'sunflower' | 'orchid' | 'daisy';

interface Flower {
    id: FlowerId;
    name: string;
    price: number;
    image: string;
    color: string;
}

const AVAILABLE_FLOWERS: Flower[] = [
    { id: 'rose_red', name: 'Red Roses', price: 5, image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop', color: 'bg-red-500' },
    { id: 'lily_white', name: 'White Lilies', price: 7, image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?q=80&w=400&auto=format&fit=crop', color: 'bg-white border border-gray-200' },
    { id: 'tulip_pink', name: 'Pink Tulips', price: 4, image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=400&auto=format&fit=crop', color: 'bg-pink-400' },
    { id: 'sunflower', name: 'Sunflowers', price: 6, image: 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=400&auto=format&fit=crop', color: 'bg-yellow-400' },
    { id: 'orchid', name: 'Purple Orchids', price: 12, image: 'https://images.unsplash.com/photo-1534885320675-b08aa131cc5e?q=80&w=400&auto=format&fit=crop', color: 'bg-purple-500' },
    { id: 'daisy', name: 'White Daisies', price: 3, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=400&auto=format&fit=crop', color: 'bg-yellow-100' },
];

// --- Schema ---
const customizeSchema = z.object({
    flowers: z.record(z.string(), z.number()), // { [flowerId]: quantity }
    deliveryDate: z.string().min(1, "Delivery date is required"),
    deliverySlot: z.string().min(1, "Delivery slot is required"),
    pincode: z.string().length(6, "Pincode must be 6 digits"),
    message: z.string().optional(),
});

type CustomizeFormValues = z.infer<typeof customizeSchema>;

export default function CustomizePage() {
    const { addToCart, openCart } = useCart();
    const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
    const [pincodeMessage, setPincodeMessage] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const form = useForm<CustomizeFormValues>({
        resolver: zodResolver(customizeSchema),
        defaultValues: {
            flowers: AVAILABLE_FLOWERS.reduce((acc, flower) => ({ ...acc, [flower.id]: 0 }), {} as Record<string, number>),
            deliveryDate: "",
            deliverySlot: "",
            pincode: "",
            message: "",
        },
    });

    const { register, watch, setValue, handleSubmit, formState: { errors } } = form;
    // eslint-disable-next-line react-hooks/incompatible-library
    const flowers = watch("flowers") || {};
    const pincode = watch("pincode");

    // Calculate Total Price
    const totalPrice = AVAILABLE_FLOWERS.reduce((total, flower) => {
        const qty = (flowers as Record<string, number>)[flower.id] || 0;
        return total + (flower.price * qty);
    }, 0);

    const totalItems = Object.values(flowers as Record<string, number>).reduce((a: number, b: number) => a + b, 0);

    // Pincode Validation Effect
    useEffect(() => {
        if (pincode && pincode.length === 6) {
            setPincodeStatus('checking');
            const timer = setTimeout(() => {
                if (['110001', '400001', '560001', '411001', '123456'].includes(pincode)) {
                    setPincodeStatus('valid');
                    setPincodeMessage("Delivery available.");
                } else {
                    setPincodeStatus('invalid');
                    setPincodeMessage("Not available in this area.");
                }
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setPincodeStatus('idle');
            setPincodeMessage("");
        }
    }, [pincode]);

    const handleQuantityChange = (flowerId: string, delta: number) => {
        const currentQty = (flowers as Record<string, number>)[flowerId] || 0;
        const newQty = Math.max(0, currentQty + delta);
        // Using Path type to fix the TS error for template literal paths
        setValue(`flowers.${flowerId}` as Path<CustomizeFormValues>, newQty);
    };

    const onSubmit = async (data: CustomizeFormValues) => {
        if (totalItems === 0) return;

        setIsAdding(true);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 800));

        // Create description string
        const description = AVAILABLE_FLOWERS
            .filter(f => ((data.flowers as Record<string, number>)[f.id] || 0) > 0)
            .map(f => `${(data.flowers as Record<string, number>)[f.id]}x ${f.name}`)
            .join(", ");

        const customProduct: CartItem = {
            id: `custom-${Date.now()}`,
            title: "Custom Bouquet",
            price: totalPrice,
            image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop", // Generic custom bouquet image
            quantity: 1,
            description: description,
            category: 'Custom',
            href: '/customize',
            occasions: ['custom']
        };

        addToCart(customProduct);

        setIsAdding(false);
        openCart();
    };

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <div className="container-page py-8 sm:py-12">

                <div className="mb-8 sm:mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block rounded-full bg-burgundy/5 px-4 py-1.5 text-sm font-medium text-burgundy mb-4"
                    >
                        Create Your Own
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-serif text-charcoal md:text-5xl"
                    >
                        Build Your Dream Bouquet
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-charcoal/60"
                    >
                        Select your favorite blooms and we&apos;ll arrange them into a masterpiece just for you.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12">

                    {/* Left Column: Flower Selection */}
                    <div className="lg:col-span-8 space-y-8">
                        <section>
                            <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-4 sm:mb-6 flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-burgundy text-white text-sm font-sans">1</span>
                                Choose Your Blooms
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {AVAILABLE_FLOWERS.map((flower) => (
                                    <motion.div
                                        key={flower.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border bg-white p-3 sm:p-4 transition-all hover:shadow-lg ${flowers[flower.id] > 0 ? 'border-burgundy ring-1 ring-burgundy' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl">
                                                <Image
                                                    src={flower.image}
                                                    alt={flower.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-charcoal text-lg">{flower.name}</h3>
                                                <p className="text-burgundy font-medium">${flower.price} <span className="text-charcoal/40 text-sm font-normal">/ stem</span></p>

                                                <div className="mt-3 flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(flower.id, -1)}
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${flowers[flower.id] > 0
                                                            ? 'border-gray-300 text-charcoal hover:border-burgundy hover:text-burgundy'
                                                            : 'border-gray-100 text-gray-300 cursor-not-allowed'
                                                            }`}
                                                        disabled={!flowers[flower.id]}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="min-w-[1.5rem] text-center font-medium text-charcoal">
                                                        {flowers[flower.id] || 0}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(flower.id, 1)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-charcoal transition-colors hover:border-burgundy hover:bg-burgundy hover:text-white"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-4 sm:mb-6 flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-burgundy text-white text-sm font-sans">2</span>
                                Delivery Details
                            </h2>
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-sm space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="text-sm font-medium text-charcoal/80 mb-1.5 block">Delivery Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                min={today}
                                                {...register("deliveryDate")}
                                                className={`w-full rounded-lg border bg-white px-4 py-3 text-charcoal focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy ${errors.deliveryDate ? "border-red-500" : "border-gray-200"
                                                    }`}
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/40 pointer-events-none" />
                                        </div>
                                        {errors.deliveryDate && <p className="mt-1 text-xs text-red-500">{errors.deliveryDate.message}</p>}
                                    </div>

                                    <div className="relative">
                                        <label className="text-sm font-medium text-charcoal/80 mb-1.5 block">Time Slot</label>
                                        <div className="relative">
                                            <select
                                                {...register("deliverySlot")}
                                                className={`w-full appearance-none rounded-lg border bg-white px-4 py-3 text-charcoal focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy ${errors.deliverySlot ? "border-red-500" : "border-gray-200"
                                                    }`}
                                            >
                                                <option value="" disabled hidden>Select a slot</option>
                                                <option value="Morning">Morning (9 AM - 12 PM)</option>
                                                <option value="Afternoon">Afternoon (1 PM - 5 PM)</option>
                                                <option value="Evening">Evening (6 PM - 9 PM)</option>
                                            </select>
                                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/40 pointer-events-none" />
                                        </div>
                                        {errors.deliverySlot && <p className="mt-1 text-xs text-red-500">{errors.deliverySlot.message}</p>}
                                    </div>

                                    <div className="relative">
                                        <label className="text-sm font-medium text-charcoal/80 mb-1.5 block">Pincode Check</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="e.g. 123456"
                                                {...register("pincode")}
                                                className={`w-full rounded-lg border bg-white px-4 py-3 text-charcoal focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy ${errors.pincode ? "border-red-500" : "border-gray-200"
                                                    }`}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                {pincodeStatus === 'checking' && <span className="text-xs text-charcoal/60 animate-pulse">Checking...</span>}
                                                {pincodeStatus === 'valid' && <Check className="h-5 w-5 text-green-500" />}
                                                {pincodeStatus === 'invalid' && <AlertCircle className="h-5 w-5 text-red-500" />}
                                                {pincodeStatus === 'idle' && !pincode && <MapPin className="h-5 w-5 text-charcoal/40" />}
                                            </div>
                                        </div>
                                        {pincodeMessage && (
                                            <p className={`mt-1 text-xs ${pincodeStatus === 'valid' ? 'text-green-600' : pincodeStatus === 'invalid' ? 'text-red-500' : 'text-charcoal/60'}`}>
                                                {pincodeMessage}
                                            </p>
                                        )}
                                        {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode.message}</p>}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="text-sm font-medium text-charcoal/80 mb-1.5 block">Card Message (Optional)</label>
                                    <div className="relative">
                                        <textarea
                                            rows={3}
                                            placeholder="Write a lovely note..."
                                            {...register("message")}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-charcoal focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy resize-none"
                                        />
                                        <MessageSquare className="absolute right-3 top-3 h-5 w-5 text-charcoal/40 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary Sticky */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-xl border border-gray-100">
                                <h3 className="font-serif text-xl font-medium text-charcoal mb-6">Your Creation</h3>

                                {totalItems > 0 ? (
                                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                        {AVAILABLE_FLOWERS.map(flower => {
                                            const qty = flowers[flower.id] || 0;
                                            if (qty === 0) return null;
                                            return (
                                                <div key={flower.id} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${flower.color}`}></div>
                                                        <span className="text-charcoal/80">{flower.name} <span className="text-charcoal/40">x{qty}</span></span>
                                                    </div>
                                                    <span className="font-medium text-charcoal">${flower.price * qty}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="mb-6 py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                        <p className="text-charcoal/40 text-sm">No flowers selected yet</p>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-charcoal/60">Subtotal</span>
                                        <span className="font-medium text-charcoal">${totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-charcoal/40">
                                        <span>Arrangement Fee</span>
                                        <span>Included</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="font-serif text-xl text-charcoal">Total</span>
                                        <div className="text-right">
                                            <span className="text-xs text-charcoal/40 block mb-1">USD</span>
                                            <span className="text-2xl font-bold text-burgundy">${totalPrice}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={totalItems === 0 || isAdding || pincodeStatus === 'invalid' || pincodeStatus === 'checking'}
                                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAdding ? (
                                            <span className="animate-pulse">Adding to Cart...</span>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-5 h-5" />
                                                <span>Add to Cart</span>
                                                {totalItems > 0 && <span className="ml-1 bg-white/20 px-2 py-0.5 rounded text-xs">({totalItems} items)</span>}
                                            </>
                                        )}
                                    </button>

                                    {pincodeStatus === 'invalid' && (
                                        <p className="mt-3 text-xs text-center text-red-500">
                                            Please enter a valid delivery pincode to proceed.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 text-center text-xs text-charcoal/50">
                                <div className="p-2 bg-white rounded-lg border border-gray-100">
                                    <span className="block font-medium text-charcoal/80 mb-0.5">Fresh</span>
                                    Guaranteed
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-gray-100">
                                    <span className="block font-medium text-charcoal/80 mb-0.5">Hand</span>
                                    Arranged
                                </div>
                                <div className="p-2 bg-white rounded-lg border border-gray-100">
                                    <span className="block font-medium text-charcoal/80 mb-0.5">Secure</span>
                                    Checkout
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
