"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    stockQuantity: number;
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
    addToCart: (item: CartItem) => boolean;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (newItem: CartItem): boolean => {
        const existingItem = items.find((item) => item.id === newItem.id);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const requestedQty = currentQty + newItem.quantity;

        if (newItem.stockQuantity > 0 && requestedQty > newItem.stockQuantity) {
            alert(
                `Only ${newItem.stockQuantity} in stock.${currentQty > 0 ? ` You already have ${currentQty} in your cart.` : ""}`
            );
            return false;
        }

        setItems((prevItems) => {
            const existing = prevItems.find((item) => item.id === newItem.id);
            if (existing) {
                return prevItems.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prevItems, newItem];
        });
        setIsOpen(true);
        return true;
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id !== id) return item;
                const clampedQty = item.stockQuantity > 0
                    ? Math.min(quantity, item.stockQuantity)
                    : quantity;
                return { ...item, quantity: clampedQty };
            })
        );
    };

    const removeItem = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ isOpen, openCart, closeCart, items, addToCart, updateQuantity, removeItem, clearCart, totalItems }}>
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
