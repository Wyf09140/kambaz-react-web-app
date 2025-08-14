// src/Kambaz/Courses/Assignments/AssignmentControlButtons.tsx
import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import * as client from "./client";

export default function AssignmentControlButtons({
  assignmentId,
  onDeleted,
}: {
  assignmentId: string;
  onDeleted?: () => void; // ✅ 删除后让父组件刷新
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!assignmentId || deleting) return;
    const ok = window.confirm("Are you sure you want to delete this assignment?");
    if (!ok) return;
    try {
      setDeleting(true);
      await client.deleteAssignment(assignmentId); // ✅ 调用后端
      onDeleted?.(); // ✅ 通知父组件刷新列表
    } catch (e) {
      console.error("Delete assignment failed:", e);
      alert("Failed to delete assignment.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <GreenCheckmark />
      <FaTrash
        className={`text-danger ${deleting ? "opacity-50" : ""}`}
        style={{ cursor: deleting ? "not-allowed" : "pointer" }}
        onClick={handleDelete}
        aria-disabled={deleting}
        title={deleting ? "Deleting..." : "Delete"}
      />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
