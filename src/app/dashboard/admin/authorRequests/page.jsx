import ApproveRejectButtons from "@/components/ApproveRejectButtons";
import { getUsersCollection } from "@/lib/mongodb";

export default async function AuthorRequestsPage() {
  const usersCollection = await getUsersCollection();
  const requests = await usersCollection.find({ authorRequest: true }).toArray();

  // Convert ObjectId to string
  const serializableRequests = requests.map(user => ({
    ...user,
    _id: user._id.toString()
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Author Requests</h1>
      {serializableRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul className="space-y-4">
          {serializableRequests.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-sm"
            >
              <div>
                <strong>{user.name}</strong> ({user.email})
              </div>
              <ApproveRejectButtons userId={user._id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
