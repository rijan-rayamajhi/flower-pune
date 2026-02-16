"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign up with email and password.
 * The database trigger handles profile creation and role assignment automatically.
 */
export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone: phone || undefined,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/login?registered=true");
}

/**
 * Sign in with email and password.
 */
export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // Check if the user is an admin to redirect accordingly
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

    revalidatePath("/", "layout");
    redirect(profile?.role === "admin" ? "/admin" : "/account");
}

/**
 * Sign out and redirect to home.
 */
export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}

/**
 * Send password reset email.
 */
export async function resetPassword(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : "http://localhost:3000"}/account`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: "Check your email for a password reset link." };
}
