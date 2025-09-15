// app/api/author/posts/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getPostsCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only allow authors and admins
        if (session.user.role !== "author" && session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const postsCollection = await getPostsCollection();
        const posts = await postsCollection
            .find({ authorId: session.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Error fetching author posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
