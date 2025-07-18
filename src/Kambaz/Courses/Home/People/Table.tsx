import React from "react";
import { useParams } from "react-router-dom";
import * as db from "../../../Database"; // 确保路径正确，根据您的实际文件结构调整
import { Table } from "react-bootstrap"; // 导入 Table 组件
import { FaUserCircle } from "react-icons/fa"; // 导入 FaUserCircle 图标

export default function PeopleTable() {
  const { cid } = useParams(); // 获取当前课程的 ID

  // 从数据库中解构出 users 和 enrollments
  const { users, enrollments } = db;

  // 获取在当前课程中注册的所有用户和他们的具体 section
  const enrolledUsersWithSection = users
    .map((usr: any) => {
      // 找到该用户在当前课程中的注册信息
      const enrollmentForCurrentCourse = enrollments.find(
        (enrollment: any) => enrollment.user === usr._id && enrollment.course === cid
      );
      // 如果用户注册了当前课程，则返回用户数据和该注册对应的 section
      if (enrollmentForCurrentCourse) {
        return {
          ...usr, // 复制用户的所有原始信息
          section: enrollmentForCurrentCourse.section, // 覆盖或添加该课程下的具体 section
        };
      }
      return null; // 如果用户未注册当前课程，则返回 null
    })
    .filter(Boolean); // 过滤掉所有 null 值（即未注册当前课程的用户）

  return (
    <div id="wd-people-table">
      <h3>People for Course: {cid}</h3>

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th> {/* 保持 Section 列头不变 */}
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolledUsersWithSection.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>{' '}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td> {/* 这里现在会显示在当前课程下的 Section */}
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