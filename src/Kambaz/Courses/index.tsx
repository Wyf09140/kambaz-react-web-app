import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaAlignJustify } from "react-icons/fa";

import CourseNavigation from "./Navigation";
import Home from "./Home";
import Modules from "./Modules";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import People from "./Home/People";
import * as coursesClient from "./client";

// ⬇️ 引入真正的 Quizzes 页面组件
import QuizList from "./Quizzes/Teacher/QuizList";
import QuizDetails from "./Quizzes/QuizDetails";
import QuizEditor from "./Quizzes/Teacher/QuizEditor";
import QuestionsEditor from "./Quizzes/Teacher/QuestionsEditor";
import TeacherPreview from "./Quizzes/Teacher/TeacherPreview";
import StudentTake from "./Quizzes/Student/StudentTake";
import QuizResult from "./Quizzes/Student/StudentTake";
import QuizGrades from "./Quizzes/Teacher/QuizGrades";
import Result from "./Quizzes/Student/Result";
import TeacherGrades from "./Quizzes/Teacher/TeacherGrades ";

export default function Courses() {
  const { cid } = useParams();
  const { pathname } = useLocation();

  const reduxCourses = useSelector((state: any) => {
    if (Array.isArray(state?.courses)) return state.courses;
    if (Array.isArray(state?.coursesReducer?.courses)) return state.coursesReducer.courses;
    return null;
  });

  const courseFromRedux = useMemo(() => {
    if (!reduxCourses || !cid) return null;
    return reduxCourses.find((c: any) => String(c._id) === String(cid)) || null;
  }, [reduxCourses, cid]);

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
  const section = pathname.split("/")[4] || "";

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

            {/* ✅ 用真正的 Quizzes 组件，而不是占位 */}
            <Route path="Quizzes" element={<QuizList />} />
            <Route path="Quizzes/:qid" element={<QuizDetails />} />
            <Route path="Quizzes/:qid/edit" element={<QuizEditor />} />
            <Route path="Quizzes/:qid/edit/questions" element={<QuestionsEditor />} /> 
            <Route path="Quizzes/:qid/preview" element={<TeacherPreview />} />
            <Route path="People" element={<People />} />
            <Route path="Quizzes/:qid/take" element={<StudentTake />} />
            <Route
              path="Courses/:cid/Quizzes/:qid/preview"
              element={<TeacherPreview />}
            />
            <Route path="Quizzes/:qid/result/:aid" element={<QuizResult />} />
            <Route path="Quizzes/:qid/grades" element={<QuizGrades />} />
            <Route path="Quizzes/:qid/result" element={<Result />} />
            <Route path="Quizzes/:qid/grades" element={<TeacherGrades />} />


          </Routes>
        </div>
      </div>
    </div>
  );
}
