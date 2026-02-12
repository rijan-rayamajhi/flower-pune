"use client";

import Link from "next/link";
import { FloatingInput } from "@/components/ui/floating-input";
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
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
                            Luxe Floral
                        </Link>
                        <h1 className="mt-6 font-serif text-3xl font-medium text-charcoal">
                            Reset Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Enter your email to receive recovery instructions
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <FloatingInput
                            id="email"
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            required
                        />

                        <button
                            type="submit"
                            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-burgundy px-4 py-3.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-burgundy/90 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Send Reset Link
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm">
                        <Link
                            href="/login"
                            className="group inline-flex items-center gap-2 font-medium text-gray-500 hover:text-charcoal transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
