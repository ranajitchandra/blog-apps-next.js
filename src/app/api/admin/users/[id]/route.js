import { getUsersCollection } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { role } = await req.json();

    if (!["admin", "author"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    try {
        const usersCollection = await getUsersCollection();
        await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
        );
        return NextResponse.json({ message: "User role updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
        return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });
    }

    try {
        const usersCollection = await getUsersCollection();
        await usersCollection.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}