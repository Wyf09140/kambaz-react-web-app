
import { Link, useParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import AssignmentControlButtons from "./AssignmentControlButtons"; // 假设你有一个控制按钮组件
import CourseNavigation from "../Navigation"; // 你的课程内部导航组件
import { FaAlignJustify, FaPlusCircle, FaEllipsisV} from "react-icons/fa";

import * as db from "../../Database"; // 导入数据库对象

export default function Assignments() {
  const { cid } = useParams(); // 获取当前课程 ID

  // 过滤出属于当前课程的作业
  const courseAssignments = db.assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  return (
    <div className="d-flex">
      <CourseNavigation /> {/* 左侧导航栏 */}
      
      <div className="flex-grow-1 px-4"> 
        {/* 顶部标题 (注意：这里的课程名称是硬编码的，可以像 Courses/index.tsx 那样动态获取) */}
        <div id="wd-courses">
          <h2 className="text-danger">
            <FaAlignJustify className="me-4 fs-4 mb-1" />
            Course CS5610 Web Development {/* ⚠️ 考虑这里是否要动态显示课程名称 */}
          </h2>
          <hr />
        </div>
        
        {/* 主内容区域 */}
        <div className="flex-grow-1 p-3">
          {/* 顶部搜索栏 + 按钮 */}
          <div className="d-flex justify-content-between align-items-center my-3" id="wd-assignments-controls">
            <div className="d-flex align-items-center w-50">
              <input
                className="form-control"
                id="wd-search-assignment"
                placeholder="Search for Assignments"
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-secondary fw-bold" id="wd-add-assignment-group">
                <FaPlusCircle className="me-1" /> Group
              </button>
              <button className="btn btn-danger fw-bold" id="wd-add-assignment">
                <FaPlusCircle className="me-1" /> Assignment
              </button>
              <button className="btn btn-light border px-2 py-0">
                <FaEllipsisV />
              </button>
            </div>
          </div>
        </div>

        {/* ASSIGNMENTS 区块 */}
        <ListGroup className="rounded-0" id="wd-Assignments">
          <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
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

            {/* 作业列表 - 动态渲染 */}
            <ListGroup className="wd-lessons rounded-0">
              {courseAssignments.map((assignment: any) => (
                <ListGroup.Item key={assignment._id} className="wd-lesson p-3 ps-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      {/* 点击标题进入 Assignment Editor，使用动态 ID 构建链接 */}
                      <Link
                        to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                        className="wd-assignment-link text-dark text-decoration-none"
                      >
                        <BsGripVertical className="me-2" />
                        <MdAssignment className="me-2 text-success" />
                        {assignment.title} {/* 显示作业标题 */}
                      </Link>
                      <div className="text-muted small">
                        {/* 动态显示作业详情 */}
                        <span className="text-danger">Multiple Modules</span> |
                        <span className="fw-bold"> Not available until</span> {assignment.availableFromDate} at 12:00am |
                        <br />
                        <span className="fw-bold">Due</span> {assignment.dueDate} at 11:59pm | {assignment.points} pts
                        <br />
                        {assignment.description} {/* 显示作业描述 */}
                      </div>
                    </div>
                    <AssignmentControlButtons />
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