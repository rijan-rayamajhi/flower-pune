"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { supabase, error: "Unauthorized" as const };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return { supabase, error: "Forbidden" as const };
    return { supabase, error: null };
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const OccasionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional().nullable(),
    subtitle: z.string().optional().nullable(),
    hero_image: z.string().optional().nullable(),
    display_order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
});

// ─── Image Upload Helper ─────────────────────────────────────────────────────

async function uploadOccasionImage(imageFile: File, slug: string): Promise<string | null> {
    if (!imageFile || imageFile.size === 0) return null;

    // Validate
    if (!imageFile.type.startsWith("image/")) return null;
    if (imageFile.size > 5 * 1024 * 1024) return null; // 5MB limit

    const adminClient = createAdminClient();
    const ext = imageFile.name.split(".").pop() || "jpg";
    const filePath = `occasions/${slug}/${Date.now()}.${ext}`;

    const { error: uploadError } = await adminClient.storage
        .from("product-images")
        .upload(filePath, imageFile, {
            contentType: imageFile.type,
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        console.error("Occasion image upload error:", uploadError);
        return null;
    }

    const { data: urlData } = adminClient.storage
        .from("product-images")
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}

// ─── CRUD Actions ────────────────────────────────────────────────────────────

export async function createOccasion(formData: FormData) {
    const { supabase, error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    // Handle image upload first
    const imageFile = formData.get("hero_image_file") as File | null;
    let heroImageUrl = (formData.get("hero_image") as string) || null;

    const raw = Object.fromEntries(formData.entries());
    const slug = (raw.slug as string) || "";

    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadOccasionImage(imageFile, slug);
        if (uploadedUrl) {
            heroImageUrl = uploadedUrl;
        }
    }

    const parsed = OccasionSchema.safeParse({
        ...raw,
        hero_image: heroImageUrl,
        display_order: Number(raw.display_order || 0),
        is_active: raw.is_active !== "false",
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { error } = await supabase.from("occasions").insert(parsed.data);

    if (error) {
        console.error("Error creating occasion:", error);
        if (error.code === "23505") return { error: "An occasion with this slug already exists" };
        return { error: "Failed to create occasion" };
    }

    revalidatePath("/admin/occasions");
    return { success: true };
}

export async function updateOccasion(occasionId: string, formData: FormData) {
    const { supabase, error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    // Handle image upload
    const imageFile = formData.get("hero_image_file") as File | null;
    let heroImageUrl = (formData.get("hero_image") as string) || null;

    const raw = Object.fromEntries(formData.entries());
    const slug = (raw.slug as string) || "";

    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadOccasionImage(imageFile, slug);
        if (uploadedUrl) {
            heroImageUrl = uploadedUrl;
        }
    }

    const parsed = OccasionSchema.safeParse({
        ...raw,
        hero_image: heroImageUrl,
        display_order: Number(raw.display_order || 0),
        is_active: raw.is_active !== "false",
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { error } = await supabase
        .from("occasions")
        .update(parsed.data)
        .eq("id", occasionId);

    if (error) {
        console.error("Error updating occasion:", error);
        return { error: "Failed to update occasion" };
    }

    revalidatePath("/admin/occasions");
    revalidatePath(`/admin/occasions/${occasionId}`);
    return { success: true };
}

export async function deleteOccasion(occasionId: string) {
    const { supabase, error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const { error } = await supabase
        .from("occasions")
        .delete()
        .eq("id", occasionId);

    if (error) {
        console.error("Error deleting occasion:", error);
        return { error: "Failed to delete occasion" };
    }

    revalidatePath("/admin/occasions");
    return { success: true };
}

export async function toggleOccasionActive(occasionId: string, currentActive: boolean) {
    const { supabase, error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const { error } = await supabase
        .from("occasions")
        .update({ is_active: !currentActive })
        .eq("id", occasionId);

    if (error) {
        console.error("Error toggling occasion:", error);
        return { error: "Failed to toggle occasion" };
    }

    revalidatePath("/admin/occasions");
    return { success: true };
}

// ─── Product Assignment ──────────────────────────────────────────────────────

export async function addProductToOccasion(occasionId: string, productId: string) {
    const { supabase, error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const { error } = await supabase
        .from("product_occasions")
        .insert({ occasion_id: occasionId, product_id: productId });

    if (error) {
        if (error.code === "23505") return { error: "Product already assigned to this occasion" };
        console.error("Error adding product to occasion:", error);
        return { error: "Failed to add product" };
    }

    revalidatePath(`/admin/occasions/${occasionId}`);
    return { success: true };
}

export async function removeProductFromOccasion(occasionId: string, productId: string) {
    const { supabase, error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const { error } = await supabase
        .from("product_occasions")
        .delete()
        .eq("occasion_id", occasionId)
        .eq("product_id", productId);

    if (error) {
        console.error("Error removing product from occasion:", error);
        return { error: "Failed to remove product" };
    }

    revalidatePath(`/admin/occasions/${occasionId}`);
    return { success: true };
}
