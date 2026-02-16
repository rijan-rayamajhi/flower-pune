"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Order Actions ───────────────────────────────────────────────────────────

const UpdateStatusSchema = z.object({
    orderId: z.string().uuid(),
    status: z.enum(["placed", "confirmed", "preparing", "dispatched", "delivered", "cancelled"]),
});

export async function updateOrderStatus(orderId: string, status: string) {
    const parsed = UpdateStatusSchema.safeParse({ orderId, status });
    if (!parsed.success) return { error: "Invalid input" };

    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return { error: "Forbidden" };

    const { error } = await supabase
        .from("orders")
        .update({ status: parsed.data.status })
        .eq("id", parsed.data.orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { error: "Failed to update order status" };
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
}

export async function cancelOrder(orderId: string) {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return { error: "Forbidden" };

    // Call RPC to cancel order + restore stock atomically
    const { error } = await supabase.rpc("cancel_order_restore_stock", {
        p_order_id: orderId,
    });

    if (error) {
        console.error("Error cancelling order:", error);
        if (error.message.includes("already cancelled")) return { error: "Order is already cancelled" };
        if (error.message.includes("delivered")) return { error: "Cannot cancel a delivered order" };
        return { error: "Failed to cancel order" };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin");
    return { success: true };
}

// ─── Product Actions ─────────────────────────────────────────────────────────

const ProductSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    short_description: z.string().optional(),
    price: z.number().min(0),
    compare_at_price: z.number().min(0).optional().nullable(),
    sku: z.string().optional().nullable(),
    stock_quantity: z.number().int().min(0),
    category_id: z.string().uuid().optional().nullable(),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
});

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    const raw = Object.fromEntries(formData.entries());
    const parsed = ProductSchema.safeParse({
        ...raw,
        price: Number(raw.price),
        compare_at_price: raw.compare_at_price ? Number(raw.compare_at_price) : null,
        stock_quantity: Number(raw.stock_quantity || 0),
        is_active: raw.is_active === "true",
        is_featured: raw.is_featured === "true",
        category_id: raw.category_id || null,
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { data: product, error } = await supabase
        .from("products")
        .insert(parsed.data)
        .select("id")
        .single();

    if (error) {
        console.error("Error creating product:", error);
        if (error.code === "23505") return { error: "A product with this slug already exists" };
        return { error: "Failed to create product" };
    }

    // Handle image upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0 && product) {
        // Validate file type and size (5MB limit)
        if (!imageFile.type.startsWith("image/")) {
            return { success: true, productId: product.id, warning: "Product created, but image was rejected (invalid type)" };
        }
        if (imageFile.size > 5 * 1024 * 1024) {
            return { success: true, productId: product.id, warning: "Product created, but image was rejected (file too large > 5MB)" };
        }

        const adminClient = createAdminClient();
        const ext = imageFile.name.split(".").pop();
        const filePath = `${product.id}/${Date.now()}.${ext}`;

        const { error: uploadError } = await adminClient.storage
            .from("product-images")
            .upload(filePath, imageFile, {
                contentType: imageFile.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return {
                success: true,
                productId: product.id,
                warning: `Product created, but image upload failed: ${uploadError.message}. Make sure you have created the 'product-images' bucket.`
            };
        }

        const { data: urlData } = adminClient.storage
            .from("product-images")
            .getPublicUrl(filePath);

        const { error: dbImageError } = await adminClient.from("product_images").insert({
            product_id: product.id,
            image_url: urlData.publicUrl,
            is_primary: true,
        });

        if (dbImageError) {
            console.error("Database image error:", dbImageError);
            return { success: true, productId: product.id, warning: "Product created and image uploaded, but failed to link image to product in database." };
        }
    }

    revalidatePath("/admin/products");
    return { success: true, productId: product?.id };
}

export async function updateProduct(productId: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    const raw = Object.fromEntries(formData.entries());
    const parsed = ProductSchema.safeParse({
        ...raw,
        price: Number(raw.price),
        compare_at_price: raw.compare_at_price ? Number(raw.compare_at_price) : null,
        stock_quantity: Number(raw.stock_quantity || 0),
        is_active: raw.is_active === "true",
        is_featured: raw.is_featured === "true",
        category_id: raw.category_id || null,
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { error } = await supabase
        .from("products")
        .update(parsed.data)
        .eq("id", productId);

    if (error) {
        console.error("Error updating product:", error);
        return { error: "Failed to update product" };
    }

    // Handle new image upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
        // Validate file type and size (5MB limit)
        if (!imageFile.type.startsWith("image/")) {
            return { success: true, warning: "Product updated, but image was rejected (invalid type)" };
        }
        if (imageFile.size > 5 * 1024 * 1024) {
            return { success: true, warning: "Product updated, but image was rejected (file too large > 5MB)" };
        }

        const adminClient = createAdminClient();
        const ext = imageFile.name.split(".").pop();
        const filePath = `${productId}/${Date.now()}.${ext}`;

        const { error: uploadError } = await adminClient.storage
            .from("product-images")
            .upload(filePath, imageFile, {
                contentType: imageFile.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return {
                success: true,
                warning: `Product updated, but image upload failed: ${uploadError.message}.`
            };
        }

        const { data: urlData } = adminClient.storage
            .from("product-images")
            .getPublicUrl(filePath);

        // Set all existing images to non-primary
        await adminClient
            .from("product_images")
            .update({ is_primary: false })
            .eq("product_id", productId);

        const { error: dbImageError } = await adminClient.from("product_images").insert({
            product_id: productId,
            image_url: urlData.publicUrl,
            is_primary: true,
        });

        if (dbImageError) {
            console.error("Database image error:", dbImageError);
            return { success: true, warning: "Product updated and image uploaded, but failed to link image in database." };
        }
    }

    revalidatePath("/admin/products");
    return { success: true };
}

export async function toggleProductActive(productId: string, currentActive: boolean) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    const { error } = await supabase
        .from("products")
        .update({ is_active: !currentActive })
        .eq("id", productId);

    if (error) {
        console.error("Error toggling product:", error);
        return { error: "Failed to toggle product status" };
    }

    revalidatePath("/admin/products");
    return { success: true };
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
        console.error("Error deleting product:", error);
        return { error: "Failed to delete product" };
    }

    revalidatePath("/admin/products");
    return { success: true };
}

// ─── Category Actions ────────────────────────────────────────────────────────

const CategorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    display_order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
});

