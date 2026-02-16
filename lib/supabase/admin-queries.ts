import { createClient } from "@/lib/supabase/server";

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
    totalRevenue: number;
    activeOrders: number;
    todaysOrders: number;
    newCustomers: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    // Run all queries in parallel
    const [revenueRes, activeRes, todayRes, customersRes] = await Promise.all([
        // Total revenue from delivered orders
        supabase
            .from("orders")
            .select("total")
            .eq("status", "delivered"),

        // Active orders (not delivered/cancelled)
        supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .not("status", "in", "(delivered,cancelled)"),

        // Today's orders
        supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .gte("created_at", todayISO),

        // New customers in last 30 days
        supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .gte("created_at", thirtyDaysAgoISO),
    ]);

    const totalRevenue = (revenueRes.data || []).reduce(
        (sum, row) => sum + Number(row.total || 0),
        0
    );

    return {
        totalRevenue,
        activeOrders: activeRes.count ?? 0,
        todaysOrders: todayRes.count ?? 0,
        newCustomers: customersRes.count ?? 0,
    };
}

// ─── Recent Orders (for dashboard) ───────────────────────────────────────────

export interface RecentOrder {
    id: string;
    order_number: string;
    shipping_full_name: string;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
    order_items: { id: string; product_name: string }[];
}

export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(
            `id, order_number, shipping_full_name, total, status, payment_status, created_at,
             order_items ( id, product_name )`
        )
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching recent orders:", error);
        return [];
    }

    return (data as RecentOrder[]) || [];
}

// ─── Paginated Orders (for orders page) ──────────────────────────────────────

export interface AdminOrder {
    id: string;
    order_number: string;
    shipping_full_name: string;
    shipping_phone: string;
    shipping_city: string;
    total: number;
    status: string;
    payment_status: string;
    payment_method: string;
    delivery_date: string | null;
    delivery_slot: string | null;
    created_at: string;
    order_items: { id: string; product_name: string; quantity: number; unit_price: number }[];
}

export interface PaginatedOrders {
    orders: AdminOrder[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export async function getAdminOrders(
    page = 1,
    perPage = 10,
    statusFilter?: string
): Promise<PaginatedOrders> {
    const supabase = await createClient();

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
        .from("orders")
        .select(
            `id, order_number, shipping_full_name, shipping_phone, shipping_city,
             total, status, payment_status, payment_method, delivery_date, delivery_slot, created_at,
             order_items ( id, product_name, quantity, unit_price )`,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

    if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error("Error fetching admin orders:", error);
        return { orders: [], total: 0, page, perPage, totalPages: 0 };
    }

    const total = count ?? 0;

    return {
        orders: (data as AdminOrder[]) || [],
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
}

// ─── Single Order Detail ─────────────────────────────────────────────────────

export interface AdminOrderDetail {
    id: string;
    order_number: string;
    shipping_full_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_pincode: string;
    total: number;
    subtotal: number;
    shipping_fee: number;
    discount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    upi_transaction_id: string | null;
    delivery_date: string | null;
    delivery_slot: string | null;
    notes: string | null;
    created_at: string;
    placed_at: string;
    confirmed_at: string | null;
    dispatched_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
    order_items: {
        id: string;
        product_name: string;
        product_image: string | null;
        quantity: number;
        unit_price: number;
        line_total: number;
    }[];
}

export async function getAdminOrderById(orderId: string): Promise<AdminOrderDetail | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(
            `id, order_number, shipping_full_name, shipping_phone, shipping_address,
             shipping_city, shipping_state, shipping_pincode,
             total, subtotal, shipping_fee, discount,
             status, payment_status, payment_method, upi_transaction_id,
             delivery_date, delivery_slot, notes,
             created_at, placed_at, confirmed_at, dispatched_at, delivered_at, cancelled_at,
             order_items ( id, product_name, product_image, quantity, unit_price, line_total )`
        )
        .eq("id", orderId)
        .single();

    if (error) {
        console.error("Error fetching order detail:", error);
        return null;
    }

    return data as AdminOrderDetail;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export interface AdminCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    product_count: number;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("categories")
        .select("*, products(id)")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return (data || []).map((cat) => ({
        ...cat,
        product_count: Array.isArray(cat.products) ? cat.products.length : 0,
        products: undefined,
    })) as AdminCategory[];
}
