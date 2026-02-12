"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
    return (
        <footer className="w-full bg-charcoal text-ivory pt-20 pb-10">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

                {/* Top Section: Branding, Socials & Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-serif text-ivory mb-4">Stay in Bloom</h2>
                        <p className="text-ivory/80 text-sm font-light leading-relaxed mb-6">
                            Subscribe to our newsletter for exclusive offers, floral inspiration, and care tips delivered to your inbox.
                        </p>

                        <form className="flex w-full max-w-sm items-center border-b border-ivory/30 pb-2 transition-colors focus-within:border-champagne">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-transparent p-0 text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-0 sm:text-sm"
                            />
                            <button
                                type="button"
                                className="ml-2 text-ivory hover:text-champagne transition-colors"
                                aria-label="Subscribe"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-ivory/80 hover:text-champagne transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Link>
                        <Link href="#" className="text-ivory/80 hover:text-champagne transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <Facebook className="h-5 w-5" />
                            <span className="sr-only">Facebook</span>
                        </Link>
                        <Link href="#" className="text-ivory/80 hover:text-champagne transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                    </div>
                </div>

                {/* Middle Section: Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
                    {/* Column 1: Shop */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-serif text-lg text-ivory">Shop</h3>
                        <ul className="flex flex-col gap-2 text-sm text-ivory/70">
                            <li><Link href="/shop/all" className="hover:text-champagne transition-colors">All Collections</Link></li>
                            <li><Link href="/shop/new-arrivals" className="hover:text-champagne transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop/best-sellers" className="hover:text-champagne transition-colors">Best Sellers</Link></li>
                            <li><Link href="/shop/subscriptions" className="hover:text-champagne transition-colors">Subscriptions</Link></li>
                            <li><Link href="/shop/gift-cards" className="hover:text-champagne transition-colors">Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Occasions */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-serif text-lg text-ivory">Occasions</h3>
                        <ul className="flex flex-col gap-2 text-sm text-ivory/70">
                            <li><Link href="/occasions/birthday" className="hover:text-champagne transition-colors">Birthday</Link></li>
                            <li><Link href="/occasions/anniversary" className="hover:text-champagne transition-colors">Anniversary</Link></li>
                            <li><Link href="/occasions/wedding" className="hover:text-champagne transition-colors">Wedding</Link></li>
                            <li><Link href="/occasions/sympathy" className="hover:text-champagne transition-colors">Sympathy</Link></li>
                            <li><Link href="/occasions/just-because" className="hover:text-champagne transition-colors">Just Because</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-serif text-lg text-ivory">Company</h3>
                        <ul className="flex flex-col gap-2 text-sm text-ivory/70">
                            <li><Link href="/about" className="hover:text-champagne transition-colors">About Us</Link></li>
                            <li><Link href="/our-story" className="hover:text-champagne transition-colors">Our Story</Link></li>
                            <li><Link href="/sustainability" className="hover:text-champagne transition-colors">Sustainability</Link></li>
                            <li><Link href="/careers" className="hover:text-champagne transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-champagne transition-colors">Journal</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Support */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-serif text-lg text-ivory">Support</h3>
                        <ul className="flex flex-col gap-2 text-sm text-ivory/70">
                            <li><Link href="/help" className="hover:text-champagne transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-champagne transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-champagne transition-colors">Shipping & Delivery</Link></li>
                            <li><Link href="/returns" className="hover:text-champagne transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/privacy" className="hover:text-champagne transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-champagne/30 mb-8" />

                {/* Bottom Section: Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ivory/50">
                    <p>&copy; {new Date().getFullYear()} Luxe Floral Design. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-ivory transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-ivory transition-colors">Privacy Policy</Link>
                        <Link href="/accessibility" className="hover:text-ivory transition-colors">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
