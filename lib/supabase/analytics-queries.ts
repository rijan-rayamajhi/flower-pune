import { createClient } from "@/lib/supabase/server";

// ─── Analytics Queries ───────────────────────────────────────────────────────

export interface AnalyticsOverview {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    orders: number;
}

export interface TopProduct {
    product_name: string;
    total_quantity: number;
    total_revenue: number;
}

export interface OrderStatusBreakdown {
    status: string;
    count: number;
}

export interface PaymentMethodBreakdown {
    payment_method: string;
    count: number;
    revenue: number;
}

export interface RecentActivity {
    id: string;
    order_number: string;
    shipping_full_name: string;
    total: number;
    status: string;
    created_at: string;
}

/**
 * Get overview stats for a period (days back from now).
 */
export async function getAnalyticsOverview(daysBack: number): Promise<AnalyticsOverview> {
    const supabase = await createClient();

    const since = new Date();
    since.setDate(since.getDate() - daysBack);
    const sinceISO = since.toISOString();

    const [ordersRes, customersRes] = await Promise.all([
        supabase
            .from("orders")
            .select("total")
            .gte("created_at", sinceISO)
            .neq("status", "cancelled"),
        supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalCustomers: customersRes.count ?? 0,
    };
}

/**
 * Get daily revenue for the last N days.
 */
export async function getDailyRevenue(daysBack: number): Promise<DailyRevenue[]> {
    const supabase = await createClient();

    const since = new Date();
    since.setDate(since.getDate() - daysBack);
    const sinceISO = since.toISOString();

    const { data, error } = await supabase
        .from("orders")
        .select("total, created_at")
        .gte("created_at", sinceISO)
        .neq("status", "cancelled")
        .order("created_at", { ascending: true });

    if (error || !data) return [];

    // Group by date
    const dailyMap = new Map<string, { revenue: number; orders: number }>();

    // Pre-fill all days
    for (let i = daysBack; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        dailyMap.set(key, { revenue: 0, orders: 0 });
    }

    for (const row of data) {
        const key = new Date(row.created_at).toISOString().split("T")[0];
        const entry = dailyMap.get(key) || { revenue: 0, orders: 0 };
        entry.revenue += Number(row.total || 0);
        entry.orders += 1;
        dailyMap.set(key, entry);
    }

    return Array.from(dailyMap.entries()).map(([date, val]) => ({
        date,
        revenue: val.revenue,
        orders: val.orders,
    }));
}

/**
 * Get top selling products by quantity.
 */
export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("order_items")
        .select("product_name, quantity, unit_price");

    if (error || !data) return [];

    // Aggregate by product name
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    for (const item of data) {
        const entry = productMap.get(item.product_name) || { quantity: 0, revenue: 0 };
        entry.quantity += item.quantity;
        entry.revenue += Number(item.unit_price) * item.quantity;
        productMap.set(item.product_name, entry);
    }

    return Array.from(productMap.entries())
        .map(([name, val]) => ({
            product_name: name,
            total_quantity: val.quantity,
            total_revenue: val.revenue,
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, limit);
}

/**
 * Get order status breakdown.
 */
export async function getOrderStatusBreakdown(): Promise<OrderStatusBreakdown[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select("status");

    if (error || !data) return [];

    const countMap = new Map<string, number>();
    for (const row of data) {
        countMap.set(row.status, (countMap.get(row.status) || 0) + 1);
    }

    return Array.from(countMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Get payment method breakdown.
 */
export async function getPaymentMethodBreakdown(): Promise<PaymentMethodBreakdown[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select("payment_method, total")
        .neq("status", "cancelled");

    if (error || !data) return [];

    const methodMap = new Map<string, { count: number; revenue: number }>();
    for (const row of data) {
        const method = row.payment_method || "unknown";
        const entry = methodMap.get(method) || { count: 0, revenue: 0 };
        entry.count += 1;
        entry.revenue += Number(row.total || 0);
        methodMap.set(method, entry);
    }

    return Array.from(methodMap.entries())
        .map(([payment_method, val]) => ({
            payment_method,
            count: val.count,
            revenue: val.revenue,
        }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Get recent orders for the activity feed.
 */
export async function getRecentActivity(limit = 10): Promise<RecentActivity[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, shipping_full_name, total, status, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error || !data) return [];
    return data as RecentActivity[];
}
