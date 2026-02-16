"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit2, Power, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleProductActive, deleteProduct } from "@/app/admin/actions";
import ProductFormModal from "@/components/admin/product-form-modal";
import type { Product, Category } from "@/lib/types/product";

interface ProductsGridProps {
    products: Product[];
    categories: Category[];
}

export default function ProductsGrid({ products, categories }: ProductsGridProps) {
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const getStatus = (stockQty: number) => {
        if (stockQty === 0) return "Out of Stock";
        if (stockQty <= 15) return "Low Stock";
        return "In Stock";
    };

    const handleEdit = (product: Product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditProduct(null);
        setShowModal(true);
    };

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-medium text-charcoal">Products</h1>
                    <p className="text-charcoal/60 mt-1">Manage your product catalog and inventory.</p>
                </div>
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2 text-sm px-4 py-2 shadow-sm">
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const primaryImage = product.product_images?.find((img) => img.is_primary);
                        const firstImage = product.product_images?.[0];
                        const imageUrl = primaryImage?.image_url || firstImage?.image_url || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=200&auto=format&fit=crop";
                        const status = getStatus(product.stock_quantity);

                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                imageUrl={imageUrl}
                                status={status}
                                onEdit={() => handleEdit(product)}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="font-serif text-xl text-charcoal/60">
                        No products yet. Add your first product to get started.
                    </p>
                </div>
            )}

            {showModal && (
                <ProductFormModal
                    product={editProduct}
                    categories={categories}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}

function ProductCard({ product, imageUrl, status, onEdit }: {
    product: Product;
    imageUrl: string;
    status: string;
    onEdit: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleProductActive(product.id, product.is_active);
        });
    };

    const handleDelete = () => {
        if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return;
        startTransition(async () => {
            const result = await deleteProduct(product.id);
            if (result.error) {
                alert(result.error);
            }
        });
    };

    return (
        <div className="group rounded-2xl bg-white border border-gray-100/50 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-square bg-gray-100">
                <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button onClick={onEdit}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal/60 hover:text-burgundy shadow-sm transition-colors">
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={handleToggle} disabled={isPending}
                        className={cn(
                            "p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-colors disabled:opacity-50",
                            product.is_active ? "text-charcoal/60 hover:text-burgundy" : "text-emerald-600 hover:text-emerald-700"
                        )}>
                        <Power className="h-4 w-4" />
                    </button>
                    <button onClick={handleDelete} disabled={isPending}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal/60 hover:text-red-600 shadow-sm transition-colors disabled:opacity-50">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
                <span className={cn(
                    "absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm shadow-sm",
                    status === "In Stock" ? "text-emerald-700" :
                        status === "Low Stock" ? "text-amber-700" :
                            "text-red-700"
                )}>
                    {status}
                </span>
                {!product.is_active && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                        Inactive
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-charcoal">{product.name}</h3>
                    <span className="font-bold text-charcoal">₹{Number(product.price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-charcoal/60">
                    <span>Stock: {product.stock_quantity}</span>
                    <span className="text-xs">{product.categories?.name || "Uncategorized"}</span>
                </div>
            </div>
        </div>
    );
}
