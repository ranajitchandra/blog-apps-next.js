// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Swal from "sweetalert2";
import Loading from "../../../loading";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetchPosts();
        }
    }, [status]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/author/posts");
            const data = await res.json();
            if (res.ok) {
                setPosts(data.posts || []);
            } else {
                Swal.fire("Error", data.error || "Failed to load posts", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong", "error");
        }
        setLoading(false);
    };

    if (status === "loading") {
        return <Loading></Loading>;
    }

    if (!session || (session.user.role !== "author" && session.user.role !== "admin")) {
        return <div className="text-center py-20 text-red-600">Access Denied</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold mb-6">My Posts</h1>
            </div>

            {loading ? (
                <Loading ></Loading>
            ) : posts.length === 0 ? (
                <p className="text-gray-600">You haven’t created any posts yet.</p>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-left text-gray-700">
                            <tr>
                                <th className="p-3 border">Title</th>
                                <th className="p-3 border">Created At</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post._id} className="hover:bg-gray-50">
                                    <td className="p-3 border font-medium">{post.title}</td>
                                    <td className="p-3 border">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 border">
                                        {post.published ? (
                                            <span className="text-green-600">Published</span>
                                        ) : (
                                            <span className="text-gray-500">Draft</span>
                                        )}
                                    </td>
                                    <td className="p-3 border">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/post/${post._id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/dashboard/author/updatePost/${post._id}`}
                                                className="text-yellow-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            {/* Future: delete button here */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
