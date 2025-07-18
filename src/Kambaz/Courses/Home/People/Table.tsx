import { useParams } from "react-router-dom";
import * as db from "../../../Database";
import { FaUserCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";

export default function PeopleTable() {
  const { cid } = useParams(); 

  const users = db.users || [];
  const enrollments = db.enrollments || [];

  const enrolledUsersWithSection = users
    .map((usr: any) => {
      const enrollmentForCurrentCourse = enrollments.find(
      (e: any) =>
    String(e.user) === String(usr._id) &&
    String(e.course) === String(cid)
    );
      if (enrollmentForCurrentCourse) {
        return {
          ...usr,
          section: enrollmentForCurrentCourse.section,
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div id="wd-people-table">
      <h3>People for Course: {cid}</h3>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolledUsersWithSection.map((user: any) => (
            <tr key={user._id || `${user.firstName}-${user.lastName}`}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>{' '}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
