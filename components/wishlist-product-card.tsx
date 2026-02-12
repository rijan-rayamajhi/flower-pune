"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useWishlist, WishlistItem } from "@/context/wishlist-context";

interface WishlistProductCardProps {
    item: WishlistItem;
}

export default function WishlistProductCard({ item }: WishlistProductCardProps) {
    const { openCart } = useCart(); // Assuming useCart exposes a method to add items, but checking context/cart-context.tsx it only has openCart. 
    // Wait, I need to check if cart context allows adding items. 
    // Looking at the previously viewed cart-context.tsx, it DOES NOT seem to have an addToCart function export? 
    // Let me check cart-context.tsx again. 
    // Step 24 showed: interface CartContextType { isOpen: boolean; openCart: () => void; closeCart: () => void; items: CartItem[]; }
    // It seems addToCart is missing from the context interface! 
    // I need to fix CartContext to allow adding items, or at least mock it for now if I can't change it easily (but I should change it as per requirements).
    // The requirement says "Move to Cart". 
    // I will assume for now I should add addToCart to CartContext. 
    // But I shouldn't break existing code. 
    // Let me check cart-context.tsx again to be sure.
    // Yes, Step 24 confirmation.
    // I will implement the card assuming I can add to cart, and I will update CartContext to support it. 

    // Actually, I can't see the implementation of CartProvider completely in the view I had? 
    // No, I saw the whole file. It has `const [items] = useState<CartItem[]>([...])`. It doesn't have setItems exposed or an add function.
    // This implies the cart is currently hardcoded/mocked.
    // I should add `addToCart` to `CartContext`.

    // For now, I will write the component to use `addToCart` and then I will update `CartContext`.

    const { addToCart } = useCart();
    const { removeFromWishlist } = useWishlist();

    const handleMoveToCart = () => {
        // Add to cart
        if (addToCart) {
            addToCart({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }
        // Remove from wishlist
        removeFromWishlist(item.id);
        // Open cart drawer
        openCart();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
        >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                <Link href={item.href}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>

                <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-charcoal/60 backdrop-blur-sm transition-colors hover:bg-burgundy hover:text-white"
                    aria-label="Remove from wishlist"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        {item.category && (
                            <p className="text-xs text-charcoal/50 mb-1">{item.category}</p>
                        )}
                        <h3 className="font-serif text-lg text-charcoal">
                            <Link href={item.href} className="hover:text-burgundy transition-colors">
                                {item.title}
                            </Link>
                        </h3>
                    </div>
                    <p className="font-medium text-charcoal">${item.price}</p>
                </div>

                <button
                    onClick={handleMoveToCart}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm border border-burgundy bg-transparent py-2 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy hover:text-white"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Move to Cart
                </button>
            </div>
        </motion.div>
    );
}
