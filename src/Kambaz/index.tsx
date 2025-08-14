// src/Kambaz/index.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import KambazNavigation from "./Navigation";
import Account from "./Account";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import "./styles.css";
import * as accountClient from "./Account/client"; // enroll / unenroll

import * as courseClient from "./Courses/client";   // fetchAllCourses / createCourse / updateCourse / deleteCourse
import * as userClient from "./Account/client";     // 如果以后要按用户拉课，这里已经就绪

export default function Kambaz() {
  // 课程列表交给服务器维护；本地初始为空数组
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    _id: "NEW",
    name: "New Course",
    number: "CS0000",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
    image: "images/reactjs.jpg",
  });

  // 如果以后需要根据登录用户拉“我的课程”，这里能拿到 currentUser
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // 统一的获取课程函数
  const fetchCourses = async () => {
    try {
      // 作业要求：过滤交给服务器；这里拉取“全部课程”
      const list = await courseClient.fetchAllCourses();
      setCourses(list);

      // 如果你实现了“按用户过滤”的后端，可以换成：
      // if (currentUser?._id) {
      //   const mine = await userClient.findCoursesForUser(currentUser._id);
      //   setCourses(mine);
      // }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  // 首次加载 & 登录用户变更时，刷新课程列表
  useEffect(() => {
    fetchCourses();
  }, [currentUser?._id]); // 用户变化时可根据需要切换“我的课程”/“全部课程”

  // ===== CRUD =====
  const addNewCourse = async () => {
    try {
      const created = await courseClient.createCourse(course);
      // 也可以替换成 await fetchCourses(); 来避免与服务端不一致
      setCourses((prev) => [...prev, created]);
    } catch (err) {
      console.error("Create course failed:", err);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      // 或者：await fetchCourses();
    } catch (err) {
      console.error("Delete course failed:", err);
    }
  };

  const updateCourse = async () => {
    try {
      await courseClient.updateCourse(course);
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, ...course } : c))
      );
      // 或者：await fetchCourses();
    } catch (err) {
      console.error("Update course failed:", err);
    }
  };


  const updateEnrollment = async (courseId: string, enroll: boolean) => {
    if (!currentUser?._id) return;
    if (enroll) {
      await accountClient.enroll(currentUser._id, courseId);
    } else {
      await accountClient.unenroll(currentUser._id, courseId);
    }
    // 然后刷新课程列表（或者就地更新本地 courses 状态）
    await fetchCourses();
  };


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
                    updateEnrollment={updateEnrollment}
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
