// app/post/[id]/comments.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function CommentsSection({ postId }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    // Load comments
    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`);
            const data = await res.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Submit comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            const data = await res.json();
            if (res.ok) {
                setText("");
                fetchComments();
                Swal.fire({
                    icon: "success",
                    title: "Comment added!",
                    toast: true,
                    position: "top-end",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire("Error", data.error, "error");
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            {/* Add Comment */}
            {session ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        className="w-full border p-3 rounded-lg mb-3"
                        rows="3"
                        placeholder="Write a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Posting..." : "Post Comment"}
                    </button>
                </form>
            ) : (
                <p className="text-gray-600 mb-6">You must log in to comment.</p>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500">No comments yet. Be the first!</p>
                ) : (
                    comments.map((c) => (
                        <div
                            key={c._id}
                            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
                        >
                            <p className="text-gray-800">{c.text}</p>
                            <div className="text-sm text-gray-500 mt-1">
                                By {c.userName} •{" "}
                                {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
