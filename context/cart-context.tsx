"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    description?: string;
    category?: string;
    href?: string;
    occasions?: string[];
}

interface CartContextType {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    items: CartItem[];
    addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    // Mock items for demonstration
    const [items, setItems] = useState<CartItem[]>([
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

    const addToCart = (newItem: CartItem) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === newItem.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prevItems, newItem];
        });
        setIsOpen(true);
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    return (
        <CartContext.Provider value={{ isOpen, openCart, closeCart, items, addToCart }}>
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
