import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";

export default function AssignmentControlButtons({ assignmentId }: { assignmentId: string }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this assignment?");
    if (confirm) {
      dispatch(deleteAssignment(assignmentId));
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <GreenCheckmark />
      <FaTrash className="text-danger" style={{ cursor: "pointer" }} onClick={handleDelete} />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
