"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    items: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    // Mock items for demonstration
    const [items] = useState<CartItem[]>([
        {
            id: "1",
            title: "The Royal Blush",
            price: 185,
            image: "https://images.unsplash.com/photo-1712258091779-48b46ad77437?q=80&w=200&auto=format&fit=crop",
            quantity: 1
        },
        {
            id: "2",
            title: "Velvet Touch",
            price: 145,
            image: "https://images.unsplash.com/photo-1547848803-2937f52e76f5?q=80&w=200&auto=format&fit=crop",
            quantity: 2
        }
    ]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    return (
        <CartContext.Provider value={{ isOpen, openCart, closeCart, items }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
