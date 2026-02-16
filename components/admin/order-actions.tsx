"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus, cancelOrder } from "@/app/admin/actions";

const STATUSES = [
    { value: "placed", label: "Placed" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "dispatched", label: "Dispatched" },
    { value: "delivered", label: "Delivered" },
];

export default function OrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setError(null);
        startTransition(async () => {
            const result = await updateOrderStatus(orderId, e.target.value);
            if (result.error) setError(result.error);
        });
    };

    const handleCancel = () => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        setError(null);
        startTransition(async () => {
            const result = await cancelOrder(orderId);
            if (result.error) setError(result.error);
        });
    };

    if (currentStatus === "cancelled" || currentStatus === "delivered") {
        return (
            <span className="text-xs text-charcoal/40 capitalize">{currentStatus}</span>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isPending}
                className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:border-burgundy disabled:opacity-50 cursor-pointer"
            >
                {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
            </select>
            <button
                onClick={handleCancel}
                disabled={isPending}
                className="text-xs px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
                Cancel
            </button>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
