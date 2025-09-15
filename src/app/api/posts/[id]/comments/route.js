// app/api/posts/[id]/comments/route.js
import { NextResponse } from "next/server";
import { getCommentsCollection } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ➡️ Get all comments for a post
export async function GET(req, { params }) {
    try {
        const { id } = params;
        const commentsCollection = await getCommentsCollection();

        const comments = await commentsCollection
            .find({ postId: new ObjectId(id) })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

// ➡️ Add new comment
export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const { text } = await req.json();
        if (!text || !text.trim()) {
            return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
        }

        const commentsCollection = await getCommentsCollection();

        const newComment = {
            postId: new ObjectId(id),
            userId: session.user.id,
            userName: session.user.name,
            userEmail: session.user.email,
            text,
            createdAt: new Date(),
        };

        await commentsCollection.insertOne(newComment);

        return NextResponse.json({ message: "Comment added successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
