"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";

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
                <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 sm:px-6 lg:px-8 pt-[88px]">
                    {children}
                </div>
            </WishlistProvider>
        </CartProvider>
    );
}

