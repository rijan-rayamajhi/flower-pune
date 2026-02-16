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

const FlowerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    price: z.number().min(0, "Price must be positive"),
    color_class: z.string().default("bg-pink-300"),
    display_order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
});

// ─── Image Upload ────────────────────────────────────────────────────────────

async function uploadFlowerImage(imageFile: File, slug: string): Promise<string | null> {
    if (!imageFile || imageFile.size === 0) return null;
    if (!imageFile.type.startsWith("image/")) return null;
    if (imageFile.size > 5 * 1024 * 1024) return null;

    const adminClient = createAdminClient();
    const ext = imageFile.name.split(".").pop() || "jpg";
    const filePath = `flowers/${slug}/${Date.now()}.${ext}`;

    const { error: uploadError } = await adminClient.storage
        .from("product-images")
        .upload(filePath, imageFile, {
            contentType: imageFile.type,
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        console.error("Flower image upload error:", uploadError);
        return null;
    }

    const { data: urlData } = adminClient.storage
        .from("product-images")
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}

// ─── CRUD Actions ────────────────────────────────────────────────────────────

export async function createFlower(formData: FormData) {
    const { error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const adminClient = createAdminClient();

    // Handle image upload
    const imageFile = formData.get("image_file") as File | null;
    let imageUrl = (formData.get("image_url") as string) || null;

    const raw = Object.fromEntries(formData.entries());
    const slug = (raw.slug as string) || "";

    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadFlowerImage(imageFile, slug);
        if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const parsed = FlowerSchema.safeParse({
        ...raw,
        price: Number(raw.price || 0),
        display_order: Number(raw.display_order || 0),
        is_active: raw.is_active !== "false",
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { error } = await adminClient.from("flowers").insert({
        ...parsed.data,
        image_url: imageUrl,
    });

    if (error) {
        console.error("Error creating flower:", error);
        if (error.code === "23505") return { error: "A flower with this slug already exists" };
        return { error: "Failed to create flower" };
    }

    revalidatePath("/admin/flowers");
    revalidatePath("/customize");
    return { success: true };
}

export async function updateFlower(flowerId: string, formData: FormData) {
    const { error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const adminClient = createAdminClient();

    // Handle image upload
    const imageFile = formData.get("image_file") as File | null;
    let imageUrl = (formData.get("image_url") as string) || null;

    const raw = Object.fromEntries(formData.entries());
    const slug = (raw.slug as string) || "";

    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadFlowerImage(imageFile, slug);
        if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const parsed = FlowerSchema.safeParse({
        ...raw,
        price: Number(raw.price || 0),
        display_order: Number(raw.display_order || 0),
        is_active: raw.is_active !== "false",
    });

    if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

    const { error } = await adminClient
        .from("flowers")
        .update({ ...parsed.data, image_url: imageUrl })
        .eq("id", flowerId);

    if (error) {
        console.error("Error updating flower:", error);
        return { error: "Failed to update flower" };
    }

    revalidatePath("/admin/flowers");
    revalidatePath(`/admin/flowers/${flowerId}`);
    revalidatePath("/customize");
    return { success: true };
}

export async function deleteFlower(flowerId: string) {
    const { error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const adminClient = createAdminClient();

    const { error } = await adminClient
        .from("flowers")
        .delete()
        .eq("id", flowerId);

    if (error) {
        console.error("Error deleting flower:", error);
        return { error: "Failed to delete flower" };
    }

    revalidatePath("/admin/flowers");
    revalidatePath("/customize");
    return { success: true };
}

export async function toggleFlowerActive(flowerId: string, currentActive: boolean) {
    const { error: authError } = await verifyAdmin();
    if (authError) return { error: authError };

    const adminClient = createAdminClient();

    const { error } = await adminClient
        .from("flowers")
        .update({ is_active: !currentActive })
        .eq("id", flowerId);

    if (error) {
        console.error("Error toggling flower:", error);
        return { error: "Failed to toggle flower" };
    }

    revalidatePath("/admin/flowers");
    revalidatePath("/customize");
    return { success: true };
}
