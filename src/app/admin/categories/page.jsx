// app/admin/categories/page.jsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function CategoriesPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: e.target.name.value,
                description: e.target.description.value,
            }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            Swal.fire({
                title: "Success!",
                text: "Category created successfully.",
                icon: "success",
            });
            e.target.reset();
        } else {
            Swal.fire({
                title: "Error",
                text: data.error || "Failed to create category",
                icon: "error",
            });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Create Category</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    className="w-full border p-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Category Description"
                    className="w-full border p-2 rounded"
                ></textarea>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Creating..." : "Create Category"}
                </button>
            </form>
        </div>
    );
}
