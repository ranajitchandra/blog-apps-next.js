// app/api/posts/[id]/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getPostsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const postsCollection = await getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    console.log(id);


    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}



// UPDATE post
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, content } = body;

    const postsCollection = await getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check permission (author can edit only their own post)
    if (session.user.role !== "admin" && session.user.id !== post.authorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}



export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Please login first" }, { status: 401 });

    const { id } = params; // get id from URL
    if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    const postsCollection = await getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Permission check
    if (session.user.role !== "admin" && post.authorId.toString() !== session.user.id.toString()) {
      return NextResponse.json({ error: "You are not allowed to delete this post" }, { status: 403 });
    }

    await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

