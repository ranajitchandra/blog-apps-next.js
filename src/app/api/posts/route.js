// app/api/posts/route.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getPostsCollection, getCategoriesCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// ---------------------------
// POST: Create a new post
// ---------------------------
export async function POST(request) {
    try {
        // 1️⃣ Check if user is logged in
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Please login first" }, { status: 401 });
        }

        // 2️⃣ Check if user has permission
        if (!["author", "admin"].includes(session.user.role)) {
            return NextResponse.json({ error: "Only authors can create posts" }, { status: 403 });
        }

        // 3️⃣ Get request body
        const { title, content, categoryID, featuredImage } = await request.json();

        // 4️⃣ Validate required fields
        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        // 5️⃣ Create URL-friendly slug
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();

        // 6️⃣ Check if slug exists
        const postsCollection = await getPostsCollection();
        const existingPost = await postsCollection.findOne({ slug });
        if (existingPost) {
            return NextResponse.json({ error: "A post with this title already exists" }, { status: 400 });
        }

        // 7️⃣ Prepare new post object
        const newPost = {
            title,
            slug,
            content,
            categoryID: categoryID || "uncategorized",
            featuredImage: featuredImage || null,
            authorId: session.user.id,
            authorName: session.user.name,
            authorEmail: session.user.email,
            likes: 0,
            likedBy: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            published: true,
        };

        // 8️⃣ Insert into database
        const result = await postsCollection.insertOne(newPost);

        // 9️⃣ Return success response
        return NextResponse.json(
            {
                message: "Post created successfully",
                postId: result.insertedId,
                slug,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// ---------------------------
// GET: Fetch posts with category name
// ---------------------------
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const postsCollection = await getPostsCollection();

        // 1️⃣ Build filter
        let filter = { published: true };
        if (categoryId && categoryId !== "all") {
            filter.categoryID = categoryId;
        }

        // 2️⃣ Fetch posts
        const posts = await postsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // 3️⃣ Fetch categories
        const categoriesCollection = await getCategoriesCollection();
        const categories = await categoriesCollection.find({}).toArray();

        // 4️⃣ Map category name to posts
        const postsWithCategoryName = posts.map((post) => {
            const category = categories.find((cat) => cat._id.toString() === post.categoryID.toString());
            return {
                ...post,
                categoryName: category ? category.name : "Uncategorized",
            };
        });

        // 5️⃣ Pagination info
        const total = await postsCollection.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            posts: postsWithCategoryName,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

