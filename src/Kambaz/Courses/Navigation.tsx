import { Link, useParams, useLocation } from "react-router-dom";

export default function CourseNavigation() {
  const { cid } = useParams();
  const { pathname } = useLocation();

  const isActive = (section: string) =>
    pathname.includes(`/Courses/${cid}/${section}`);

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <Link to={`/Kambaz/Courses/${cid}/Home`}
        className={`list-group-item border-0 ${isActive("Home") ? "active" : "text-danger"}`}>Home</Link>

      <Link to={`/Kambaz/Courses/${cid}/Modules`}
        className={`list-group-item border-0 ${isActive("Modules") ? "active" : "text-danger"}`}>Modules</Link>

      <Link to={`/Kambaz/Courses/${cid}/Piazza`}
        className={`list-group-item border-0 ${isActive("Piazza") ? "active" : "text-danger"}`}>Piazza</Link>

      <Link to={`/Kambaz/Courses/${cid}/Zoom`}
        className={`list-group-item border-0 ${isActive("Zoom") ? "active" : "text-danger"}`}>Zoom</Link>

      <Link to={`/Kambaz/Courses/${cid}/Assignments`}
        className={`list-group-item border-0 ${isActive("Assignments") ? "active" : "text-danger"}`}>Assignments</Link>

      <Link to={`/Kambaz/Courses/${cid}/Quizzes`}
        className={`list-group-item border-0 ${isActive("Quizzes") ? "active" : "text-danger"}`}>Quizzes</Link>

      <Link to={`/Kambaz/Courses/${cid}/People`}
        className={`list-group-item border-0 ${isActive("People") ? "active" : "text-danger"}`}>People</Link>

      <Link to={`/Kambaz/Courses/${cid}/Grades`}
        className={`list-group-item border-0 ${isActive("Grades") ? "active" : "text-danger"}`}>Grades</Link>
    </div>
  );
}
