"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: "",
        content: "",
        featuredImage: "",
        categoryID: ""
    });

    // Fetch post data
    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data);
                    setForm({
                        title: data.title,
                        content: data.content,
                    });
                } else {
                    Swal.fire("Error", data.error || "Post not found", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Something went wrong", "error");
            }
            setLoading(false);
        }
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire("Success", data.message, "success").then(() => {
                    router.push("/dashboard");
                });
            } else {
                Swal.fire("Error", data.error || "Failed to update post", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="border p-2 rounded"
                />
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Content"
                    rows={6}
                    className="border p-2 rounded"
                />
                
                <button type="submit" className="bg-blue-600 text-white py-2 rounded">
                    Update Post
                </button>
            </form>
        </div>
    );
}
