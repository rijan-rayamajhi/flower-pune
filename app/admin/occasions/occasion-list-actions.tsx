"use client";

import { useTransition } from "react";
import { toggleOccasionActive, deleteOccasion } from "./actions";
import Link from "next/link";

export default function OccasionListActions({ occasionId, isActive }: { occasionId: string; isActive: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleOccasionActive(occasionId, isActive);
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this occasion? This will also remove all product assignments.")) return;
        startTransition(async () => {
            await deleteOccasion(occasionId);
        });
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Link
                href={`/admin/occasions/${occasionId}`}
                className="text-xs px-2 py-1.5 text-burgundy hover:bg-burgundy/5 rounded-md transition-colors"
            >
                Edit
            </Link>
            <button
                onClick={handleToggle}
                disabled={isPending}
                className="text-xs px-2 py-1.5 text-charcoal/60 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
            >
                {isActive ? "Deactivate" : "Activate"}
            </button>
            <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
                Delete
            </button>
        </div>
    );
}
