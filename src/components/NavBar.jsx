"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const userRole = session?.user?.role || "guest";

    const linkClasses = (path) =>
        pathname === path
            ? "text-blue-400 font-semibold border-b-2 border-blue-400"
            : "hover:text-blue-300";

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-wide">
                My Blog
            </Link>

            {/* Links */}
            <div className="flex gap-6">
                <Link href="/" className={linkClasses("/")}>
                    Home
                </Link>

                {/* Author/Admin Dashboard */}
                {(userRole === "author" || userRole === "admin") && (
                    <Link href="/dashboard" className={linkClasses("/dashboard")}>
                        Author
                    </Link>
                )}

                {/* Admin Panel */}
                {userRole === "admin" && (
                    <div className="relative group">
                        <span className="cursor-pointer">Admin ▾</span>
                        <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                                href="/admin/dashboard"
                                className={`${linkClasses("/admin/dashboard")} block px-4 py-2 hover:bg-gray-200`}
                            >
                                Users
                            </Link>
                            <Link
                                href="/admin/categories"
                                className={`${linkClasses("/admin/categories")} block px-4 py-2 hover:bg-gray-200`}
                            >
                                Categories
                            </Link>
                            <Link
                                href="/admin/posts"
                                className={`${linkClasses("/admin/posts")} block px-4 py-2 hover:bg-gray-200`}
                            >
                                Posts
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Auth Section */}
            <div>
                {status === "loading" ? (
                    <span className="text-gray-400">Loading...</span>
                ) : session ? (
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline">Hi, {session.user.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-sm"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}
