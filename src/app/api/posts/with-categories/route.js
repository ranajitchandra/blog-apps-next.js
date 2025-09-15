import { getPostsCollection, getCategoriesCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 5;

        const postsCollection = await getPostsCollection();
        const categoriesCollection = await getCategoriesCollection();

        // Filter
        let filter = { published: true };
        if (categoryId && categoryId !== "all") {
            filter.categoryId = categoryId;
        }

        const total = await postsCollection.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        // Get posts with pagination
        const posts = await postsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        // Get categories
        const categories = await categoriesCollection.find({}).toArray();
        const categoryMap = {};
        categories.forEach((cat) => {
            categoryMap[cat._id.toString()] = cat;
        });

        const postsWithCategories = posts.map((post) => ({
            ...post,
            category: post.categoryId ? categoryMap[post.categoryId] : null,
        }));

        return NextResponse.json({
            posts: postsWithCategories,
            categories,
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
        console.error("Error fetching posts with categories:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
