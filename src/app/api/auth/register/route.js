// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import cloudinary from "@/lib/cloudinary";
import { getUsersCollection } from "@/lib/mongodb";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const file = formData.get("image"); // file input

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const users = await getUsersCollection();

        // Check if user already exists
        const existing = await users.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Upload image to Cloudinary (if provided)
        let imageUrl = "";
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const upload = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "blog_users" }, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    })
                    .end(buffer);
            });

            imageUrl = upload.secure_url;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            role: "user", // default role
            createdAt: new Date(),
        };

        await users.insertOne(newUser);

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
