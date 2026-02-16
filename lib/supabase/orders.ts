import { createClient } from "@/lib/supabase/server";

export interface OrderWithItems {
    id: string;
    order_number: string;
    status: string;
    payment_status: string;
    subtotal: number;
    shipping_fee: number;
    discount: number;
    total: number;
    shipping_full_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_pincode: string;
    delivery_date: string | null;
    delivery_slot: string | null;
    notes: string | null;
    placed_at: string;
    order_items: {
        id: string;
        product_name: string;
        product_image: string | null;
        unit_price: number;
        quantity: number;
        line_total: number;
    }[];
}

/**
 * Fetch an order by its order_number, including order items.
 * Only returns orders that belong to the authenticated user (enforced by RLS).
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
            id, order_number, status, payment_status,
            subtotal, shipping_fee, discount, total,
            shipping_full_name, shipping_phone, shipping_address,
            shipping_city, shipping_state, shipping_pincode,
            delivery_date, delivery_slot, notes, placed_at,
            order_items (
                id, product_name, product_image, unit_price, quantity, line_total
            )
        `)
        .eq("order_number", orderNumber)
        .single();

    if (error) {
        console.warn("[orders] Supabase:", error.message || error.code);
        return null;
    }

    return data as OrderWithItems;
}
