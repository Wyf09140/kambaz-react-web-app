import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // 路径统一用和路由一致的前缀与大小写
  const base = "/Kambaz/Account";

  // 计算是否激活（忽略大小写）
  const isActive = (p: string) =>
    pathname.toLowerCase().includes(p.toLowerCase());

  // 基础链接
  const links = currentUser
    ? [{ label: "Profile", path: `${base}/Profile` }]
    : [
        { label: "Signin", path: `${base}/Signin` },
        { label: "Signup", path: `${base}/Signup` },
      ];

  // ADMIN 才看到 Users
  if (currentUser && currentUser.role === "ADMIN") {
    links.push({ label: "Users", path: `${base}/Users` });
  }

  return (
    <div
      className="d-flex flex-column pe-4 ps-3 pt-4 border-end"
      style={{ height: "100vh", minWidth: "150px" }}
    >
      {links.map(({ label, path }) => (
        <div
          key={label}
          className={`ps-2 mb-2 ${isActive(path) ? "border-start border-dark fw-bold" : ""}`}
        >
          <Link
            to={path}
            className={`text-decoration-none ${isActive(path) ? "text-dark" : "text-danger"}`}
            style={{ fontSize: "1rem" }}
          >
            {label}
          </Link>
        </div>
      ))}
    </div>
  );
}
