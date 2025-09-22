"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchPosts(1, selectedCategory);
    }, [selectedCategory]);

    // Fetch posts with pagination + category
    const fetchPosts = async (page = 1, categoryId = "all") => {
        setIsLoading(true);
        try {
            // fetchPosts
            const res = await fetch(
                `/api/posts/with-categories?page=${page}&limit=5&categoryId=${categoryId}`
            );

            const data = await res.json();
            setPosts(data.posts || []);
            setCategories(data.categories || []);
            setPagination(data.pagination || { page: 1, totalPages: 1 });
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
            setCategories([]);
        }
        setIsLoading(false);
    };

    // Date formatter
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    // Handle pagination click
    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1; // 0-based → 1-based
        fetchPosts(selectedPage, selectedCategory);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-gray-600">Loading posts...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 font-sans">
            {/* Page Header */}
            <header className="text-center mb-12 pb-6 border-b-4 border-blue-500">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Our Blog</h1>
                <p className="text-lg text-gray-600">
                    Discover amazing stories and insights from our writers
                </p>
                <div className="mt-4 text-blue-600 font-semibold">
                    {posts.length} {posts.length === 1 ? "Post" : "Posts"} on this page
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Side (Posts) */}
                <div className="col-span-9 flex flex-col gap-8">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-100 rounded-lg text-gray-600">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No Posts Found
                            </h3>
                            <p>There are no posts available at the moment.</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <article
                                key={post._id}
                                className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="grid grid-cols-12 gap-4 justify-center">
                                    {/* Image */}
                                    {post.featuredImage && (
                                        <div className="col-span-3 flex items-center justify-center p-4">
                                            <Link href={`/post/${post._id}`}>
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-40 h-40 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                />
                                            </Link>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="col-span-9 p-6">
                                        <div className="flex flex-col h-full">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                                                <Link href={`/post/${post._id}`}>
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            <p className="text-gray-700 leading-relaxed">
                                                {post.content
                                                    .split(" ")
                                                    .slice(0, 20)
                                                    .join(" ") + "..."}
                                            </p>
                                            <div className="mt-4 flex gap-4 text-gray-500 mb-4">
                                                <span>
                                                    👤 <strong>By:</strong> {post.authorName}
                                                </span>
                                                <span>
                                                    📅 <strong>Published:</strong>{" "}
                                                    {formatDate(post.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* Right Side (Categories) */}
                <div className="col-span-3 border border-gray-200 p-4 rounded-lg bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Categories</h2>
                    <ul className="space-y-2">
                        <li
                            onClick={() => setSelectedCategory("all")}
                            className={`cursor-pointer p-2 rounded-md flex justify-between hover:bg-blue-100 ${selectedCategory === "all"
                                ? "bg-blue-500 text-white"
                                : "text-gray-700"
                                }`}
                        >
                            <span>All</span>
                            <span>{categories.reduce((sum, c) => sum + c.count, 0)}</span>
                        </li>

                        {categories.map((cat) => (
                            <li
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                className={`cursor-pointer p-2 rounded-md flex justify-between hover:bg-blue-100 ${selectedCategory === cat._id
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700"
                                    }`}
                            >
                                <span>{cat.name}</span>
                                <span>{cat.count}</span>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-10">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="▶"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={pagination.totalPages}
                        previousLabel="◀"
                        renderOnZeroPageCount={null}
                        containerClassName="flex gap-2 text-gray-700"
                        pageClassName="px-3 py-1 border rounded hover:bg-blue-100"
                        activeClassName="bg-blue-500 text-white"
                        previousClassName="px-3 py-1 border rounded hover:bg-blue-100"
                        nextClassName="px-3 py-1 border rounded hover:bg-blue-100"
                        disabledClassName="opacity-50 cursor-not-allowed"
                        forcePage={(pagination.page || 1) - 1}
                    />
                </div>
            )}
        </div>
    );
}