export async function createCategory(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    const raw = Object.fromEntries(formData.entries());
    const parsed = CategorySchema.safeParse({
        ...raw,
        display_order: Number(raw.display_order || 0),
        is_active: raw.is_active !== "false",
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { error } = await supabase.from("categories").insert(parsed.data);

    if (error) {
        console.error("Error creating category:", error);
        if (error.code === "23505") return { error: "A category with this slug already exists" };
        return { error: "Failed to create category" };
    }

    revalidatePath("/admin/categories");
    return { success: true };
}

export async function updateCategory(categoryId: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    const raw = Object.fromEntries(formData.entries());
    const parsed = CategorySchema.safeParse({
        ...raw,
        display_order: Number(raw.display_order || 0),
        is_active: raw.is_active !== "false",
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { error } = await supabase
        .from("categories")
        .update(parsed.data)
        .eq("id", categoryId);

    if (error) {
        console.error("Error updating category:", error);
        return { error: "Failed to update category" };
    }

    revalidatePath("/admin/categories");
    return { success: true };
}

export async function deleteCategory(categoryId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    // Check if any products use this category
    const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", categoryId);

    if (count && count > 0) {
        return { error: `Cannot delete: ${count} product(s) use this category` };
    }

    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

    if (error) {
        console.error("Error deleting category:", error);
        return { error: "Failed to delete category" };
    }

    revalidatePath("/admin/categories");
    return { success: true };
}
