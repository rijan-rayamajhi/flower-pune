import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { cn } from "@/lib/utils";

const PRODUCTS = [
    { id: "1", title: "The Royal Blush", price: 185, stock: 45, image: "https://images.unsplash.com/photo-1712258091779-48b46ad77437?q=80&w=200&auto=format&fit=crop", status: "In Stock" },
    { id: "2", title: "Velvet Touch", price: 145, stock: 12, image: "https://images.unsplash.com/photo-1547848803-2937f52e76f5?q=80&w=200&auto=format&fit=crop", status: "Low Stock" },
    { id: "3", title: "Golden Hour", price: 210, stock: 0, image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=200&auto=format&fit=crop", status: "Out of Stock" },
    { id: "4", title: "Pure Elegance", price: 160, stock: 56, image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=200&auto=format&fit=crop", status: "In Stock" },
    { id: "5", title: "Midnight Rose", price: 290, stock: 23, image: "https://images.unsplash.com/photo-1518709324869-d419846b4122?q=80&w=200&auto=format&fit=crop", status: "In Stock" },
];

export default function ProductsPage() {
    return (
        <div>
            <PageHeader
                title="Products"
                description="Manage your product catalog and inventory."
                action={
                    <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {PRODUCTS.map((product) => (
                    <div key={product.id} className="group rounded-2xl bg-white border border-gray-100/50 overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative aspect-square bg-gray-100">
                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal/60 hover:text-burgundy shadow-sm transition-colors">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal/60 hover:text-red-600 shadow-sm transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <span
                                className={cn(
                                    "absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm shadow-sm",
                                    product.status === "In Stock" ? "text-emerald-700" :
                                        product.status === "Low Stock" ? "text-amber-700" :
                                            "text-red-700"
                                )}
                            >
                                {product.status}
                            </span>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-charcoal">{product.title}</h3>
                                <span className="font-bold text-charcoal">${product.price}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-charcoal/60">
                                <span>Stock: {product.stock}</span>
                                <span className="text-xs">ID: #{product.id}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
