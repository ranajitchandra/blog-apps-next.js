"use client";

import Image from "next/image";

export default function About() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
                {/* Image */}
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src="https://i.ibb.co.com/r2VRKcqb/Next-js-Improving-Page-Speed-of-a-Server-Side-React-App-Blog-5a1d16211990968016fb01b3442d9fcc.png" // replace with your image
                        alt="About Us"
                        width={400}
                        height={400}
                        className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        About Our Blog
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Welcome to our blog! We share insightful articles, tips, and stories
                        from talented writers around the world. Our mission is to inspire,
                        educate, and entertain our readers every day.
                    </p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
}
