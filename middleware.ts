import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/account", "/wishlist"];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Routes that should redirect away if already authenticated
const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    // This refreshes the auth token and ensures the session stays valid.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // ── Redirect authenticated users away from auth pages ──
    if (user && authRoutes.some((route) => pathname.startsWith(route))) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    // ── Protect authenticated routes ──
    if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // ── Protect admin routes ──
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }

        // Check admin role from profiles table
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "admin") {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
