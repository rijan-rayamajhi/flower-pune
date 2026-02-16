"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Edit2, Trash2, Power } from "lucide-react";
import { deleteFlower, toggleFlowerActive } from "./actions";
import type { AdminFlower } from "@/lib/supabase/flower-queries";

export default function FlowerListActions({ flower }: { flower: AdminFlower }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleFlowerActive(flower.id, flower.is_active);
        });
    };

    const handleDelete = () => {
        if (!confirm(`Delete "${flower.name}"? This cannot be undone.`)) return;
        startTransition(async () => {
            await deleteFlower(flower.id);
        });
    };

    return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
                href={`/admin/flowers/${flower.id}`}
                className="p-2 text-charcoal/40 hover:text-burgundy hover:bg-burgundy/5 rounded-full transition-colors"
                title="Edit"
            >
                <Edit2 className="h-4 w-4" />
            </Link>
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`p-2 rounded-full transition-colors disabled:opacity-50 ${flower.is_active
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-charcoal/30 hover:bg-gray-100'
                    }`}
                title={flower.is_active ? "Deactivate" : "Activate"}
            >
                <Power className="h-4 w-4" />
            </button>
            <button
                onClick={handleDelete}
                disabled={isPending}
                className="p-2 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                title="Delete"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}
