// app/register/page.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        const formData = new FormData(e.target);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            // ✅ Success alert
            Swal.fire({
                title: "Success!",
                text: "Your account has been created.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Go to Home",
            }).then(() => {
                router.push("/"); // redirect after success
            });
        } else {
            // ❌ Error alert
            Swal.fire({
                title: "Error",
                text: data.error || "Something went wrong!",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Register</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full border p-2 rounded"
                    required
                />
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
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full border p-2 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {msg && <p className="mt-4 text-center text-sm">{msg}</p>}
            <div className="text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </div>
        </div>
    );
}
