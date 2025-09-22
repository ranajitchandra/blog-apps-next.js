"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Loading from "@/app/loading";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    // console.log("Nav-sas", session?.user?.role);

    console.log(pathname);

    const userRole = session?.user?.role || "user";

    const linkClasses = (path) =>
        pathname === path
            ? "text-blue-400 font-semibold border-b-2 border-blue-400"
            : "hover:text-blue-300";


    if (!pathname.includes("dashboard")) {
        return (
            <nav className="max-w-7xl mx-auto bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 text-xl font-bold tracking-wide">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg> <span>My Blog</span>
                </Link>

                {/* Links */}
                <div className="flex gap-6">
                    <Link href="/" className={linkClasses("/")}>
                        Home
                    </Link>
                    <Link href="/authorRequest" className={linkClasses("/authorRequest")}>
                        Apply for Author
                    </Link>
                    <Link href="/about" className={linkClasses("/about")}>
                        About
                    </Link>
                    <Link href="/contact" className={linkClasses("/contact")}>
                        Contact
                    </Link>
                </div>




                {/* Auth Section */}
                <div>
                    {status === "loading" ? (
                        <Loading />
                    ) : session ? (
                        <>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="Tailwind CSS Navbar component"
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                    <li>
                                        <Link href='/dashboard' className="justify-between text-black">
                                            Dashboard
                                        </Link>

                                    </li>
                                    <li>
                                        <a className="justify-between text-black">
                                            Profile
                                            <span className="badge">{session.user.name}</span>
                                        </a>
                                    </li>
                                    <li className="mt-2">
                                        <button onClick={() => signOut()} className="bg-gray-800 hover:bg-gray-900">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
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
}


