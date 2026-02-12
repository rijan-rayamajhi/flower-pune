"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";

import Footer from "@/components/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <CartProvider>
            <WishlistProvider>
                <Navbar />
                <CartDrawer />
                <div className="flex min-h-screen flex-col">
                    <main className="mx-auto flex w-full max-w-[1280px] flex-grow flex-col px-4 sm:px-6 lg:px-8 pt-[88px]">
                        {children}
                    </main>
                    <Footer />
                </div>
            </WishlistProvider>
        </CartProvider>
    );
}

