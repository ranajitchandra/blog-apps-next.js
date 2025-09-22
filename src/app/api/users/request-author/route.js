
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUsersCollection } from "@/lib/mongodb";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const usersCollection = await getUsersCollection();

  // Mark that this user requested author role
  await usersCollection.updateOne(
    { email: session.user.email },
    { $set: { authorRequest: true } }
  );

  return new Response(
    JSON.stringify({ message: "Your request has been sent to admin" }),
    { status: 200 }
  );
}
