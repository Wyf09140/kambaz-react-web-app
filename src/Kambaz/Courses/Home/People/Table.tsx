import { FaUserCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

type User = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  loginId?: string;
  section?: string;
  role?: string;
  lastActivity?: string | Date;
  totalActivity?: string;
} | null | undefined; // ✅ 接受 null/undefined，类型更贴近现实数据

function fmtDate(v?: string | Date) {
  if (!v) return "—";
  try {
    const d = typeof v === "string" ? new Date(v) : v;
    return d.toISOString().slice(0, 10);
  } catch {
    return String(v);
  }
}

export default function PeopleTable({ users = [] }: { users?: User[] }) {
  // ✅ 过滤掉空项；再过滤掉没有 _id 也没有名字的“不可展示项”
  const safeUsers = (Array.isArray(users) ? users : [])
    .filter(Boolean)
    .filter((u: any) => u?._id || u?.firstName || u?.lastName);

  return (
    <div id="wd-people-table">
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
          {safeUsers.map((u: any, idx: number) => {
            const key = u?._id ?? `${u?.firstName ?? ""}-${u?.lastName ?? ""}-${idx}`;
            const first = u?.firstName ?? "";
            const last = u?.lastName ?? "";
            const linkTo = u?._id ? `/Kambaz/Account/Users/${u._id}` : undefined;

            return (
              <tr key={key}>
                <td className="wd-full-name text-nowrap">
                  {linkTo ? (
                    <Link
                      to={linkTo}
                      className="text-decoration-none d-inline-flex align-items-center"
                    >
                      <FaUserCircle className="me-2 fs-2 text-secondary" />
                      <span className="wd-first-name">{first}</span>&nbsp;
                      <span className="wd-last-name">{last}</span>
                    </Link>
                  ) : (
                    <span className="d-inline-flex align-items-center">
                      <FaUserCircle className="me-2 fs-2 text-secondary" />
                      <span className="wd-first-name">{first}</span>&nbsp;
                      <span className="wd-last-name">{last}</span>
                    </span>
                  )}
                </td>
                <td className="wd-login-id">{u?.loginId ?? "—"}</td>
                <td className="wd-section">{u?.section ?? "—"}</td>
                <td className="wd-role">{u?.role ?? "—"}</td>
                <td className="wd-last-activity">{fmtDate(u?.lastActivity)}</td>
                <td className="wd-total-activity">{u?.totalActivity ?? "—"}</td>
              </tr>
            );
          })}
          {safeUsers.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                No people enrolled yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
