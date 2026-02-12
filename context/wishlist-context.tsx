"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Actually, looking at package.json isn't possible right now, but standard context doesn't need external libs if not strictly necessary. 
// I'll stick to standard React state for now and add toast later if confirmed.

export interface WishlistItem {
    id: string;
    title: string;
    price: number;
    image: string;
    category?: string;
    href: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>(() => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem("wishlist");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
        return [
            {
                id: "mock-1",
                title: "Velvet Rose Bouquet",
                price: 85,
                image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=800&auto=format&fit=crop",
                category: "Roses",
                href: "/shop/velvet-rose-bouquet"
            },
            {
                id: "mock-2",
                title: "Summer Breeze",
                price: 65,
                image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
                category: "Mixed",
                href: "/shop/summer-breeze"
            }
        ];
    });

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(items));
    }, [items]);

    const addToWishlist = (item: WishlistItem) => {
        setItems((prev) => {
            if (prev.some((i) => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const isInWishlist = (id: string) => {
        return items.some((item) => item.id === id);
    };

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
