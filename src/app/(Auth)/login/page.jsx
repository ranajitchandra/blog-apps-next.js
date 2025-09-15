// app/login/page.jsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        if (res.error) {
            // ❌ Show error popup
            Swal.fire({
                title: "Login Failed",
                text: res.error || "Invalid email or password",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        } else {
            // ✅ Show success popup then redirect
            Swal.fire({
                title: "Welcome Back!",
                text: "You are logged in successfully.",
                icon: "success",
                confirmButtonColor: "#3085d6",
            }).then(() => {
                router.push("/"); // redirect to home
            });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="text-sm text-gray-600 mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </div>
        </div>
    );
}
