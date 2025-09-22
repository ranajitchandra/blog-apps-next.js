// DaisyUI Drawer integrated for Dashboard Layout
// Place this in your `app/dashboard/layout.jsx` (Next.js App Router)
"use client"
import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    // console.log("Nav-sas", session?.user?.role);
    return (
        <div className="drawer lg:drawer-open h-screen">
            {/* drawer-toggle checkbox */}
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main content */}
            <div className="drawer-content flex flex-col">
                {/* Top navbar (mobile view) */}
                <header className="w-full p-4 bg-base-200 flex items-center justify-between lg:hidden">
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost">
                        {/* hamburger */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <h1 className="text-lg font-medium">Dashboard</h1>
                </header>

                <main className="px-6 overflow-y-auto flex-1">
                    {children}
                </main>
            </div>

            {/* Drawer side */}
            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <aside className="w-64 bg-base-100 min-h-full border-r-2 border-amber-300">
                    <div className="mb-2">
                        <h2 className="font-bold text-xl mb-1"><Link href="/dashboard">Dashboard</Link></h2>
                        <p className="text-sm opacity-70">You are <span className="text-green-500 font-semibold">{session?.user?.role}</span></p>
                    </div>

                    <ul className="menu">
                        <li><Link href="/">Home</Link></li>
                        {session?.user?.role === "admin" && (
                            <>
                                <li><Link href="/dashboard/admin/allUsers">Users</Link></li>
                                <li><Link href="/dashboard/admin/posts">Posts</Link></li>
                                <li><Link href="/dashboard/admin/createCategories">Create Category</Link></li>
                                <li><Link href="/dashboard/admin/authorRequests">Author Request</Link></li>
                            </>
                        )}
                        {session?.user?.role === "author" && (
                            <>
                                <li><Link href="/dashboard/author/myPost">My Post</Link></li>
                                <li><Link href="/dashboard/author/createPost">Create Post</Link></li>
                            </>
                        )}
                        <li>
                            <button
                                onClick={() => signOut()}
                                className="font-bold"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
