"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FloatingInput } from "@/components/ui/floating-input";
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { login } from "@/app/(auth)/actions";

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If successful, the server action redirects — no need to handle here
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-ivory p-4">
            <FadeIn duration={0.6} className="w-full max-w-md">
                <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-luxury sm:p-12">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <Link
                            href="/"
                            className="font-serif text-2xl font-bold tracking-tight text-charcoal hover:text-burgundy transition-colors"
                        >
                            Flower Pune
                        </Link>
                        <h1 className="mt-6 font-serif text-3xl font-medium text-charcoal">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Please sign in to your account
                        </p>
                    </div>

                    {/* Success message after registration */}
                    {registered && (
                        <div className="mb-6 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                            Account created successfully! Please sign in.
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <FloatingInput
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            required
                        />

                        <div className="space-y-1">
                            <FloatingInput
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                required
                            />
                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-gray-400 hover:text-burgundy transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-burgundy px-4 py-3.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-burgundy/90 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-burgundy hover:text-burgundy/80 transition-colors underline decoration-transparent hover:decoration-burgundy/30 underline-offset-4"
                        >
                            Create one
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
