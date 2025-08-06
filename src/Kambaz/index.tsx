// src/Kambaz/index.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import * as courseClient from "./Courses/client";
import Account from "./Account";
import KambazNavigation from "./Navigation";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import "./styles.css";
import * as userClient from "./Account/client";


// ✅ 新增：课程客户端（示例）
import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const findAllCourses = async () => {
  const { data } = await axios.get(COURSES_API, { withCredentials: true });
  return data;
};

export default function Kambaz() {
  // ❌ const [courses, setCourses] = useState<any[]>(db.courses);
  // ✅ 初始为空数组，由服务器填充
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    _id: "1234",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
  });

  // （可选）如果你仍然支持在前端临时创建课程
  const addNewCourse = async () => {
    const newCourse = await userClient.createCourse(course);
    setCourses([ ...courses, newCourse ]);
  };


  const deleteCourse = async (courseId: string) => {
       await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId));
}

  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(courses.map((c) => {
        if (c._id === course._id) { return course; }
        else { return c; }
    })
  );};


  // 如果你需要根据登录用户来过滤课程，这里可以拿到 currentUser
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchCourses = async () => {
    try {
      const list = await findAllCourses(); // 先拉全部课程
      setCourses(list);
      // 之后如果有“我的课程”API：await findMyCourses(currentUser._id)
    } catch (err) {
      console.error(err);
    }
  };

  // 登录状态变化或首次加载时拉取课程
  useEffect(() => {
    fetchCourses();
  }, [currentUser?._id]); // 没有 currentUser 也能工作

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Dashboard" />} />
            <Route path="Account/*" element={<Account />} />

            <Route
              path="Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    courses={courses}
                    course={course}
                    setCourse={setCourse}
                    addNewCourse={addNewCourse}
                    deleteCourse={deleteCourse}
                    updateCourse={updateCourse}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />

            <Route path="Calendar" element={<h1>Calendar</h1>} />
            <Route path="Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
