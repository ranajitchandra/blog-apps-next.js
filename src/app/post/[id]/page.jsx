// app/post/[id]/page.jsx
import { getPostsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import CommentsSection from "./comments"; // 🔹 Import client component

async function getPost(id) {
    try {
        const postsCollection = await getPostsCollection();
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!post) return null;
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error("Invalid ObjectId:", error);
        return null;
    }
}

export default async function PostDetails({ params }) {
    const { id } = params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {/* Meta Info */}
            <div className="flex gap-6 text-sm text-gray-600 mb-6">
                <span>👤 <strong>By:</strong> {post.authorName}</span>
                <span>📅 <strong>Published:</strong>{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="flex justify-center items-center mb-6">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-60 h-60 object-cover rounded-lg shadow"
                    />
                </div>
            )}

            {/* Content */}
            <div className="prose max-w-none border border-gray-400 p-4 rounded-xl text-gray-800 leading-relaxed mb-10">
                {post.content}
            </div>

            {/* Comments */}
            <CommentsSection postId={id} />
        </div>
    );
}
