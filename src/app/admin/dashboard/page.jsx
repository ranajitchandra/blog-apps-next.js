"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Loading from "@/app/loading";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated" && session.user.role === "admin") {
            fetchUsers();
        }
    }, [status]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (res.ok) setUsers(data.users);
            else Swal.fire("Error", data.error || "Failed to load users", "error");
        } catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
        setLoading(false);
    };
    async function deleteUser(id) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the user permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                Swal.fire("Deleted!", data.message, "success");
                fetchUsers();
            } else {
                Swal.fire("Error", data.error || "Failed to delete user", "error");
            }
        }
    }

    async function updateRole(userId, newRole) {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire("Success", data.message, "success");
                fetchUsers(); // refresh the table
            } else {
                Swal.fire("Error", data.error || "Failed to update role", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    }


    if (status === "loading") return <Loading></Loading>;
    if (!session || session.user.role !== "admin") return <div className="text-center py-20 text-red-600">Access Denied</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">All Users</h1>

            {loading ? (
                <p className="text-gray-600">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-left text-gray-700">
                            <tr>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Role</th>
                                <th className="p-3 border">Make Role</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{user.name}</td>
                                    <td className="p-3 border">{user.email}</td>
                                    <td className="p-3 border">{user.role}</td>
                                    <td className="p-3 border">
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateRole(user._id, e.target.value)}
                                            className={`border p-1 rounded ${user._id === session.user.id ? "bg-gray-300 cursor-not-allowed" : ""}  `}
                                            disabled={user._id === session.user.id}
                                        >
                                            <option value="author">Author</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>

                                    <td className="p-3 border flex gap-3">
                                        {/* You can add role edit or delete actions here */}
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => deleteUser(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );


}
