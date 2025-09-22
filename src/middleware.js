// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protect /dashboard/admin routes - only admin
  if (pathname.startsWith("/dashboard/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect /dashboard/author routes - author or admin
  if (pathname.startsWith("/dashboard/author")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "author" && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect /dashboard (general) - author or admin
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
  matcher: [
    "/dashboard/:path*", // includes /dashboard/admin and /dashboard/author
  ],
};
