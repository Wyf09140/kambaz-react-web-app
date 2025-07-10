import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import AssignmentControlButtons from "./AssignmentControlButtons";
import CourseNavigation from "../Navigation";
import { FaAlignJustify } from "react-icons/fa";  // 别忘了引入图标

export default function Assignments() {
  return (
    <div className="d-flex">
      <CourseNavigation /> {/* 左侧导航栏 */}
      
      <div className="flex-grow-1 px-4">  {/* ✅ 右边内容容器 */}
        {/* 🔺顶部标题 */}
        <div id="wd-courses">
          <h2 className="text-danger">
            <FaAlignJustify className="me-4 fs-4 mb-1" />
            Course CS5610 Web Development
          </h2>
          <hr />
        </div>
        
      <div className="flex-grow-1 p-3"> {/* 主内容区域 */}
        {/* 顶部搜索栏 + 按钮 */}
        <div className="d-flex justify-content-between align-items-center my-3" id="wd-assignments">
          <div className="d-flex align-items-center w-50">
            <input
              className="form-control"
              id="wd-search-assignment"
              placeholder="Search for Assignments"
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary fw-bold" id="wd-add-assignment-group">+ Group</button>
            <button className="btn btn-danger fw-bold" id="wd-add-assignment">+ Assignment</button>
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
                <button className="btn btn-light border px-2 py-0">⋮</button>
              </div>
            </div>

            {/* Assignment 列表 */}
            <ListGroup className="wd-lessons rounded-0">
              {/* Assignment 1 */}
              <ListGroup.Item className="wd-lesson p-3 ps-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Link to="a1-env-html" className="wd-assignment-link text-dark text-decoration-none">
                      <BsGripVertical className="me-2" />
                      <MdAssignment className="me-2 text-success" />
                      A1 - ENV + HTML
                    </Link>
                    <div className="text-muted small">
                      <span className="text-danger">Multiple Modules</span> |
                      <span className="fw-bold"> Not available until</span> May 6 at 12:00am |
                      <br />
                      <span className="fw-bold">Due</span> May 13 at 11:59pm | 100 pts
                    </div>
                  </div>
                  <AssignmentControlButtons />
                </div>
              </ListGroup.Item>

              {/* Assignment 2 */}
              <ListGroup.Item className="wd-lesson p-3 ps-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Link to="a2-css-bootstrap" className="wd-assignment-link text-dark text-decoration-none">
                      <BsGripVertical className="me-2" />
                      <MdAssignment className="me-2 text-success" />
                      A2 - CSS + BOOTSTRAP
                    </Link>
                    <div className="text-muted small">
                      <span className="text-danger">Multiple Modules</span> |
                      <span className="fw-bold"> Not available until</span> May 13 at 12:00am |
                      <br />
                      <span className="fw-bold">Due</span> May 20 at 11:59pm | 100 pts
                    </div>
                  </div>
                  <AssignmentControlButtons />
                </div>
              </ListGroup.Item>

              {/* Assignment 3 */}
              <ListGroup.Item className="wd-lesson p-3 ps-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Link to="a3-js-react" className="wd-assignment-link text-dark text-decoration-none">
                      <BsGripVertical className="me-2" />
                      <MdAssignment className="me-2 text-success" />
                      A3 - JAVASCRIPT + REACT
                    </Link>
                    <div className="text-muted small">
                      <span className="text-danger">Multiple Modules</span> |
                      <span className="fw-bold"> Not available until</span> May 20 at 12:00am |
                      <br />
                      <span className="fw-bold">Due</span> May 27 at 11:59pm | 100 pts
                    </div>
                  </div>
                  <AssignmentControlButtons />
                </div>
              </ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}
