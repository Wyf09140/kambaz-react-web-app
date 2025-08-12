// src/Courses/People/Table.tsx
import { FaUserCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";
import PeopleDetails from "./Details";
import { Link } from "react-router";

type User = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  loginId?: string;
  section?: string;
  role?: string;
  lastActivity?: string | Date;
  totalActivity?: string;
};

export default function PeopleTable({ users = [] }: { users?: User[] }) {
  const fmtDate = (v?: string | Date) => {
    if (!v) return "—";
    try {
      const d = typeof v === "string" ? new Date(v) : v;
      // 仅日期部分：YYYY-MM-DD
      return d.toISOString().slice(0, 10);
    } catch {
      return String(v);
    }
  };

  return (
    <div id="wd-people-table">
      <PeopleDetails />

      <Table striped hover responsive className="align-middle">
        <thead>
          <tr>
            <th style={{ width: 380 }}>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id || `${user.firstName}-${user.lastName}`}>
              <td className="text-nowrap">
               <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">

                <FaUserCircle className="me-2 fs-2 text-secondary align-middle" />
                <span className="fw-semibold align-middle">
                  {user.firstName} {user.lastName}
                </span>
               </Link>
              </td>
              <td className="wd-login-id">{user.loginId ?? "—"}</td>
              <td className="wd-section">{user.section ?? "—"}</td>
              <td className="wd-role">{user.role ?? "—"}</td>
              <td className="wd-last-activity">{fmtDate(user.lastActivity)}</td>
              <td className="wd-total-activity">{user.totalActivity ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
