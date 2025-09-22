// app/api/admin/users-per-month/route.js
import { getUsersCollection } from "@/lib/mongodb";

export async function GET() {
    const usersCollection = await getUsersCollection();
    const users = await usersCollection.find({}).toArray();

    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return `${d.getFullYear()}-${d.getMonth() + 1}`;
    }).reverse();

    const data = months.map((month) => ({
        month,
        users: users.filter((u) => {
            const date = new Date(u.createdAt);
            return date.getFullYear() === parseInt(month.split("-")[0]) &&
                date.getMonth() + 1 === parseInt(month.split("-")[1]);
        }).length,
    }));

    return new Response(JSON.stringify(data), { status: 200 });
}
