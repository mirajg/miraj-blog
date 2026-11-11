
import { NextResponse, type NextRequest } from "next/server";

// Must match SESSION_COOKIE in lib/auth.ts. It's repeated here so the proxy
// doesn't need to load the database and secret handling code.
const SESSION_COOKIE = "admin_session";

// Quick redirect only. The real check (signature + expiry) happens in
// requireAdmin() on every admin page and isAdmin() on every API route.
export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

    if (!request.cookies.has(SESSION_COOKIE)) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };