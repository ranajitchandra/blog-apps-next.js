// app/api/categories/route.js
import { NextResponse } from "next/server";
import { getCategoriesCollection } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { name, description } = await req.json();
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const categories = await getCategoriesCollection();

        // check if category already exists
        const existing = await categories.findOne({ name });
        if (existing) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const newCategory = {
            name,
            description: description || "",
            createdAt: new Date(),
            createdBy: session.user.id,
        };

        await categories.insertOne(newCategory);

        return NextResponse.json({ message: "Category created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Category create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



export async function GET() {
    try {
        const categoriesCollection = await getCategoriesCollection();
        const categories = await categoriesCollection.find({}).toArray();

        return NextResponse.json({
            categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}