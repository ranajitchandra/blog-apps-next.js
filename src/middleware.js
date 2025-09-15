// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    // Protect /admin routes - only admin
    if (pathname.startsWith("/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Protect /create-post route - author or admin
    if (pathname === "/create-post") {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (token.role !== "author" && token.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protect /dashboard route - author or admin
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (token.role !== "author" && token.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/create-post", "/dashboard/:path*"],
};
