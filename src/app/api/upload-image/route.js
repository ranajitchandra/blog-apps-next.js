// app/api/upload/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user has author or admin role
        if (session.user.role !== "author" && session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Forbidden - Only authors can upload images" },
                { status: 403 }
            );
        }

        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "blog-posts",
                    resource_type: "image",
                    transformation: [
                        { width: 1200, height: 800, crop: "limit" },
                        { quality: "auto:good" },
                        { format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            message: "Image uploaded successfully",
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}