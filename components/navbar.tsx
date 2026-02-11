"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Shop", href: "/shop" },
        { label: "Occasions", href: "/occasions" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md shadow-sm h-[72px]"
                        : "bg-transparent h-[88px]"
                )}
            >
                <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-serif text-2xl font-bold tracking-tight text-charcoal hover:text-burgundy transition-colors"
                    >
                        Luxe Floral
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="group relative text-sm font-medium text-charcoal/80 hover:text-charcoal transition-colors"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-burgundy transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <button className="text-charcoal/80 hover:text-burgundy transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="hidden md:block text-charcoal/80 hover:text-burgundy transition-colors">
                            <User className="h-5 w-5" />
                        </button>
                        <button className="relative text-charcoal/80 hover:text-burgundy transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[10px] font-medium text-white">
                                0
                            </span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-charcoal"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                className={cn(
                    "fixed top-0 right-0 z-[61] h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-serif text-xl font-bold text-charcoal">Menu</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-charcoal/60 hover:text-burgundy transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium text-charcoal hover:text-burgundy transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-6">
                        <Link
                            href="/account"
                            className="flex items-center gap-3 text-charcoal/80 hover:text-burgundy transition-colors"
                        >
                            <User className="h-5 w-5" />
                            <span>My Account</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
