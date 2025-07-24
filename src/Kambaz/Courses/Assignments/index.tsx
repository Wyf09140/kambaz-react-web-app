import { Link, useParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import { FaPlusCircle, FaEllipsisV } from "react-icons/fa";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { useSelector } from "react-redux";

export default function Assignments() {
  const { cid } = useParams(); // 当前课程 ID

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const assignments = useSelector((state: any) => state.assignmentsReducer);
  const courseAssignments = assignments.filter((a: any) => a.course === cid);

  return (
    <div className="d-flex">
      <div className="flex-grow-1 p-3">
        {/* 顶部搜索栏 + 添加按钮 */}
        <div className="d-flex justify-content-between align-items-center my-3">
          <div className="d-flex align-items-center w-50">
            <input
              className="form-control"
              placeholder="Search for Assignments"
            />
          </div>
          {isFaculty && (
            <div className="d-flex gap-2">
              <Link
                to={`/Kambaz/Courses/${cid}/Assignments/new`}
                className="btn btn-danger fw-bold"
              >
                <FaPlusCircle className="me-1" /> Assignment
              </Link>
            </div>
          )}
        </div>

        {/* ASSIGNMENTS 区块 */}
        <ListGroup className="rounded-0">
          <ListGroup.Item className="p-0 mb-5 fs-5 border-gray">
            {/* 标题行 */}
            <div className="p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-5" />
                <span className="fw-bold">ASSIGNMENTS</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="px-3 py-1 rounded-pill border border-secondary small">
                  40% of Total
                </div>
                <button className="btn btn-light border px-2 py-0 fw-bold">+</button>
                <button className="btn btn-light border px-2 py-0">
                  <FaEllipsisV />
                </button>
              </div>
            </div>

            {/* 作业列表 */}
            <ListGroup className="rounded-0">
              {courseAssignments.map((assignment: any) => (
                <ListGroup.Item key={assignment._id} className="p-3 ps-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Link
                        to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                        className="text-dark text-decoration-none"
                      >
                        <BsGripVertical className="me-2" />
                        <MdAssignment className="me-2 text-success" />
                        {assignment.title}
                      </Link>
                      <div className="text-muted small">
                        <span className="text-danger">Multiple Modules</span> |{" "}
                        <span className="fw-bold">Not available until</span>{" "}
                        {assignment.availableFromDate} at 12:00am |
                        <br />
                        <span className="fw-bold">Due</span>{" "}
                        {assignment.dueDate} at 11:59pm | {assignment.points} pts
                        <br />
                        {assignment.description}
                      </div>
                    </div>

                    {/* 控制按钮（✅传入 assignmentId） */}
                    {isFaculty && (
                      <AssignmentControlButtons assignmentId={assignment._id} />
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}
