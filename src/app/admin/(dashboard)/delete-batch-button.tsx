"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBatchButton({ batchId }: { batchId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this import batch? This will permanently delete ALL products imported in this batch!")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/import/batch/${batchId}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error("Failed to delete batch");
      }
      router.refresh();
    } catch (err) {
      alert("Failed to delete the import sheet and products.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: "#fee2e2",
        color: "#b91c1c",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        fontSize: "12px"
      }}
    >
      {loading ? "Deleting..." : "Delete Sheet & Products"}
    </button>
  );
}
