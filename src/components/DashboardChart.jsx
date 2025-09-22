"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

export default function DashboardChart() {
    const [postsData, setPostsData] = useState([]);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        // Fetch posts per category
        fetch("/api/admin/posts-per-category")
            .then((res) => res.json())
            .then((data) => setPostsData(data))
            .catch((err) => console.error(err));

        // Fetch users signup stats
        fetch("/api/admin/users-per-month")
            .then((res) => res.json())
            .then((data) => setUsersData(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg space-y-10">
            <h2 className="text-2xl font-bold text-gray-700">Dashboard Charts</h2>

            {/* Posts per Category - Bar Chart */}
            <div className="w-full h-80">
                <h3 className="text-lg font-semibold mb-2">Posts Per Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={postsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Users Signups Over Time - Line Chart */}
            <div className="w-full h-80">
                <h3 className="text-lg font-semibold mb-2">New Users Over Time</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usersData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
