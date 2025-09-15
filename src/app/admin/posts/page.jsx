"use client";

import Loading from "@/app/loading";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("Posts state:", posts); // debug

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/posts");
                const data = await res.json();
                console.log("Fetched posts API:", data); // debug
                setPosts(data.posts || []); // ✅ use data.posts
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);


    async function handleDelete(postId) {
        // 1️⃣ Show confirmation popup
        console.log(postId);
        
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            // 2️⃣ Call DELETE API
            const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });

            const data = await res.json();

            if (res.ok) {
                // 3️⃣ Show success popup
                Swal.fire("Deleted!", data.message, "success");

                // 4️⃣ Remove post from UI
                setPosts(posts.filter(post => post._id !== postId));
            } else {
                Swal.fire("Error!", data.error || "Failed to delete post", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Something went wrong", "error");
        }
    }



    if (loading) return <Loading></Loading>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Posts</h1>
            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Title</th>
                        <th className="border px-4 py-2">Category</th>
                        <th className="border px-4 py-2">Author</th>
                        <th className="border px-4 py-2">Created At</th>
                        <th className="border px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post._id}>
                            <td className="border px-4 py-2">{post.title}</td>
                            <td className="border px-4 py-2">{post.categoryName}</td>
                            <td className="border px-4 py-2">{post.authorName}</td>
                            <td className="border px-4 py-2">{new Date(post.createdAt).toLocaleString()}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(post._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
