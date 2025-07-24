import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router-dom";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./Home/People/Table";
import { useSelector } from "react-redux";

export default function Courses() {
  const { cid } = useParams();
  const { pathname } = useLocation();

  // ✅ 从 Redux 中获取课程列表
  const courses = useSelector((state: any) => state.courses); // 取决于你在 store.ts 里注册的 key 名
  const course = courses.find((course: any) => course._id === cid);

  if (!course) return <div className="text-danger">Course not found.</div>;

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course._id} - {course.name} &gt; {pathname.split("/")[4]}
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
            <Route path="People" element={<PeopleTable />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
