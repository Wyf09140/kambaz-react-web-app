import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaAlignJustify } from "react-icons/fa";

import CourseNavigation from "./Navigation";
import Home from "./Home";
import Modules from "./Modules";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";

// ✅ 用容器组件 People（会自己去调 /api/courses/:cid/users）
import People from "./Home/People";
// （可选）当 Redux 没有 courses 时，兜底从服务器拿一下课程名
import * as coursesClient from "./client";

export default function Courses() {
  const { cid } = useParams();
  const { pathname } = useLocation();

  // 1) 先尝试从 Redux 里拿（如果你的项目确实把 courses 放进了 Redux）
  const reduxCourses = useSelector((state: any) => {
    // 兼容多种命名：state.courses 或 state.coursesReducer.courses
    if (Array.isArray(state?.courses)) return state.courses;
    if (Array.isArray(state?.coursesReducer?.courses)) return state.coursesReducer.courses;
    return null;
  });

  const courseFromRedux = useMemo(() => {
    if (!reduxCourses || !cid) return null;
    return reduxCourses.find((c: any) => String(c._id) === String(cid)) || null;
  }, [reduxCourses, cid]);

  // 2) 如果 Redux 没有，就兜底到服务端取一下（只为标题展示课程名，不影响页面路由功能）
  const [fallbackCourse, setFallbackCourse] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      if (courseFromRedux || !cid) {
        setFallbackCourse(null);
        return;
      }
      try {
        const list = await coursesClient.fetchAllCourses();
        const found = list.find((c: any) => String(c._id) === String(cid));
        setFallbackCourse(found || null);
      } catch {
        setFallbackCourse(null);
      }
    };
    load();
  }, [cid, courseFromRedux]);

  const courseName = courseFromRedux?.name || fallbackCourse?.name || "";
  const section = pathname.split("/")[4] || ""; // e.g. Home / Modules / People

  // 不再在这里因为找不到课程就直接报错；即使没拿到名字，页面依然能正常工作
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {cid} {courseName && <>- {courseName}</>} &gt; {section}
      </h2>
      <hr />

      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>

        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/new" element={<AssignmentEditor />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />

            {/* ✅ 改为容器组件：内部自己拉取用户并渲染 Table */}
            <Route path="People" element={<People />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
