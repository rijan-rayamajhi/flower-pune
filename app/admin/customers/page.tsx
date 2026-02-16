import { Phone, MapPin } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";

interface CustomerData {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    order_count: number;
    total_spent: number;
}

export default async function CustomersPage() {
    const supabase = await createClient();

    // Fetch profiles that have placed orders, with aggregate data
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("created_at", { ascending: false });

    // For each profile, aggregate their order data
    const { data: orders } = await supabase
        .from("orders")
        .select("id, shipping_full_name, shipping_phone, shipping_city, total, user_id");

    // Build customer map from orders
    const customerMap = new Map<string, CustomerData>();

    (orders || []).forEach((order) => {
        const key = order.user_id || order.shipping_phone || order.shipping_full_name;
        if (!key) return;

        const existing = customerMap.get(key);
        if (existing) {
            existing.order_count += 1;
            existing.total_spent += Number(order.total || 0);
        } else {
            const profile = (profiles || []).find((p) => p.id === order.user_id);
            customerMap.set(key, {
                id: key,
                full_name: profile?.full_name || order.shipping_full_name,
                email: "",
                phone: order.shipping_phone || null,
                city: order.shipping_city || null,
                order_count: 1,
                total_spent: Number(order.total || 0),
            });
        }
    });

    const customers = Array.from(customerMap.values())
        .sort((a, b) => b.total_spent - a.total_spent);

    return (
        <div>
            <PageHeader
                title="Customers"
                description={`${customers.length} customer${customers.length !== 1 ? "s" : ""}`}
            />

            {customers.length > 0 ? (
                <div className="grid gap-4">
                    {customers.map((customer) => (
                        <div key={customer.id} className="rounded-xl bg-white p-6 border border-gray-100/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-burgundy/5 flex items-center justify-center text-burgundy font-serif font-bold text-lg">
                                    {(customer.full_name || "?").charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-medium text-charcoal">{customer.full_name || "Unknown"}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-charcoal/60">
                                        {customer.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3 w-3" />
                                                {customer.phone}
                                            </div>
                                        )}
                                        {customer.city && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3" />
                                                {customer.city}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                                <div className="text-center sm:text-right">
                                    <p className="text-xs text-charcoal/50 uppercase tracking-wider">Orders</p>
                                    <p className="font-bold text-charcoal">{customer.order_count}</p>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="text-xs text-charcoal/50 uppercase tracking-wider">Total Spent</p>
                                    <p className="font-bold text-charcoal">₹{customer.total_spent.toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50 px-6 py-12 text-center text-charcoal/40">
                    <p>No customers with orders yet.</p>
                </div>
            )}
        </div>
    );
}
