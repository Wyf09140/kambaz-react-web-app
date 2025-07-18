import React from "react";
import { useParams } from "react-router-dom";
import * as db from "../../Database";
import { FaUserCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";

export default function PeopleTable() {
  const { cid } = useParams();
  const users = db.users || [];
  const enrollments = db.enrollments || [];

  const enrolledUsersWithSection = users
    .map((user: any) => {
      const enrollment = enrollments.find(
        (enrollment: any) =>
          String(enrollment.user) === String(user._id) &&
          String(enrollment.course) === String(cid)
      );
      if (enrollment) {
        return {
          ...user,
          section: enrollment.section || user.section || "N/A", // 有就显示，没有就 fallback
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div id="wd-people-table">
      <h3>People for Course: {cid}</h3>

      <Table striped bordered hover>
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
          {enrolledUsersWithSection.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No users enrolled in this course.
              </td>
            </tr>
          ) : (
            enrolledUsersWithSection.map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <FaUserCircle className="me-2 fs-4 text-secondary" />
                  <span>{user.firstName} {user.lastName}</span>
                </td>
                <td>{user.loginId}</td>
                <td>{user.section}</td>
                <td>{user.role}</td>
                <td>{user.lastActivity}</td>
                <td>{user.totalActivity}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
