"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Loader2 } from "lucide-react";

// Validation schema
const trackOrderSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
});

type TrackOrderFormData = z.infer<typeof trackOrderSchema>;

type OrderStatus = "Order Placed" | "Dispatched" | "Delivered";

export default function TrackOrderPage() {
    const [status, setStatus] = useState<OrderStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchedOrder, setSearchedOrder] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TrackOrderFormData>({
        resolver: zodResolver(trackOrderSchema),
    });

    const onSubmit = async (data: TrackOrderFormData) => {
        setIsLoading(true);
        setStatus(null);
        setSearchedOrder(null);

        // Simulate API call
        setTimeout(() => {
            const statuses: OrderStatus[] = ["Order Placed", "Dispatched", "Delivered"];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            setStatus(randomStatus);
            setSearchedOrder(data.orderId);
            setIsLoading(false);
        }, 1500);
    };

    const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
            case "Order Placed":
                return {
                    color: "bg-blue-100 text-blue-800 border-blue-200",
                    icon: <Package className="w-5 h-5" />,
                    message: "We have received your order and are preparing it with care."
                };
            case "Dispatched":
                return {
                    color: "bg-amber-100 text-amber-800 border-amber-200",
                    icon: <Truck className="w-5 h-5" />,
                    message: "Your order is on its way to you!"
                };
            case "Delivered":
                return {
                    color: "bg-green-100 text-green-800 border-green-200",
                    icon: <CheckCircle className="w-5 h-5" />,
                    message: "Your order has been delivered successfully."
                };
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-3">Track Your Order</h1>
                    <p className="text-[#7D7D7D]">Enter your order details below to check the current status.</p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E5E5]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="orderId" className="block text-sm font-medium text-[#1A1A1A] uppercase tracking-wide">
                                Order ID
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    {...register("orderId")}
                                    id="orderId"
                                    type="text"
                                    placeholder="e.g. FLR-2026-X8K9L"
                                    className={`w-full pl-10 pr-4 py-3 bg-[#F9F5F1] border ${errors.orderId ? 'border-red-500' : 'border-[#EBEBEB]'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5E2C2C] focus:border-[#5E2C2C] transition-all`}
                                />
                            </div>
                            {errors.orderId && (
                                <p className="text-red-500 text-xs mt-1">{errors.orderId.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#1A1A1A] uppercase tracking-wide">
                                Phone Number
                            </label>
                            <input
                                {...register("phoneNumber")}
                                id="phoneNumber"
                                type="tel"
                                placeholder="Enter your phone number"
                                className={`w-full px-4 py-3 bg-[#F9F5F1] border ${errors.phoneNumber ? 'border-red-500' : 'border-[#EBEBEB]'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5E2C2C] focus:border-[#5E2C2C] transition-all`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#5E2C2C] text-white py-3.5 rounded-lg font-medium hover:bg-[#4A2222] transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Tracking...</span>
                                </>
                            ) : (
                                "Track Order"
                            )}
                        </button>
                    </form>
                </div>

                <AnimatePresence mode="wait">
                    {status && searchedOrder && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white shadow-lg rounded-xl p-6 border border-[#E5E5E5] overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4 border-b border-[#F0F0F0] pb-3">
                                <div>
                                    <p className="text-xs text-[#7D7D7D] uppercase tracking-wider mb-1">Order ID</p>
                                    <p className="font-serif text-lg text-[#1A1A1A]">{searchedOrder}</p>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusConfig(status).color}`}>
                                    {getStatusConfig(status).icon}
                                    {status}
                                </div>
                            </div>

                            <p className="text-[#5E2C2C] text-sm font-medium">
                                {getStatusConfig(status).message}
                            </p>

                            <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${status === 'Order Placed' || status === 'Dispatched' || status === 'Delivered' ? 'bg-[#5E2C2C]' : 'bg-gray-200'}`}></div>
                                    <div className={`flex-1 h-0.5 ${status === 'Dispatched' || status === 'Delivered' ? 'bg-[#5E2C2C]' : 'bg-gray-200'}`}></div>
                                    <div className={`w-3 h-3 rounded-full ${status === 'Dispatched' || status === 'Delivered' ? 'bg-[#5E2C2C]' : 'bg-gray-200'}`}></div>
                                    <div className={`flex-1 h-0.5 ${status === 'Delivered' ? 'bg-[#5E2C2C]' : 'bg-gray-200'}`}></div>
                                    <div className={`w-3 h-3 rounded-full ${status === 'Delivered' ? 'bg-[#5E2C2C]' : 'bg-gray-200'}`}></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-[#7D7D7D] mt-1 uppercase tracking-wider">
                                    <span>Placed</span>
                                    <span>Dispatched</span>
                                    <span>Delivered</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
}
