import { NavLink, useParams } from "react-router-dom";

export default function CourseNavigation() {
  const { cid } = useParams();

  const items = [
    { path: "Home", label: "Home" },
    { path: "Modules", label: "Modules" },
    { path: "Piazza", label: "Piazza" },
    { path: "Zoom", label: "Zoom" },
    { path: "Assignments", label: "Assignments" },
    { path: "Quizzes", label: "Quizzes" },
    { path: "People", label: "People" },
    { path: "Grades", label: "Grades" },
  ];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {items.map(({ path, label }) => (
        <NavLink
          key={path}
          to={`/Kambaz/Courses/${cid}/${path}`}
          className={({ isActive }) =>
            "list-group-item border-0 " + (isActive ? "active" : "text-danger")
          }
          end
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
