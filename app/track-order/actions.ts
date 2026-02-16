"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const TrackOrderSchema = z.object({
    orderId: z.string().min(1),
    phoneNumber: z.string().min(10),
});

export type TrackOrderResult =
    | {
        success: true;
        order: {
            order_number: string;
            status: string;
            shipping_full_name: string;
            delivery_date: string | null;
            delivery_slot: string | null;
            shipping_address: string;
            shipping_city: string;
        };
    }
    | { success: false; error: string };

export async function trackOrder(input: z.infer<typeof TrackOrderSchema>): Promise<TrackOrderResult> {
    try {
        const parsed = TrackOrderSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: "Invalid input" };
        }

        const supabase = await createClient();

        // 1. Query for the order with a secure composite check
        // We do NOT use .single() immediately to avoid revealing if an order exists but phone is wrong (though RLS might handle that, simpler to be explicit)
        // Actually, for public tracking (unauthenticated), we need to bypass RLS or have a specific RPC/function.
        // Wait, standard RLS usually blocks public access to 'orders'.
        // If the user is NOT logged in, they can't see the order via standard `supabase.from('orders')` if RLS is "auth.uid() = user_id".
        // The requirement implies public tracking (without login).
        // WE NEED A SECURE WAY TO FETCH THIS.
        // Option A: Use `supabase.rpc` with a `security definer` function that takes order_id + phone.
        // Option B: Use the service role key (only on server). `createClient` uses the anon key by default.
        // I should probably use a new RPC function for public tracking to correspond with the "Protect against enumeration" requirement properly.
        //
        // Let's check `lib/supabase/server.ts` - it uses `createServerClient` with standard keys.
        // I'll create a new RPC function: `track_order_secure`

        const { data, error } = await supabase.rpc("track_order_secure", {
            p_order_number: input.orderId,
            p_phone: input.phoneNumber,
        });

        if (error) {
            console.error("Tracking Error:", error);
            // Generic error to prevent enumeration
            return { success: false, error: "Order not found or details incorrect." };
        }

        if (!data || data.length === 0) {
            return { success: false, error: "Order not found or details incorrect." };
        }

        // Return the first match (should be unique)
        return { success: true, order: data[0] };

    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
