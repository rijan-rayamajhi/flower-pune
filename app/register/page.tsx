"use client";

import Link from "next/link";
import { FloatingInput } from "@/components/ui/floating-input";
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
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
                            Create Account
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Join us for a premium floral experience
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <FloatingInput
                            id="fullName"
                            label="Full Name"
                            type="text"
                            autoComplete="name"
                            required
                        />

                        <FloatingInput
                            id="email"
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            required
                        />

                        <FloatingInput
                            id="phone"
                            label="Phone Number"
                            type="tel"
                            autoComplete="tel"
                        />

                        <FloatingInput
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            required
                        />

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-burgundy px-4 py-3.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-burgundy/90 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Create Account
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-burgundy hover:text-burgundy/80 transition-colors underline decoration-transparent hover:decoration-burgundy/30 underline-offset-4"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
