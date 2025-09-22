// app/api/admin/posts-per-category/route.js
import { getPostsCollection, getCategoriesCollection } from "@/lib/mongodb";

export async function GET() {
    const postsCollection = await getPostsCollection();
    const categoriesCollection = await getCategoriesCollection();

    const categories = await categoriesCollection.find({}).toArray();
    const posts = await postsCollection.find({}).toArray();

    const data = categories.map((cat) => ({
        category: cat.name,
        posts: posts.filter((p) => p.categoryId === cat._id.toString()).length,
    }));

    return new Response(JSON.stringify(data), { status: 200 });
}
