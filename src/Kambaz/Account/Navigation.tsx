import { Link, useLocation } from "react-router-dom";

export default function AccountNavigation() {
  const { pathname } = useLocation();

  const links = [
    { label: "Signin", path: "/Kambaz/Account/Signin" },
    { label: "Signup", path: "/Kambaz/Account/Signup" },
    { label: "Profile", path: "/Kambaz/Account/Profile" },
  ];

  return (
    <div
      className="d-flex flex-column pe-4 ps-3 pt-4 border-end"
      style={{ height: "100vh", minWidth: "150px" }}
    >
      {links.map(({ label, path }) => {
        const isActive = pathname.includes(label);
        return (
          <div
            key={label}
            className={`ps-2 mb-2 ${isActive ? "border-start border-dark fw-bold" : ""}`}
          >
            <Link
              to={path}
              className={`text-decoration-none ${
                isActive ? "text-dark" : "text-danger"
              }`}
              style={{ fontSize: "1rem" }}
            >
              {label}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
