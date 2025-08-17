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
import QuizPreview from "./Courses/Quizzes/QuizPreview";
import TakeQuiz from "./Courses/Quizzes/TakeQuiz";
import ProjectInfo from "./Account/ProjectInfo";

export default function Kambaz() {
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

  // ✅ 补充这两个本地状态，满足 Dashboard 的 props 要求
  const [enrolling, setEnrolling] = useState(false);

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchCourses = async () => {
    try {
      const list = await courseClient.fetchAllCourses();
      setCourses(list);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentUser?._id]);

  const addNewCourse = async () => {
    try {
      const created = await courseClient.createCourse(course);
      setCourses((prev) => [...prev, created]);
    } catch (err) {
      console.error("Create course failed:", err);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
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
    await fetchCourses();
  };

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route index element={<Navigate to="Account/Signin" replace />} />
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
                    enrolling={enrolling}           // ✅ 新增
                    setEnrolling={setEnrolling}     // ✅ 新增
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
            <Route path="Courses/:cid/Quizzes/:qid/preview" element={<QuizPreview />} />
            <Route path="Courses/:cid/Quizzes/:qid/take" element={<TakeQuiz />} />
            <Route path="*" element={<Navigate to="Account/Signin" replace />} />
            <Route path="/" element={<Navigate to="Dashboard" />} />
            <Route path="Account/*" element={<Account />} />
            <Route path="Account/ProjectInfo" element={<ProjectInfo />} />  {/* ✅ 新增 */}
  


          </Routes>
        </div>
      </div>
    </Session>
  );
}
