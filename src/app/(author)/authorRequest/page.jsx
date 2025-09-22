"use client";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ApplyAuthorButton({ userRole, hasRequested }) {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(hasRequested);

  const handleRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/request-author", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setRequested(true);
        Swal.fire({
          title: "Request Sent!",
          text: data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Failed",
          text: data.message || "Failed to send request",
          icon: "error",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to send request",
        icon: "error",
      });
    }
    setLoading(false);
  };

  if (userRole === "author") return null; // already author

  return (
    <button
      onClick={handleRequest}
      disabled={requested || loading}
      className={`px-3 py-1 rounded-lg text-sm ${
        requested || loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {requested ? "Request Sent" : "Apply for Author"}
    </button>
  );
}
