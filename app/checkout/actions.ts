"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// ─── Input validation schema ────────────────────────────────────────────────
const OrderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
    items: z.array(OrderItemSchema).min(1, "Cart cannot be empty"),
    shipping: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        address: z.string().min(1),
        apartment: z.string().optional(),
        city: z.string().min(1),
        state: z.string().default("Maharashtra"),
        postalCode: z.string().length(6),
        phone: z.string().length(10),
        email: z.string().email(),
    }),
    deliveryDate: z.string().min(1),
    deliverySlot: z.string().min(1),
    paymentMethod: z.enum(["upi", "cod"]),
    upiTransactionId: z.string().optional(),
    notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export type CreateOrderResult =
    | { success: true; orderNumber: string }
    | { success: false; error: string };

// ─── Server Action ──────────────────────────────────────────────────────────
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    try {
        // 1. Validate input
        const parsed = CreateOrderSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
        }
        const data = parsed.data;

        // 1b. If UPI, transaction ID is required
        if (data.paymentMethod === "upi" && (!data.upiTransactionId || data.upiTransactionId.trim().length === 0)) {
            return { success: false, error: "UPI Transaction ID is required for UPI payments." };
        }

        // 2. Verify authentication
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "You must be logged in to place an order." };
        }

        // 3. Build RPC parameters
        const shippingJson = {
            full_name: `${data.shipping.firstName} ${data.shipping.lastName}`,
            phone: data.shipping.phone,
            address: data.shipping.apartment
                ? `${data.shipping.address}, ${data.shipping.apartment}`
                : data.shipping.address,
            city: data.shipping.city,
            state: data.shipping.state,
            pincode: data.shipping.postalCode,
        };

        const itemsJson = data.items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
        }));

        // 4. Call RPC (atomic transaction in Postgres)
        const { data: result, error: rpcError } = await supabase.rpc(
            "create_order_with_items",
            {
                p_user_id: user.id,
                p_shipping: shippingJson,
                p_delivery_date: data.deliveryDate,
                p_delivery_slot: data.deliverySlot,
                p_payment_method: data.paymentMethod,
                p_notes: data.notes || null,
                p_items: itemsJson,
                p_upi_transaction_id: data.upiTransactionId || null,
            }
        );

        if (rpcError) {
            console.error("[createOrder] RPC error:", rpcError);

            // Surface user-friendly messages for known errors
            if (rpcError.message.includes("Cart is empty")) {
                return { success: false, error: "Your cart is empty." };
            }
            if (rpcError.message.includes("Product not found")) {
                return { success: false, error: "One or more items in your cart are no longer available." };
            }
            if (rpcError.message.includes("Insufficient stock")) {
                return { success: false, error: rpcError.message.replace(/^.*Insufficient stock/, "Insufficient stock") };
            }

            return { success: false, error: "Failed to create order. Please try again." };
        }

        // 5. Return the order number
        return {
            success: true,
            orderNumber: (result as { order_number: string }).order_number,
        };
    } catch (err) {
        console.error("[createOrder] Unexpected error:", err);
        return { success: false, error: "An unexpected error occurred. Please try again." };
    }
}
