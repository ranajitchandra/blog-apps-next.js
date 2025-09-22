import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
    const usersCollection = await getUsersCollection();

    await usersCollection.updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { authorRequest: false } }
    );

    return new Response(
        JSON.stringify({ message: "Author request rejected" }),
        { status: 200 }
    );
}
