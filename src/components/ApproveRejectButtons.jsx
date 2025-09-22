"use client";

import Swal from "sweetalert2";

export default function ApproveRejectButtons({ userId }) {
  const handleAction = async (action) => {
    // Confirmation dialog
    const confirmResult = await Swal.fire({
      title: `Are you sure you want to ${action} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: action === "approve" ? "#22c55e" : "#ef4444",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/${action}-author/${userId}`, { method: "POST" });

      if (res.ok) {
        // Success popup
        await Swal.fire({
          title: action === "approve" ? "Approved!" : "Rejected!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Reload page to update list
        window.location.reload();
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong!",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("approve")}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("reject")}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Reject
      </button>
    </div>
  );
}
