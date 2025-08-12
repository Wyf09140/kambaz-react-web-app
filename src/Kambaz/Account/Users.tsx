import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PeopleTable from "../Courses/Home/People/Table";
import * as client from "./client";
import { FormControl, Row, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const { uid } = useParams();

  const fetchUsers = async () => {
    const list = await client.findAllUsers();
    setUsers(list);
  };

  const filterUsersByRole = async (val: string) => {
    setRole(val);
    if (val) {
      const list = await client.findUsersByRole(val);
      setUsers(list);
    } else {
      fetchUsers();
    }
  };

  const filterUsersByName = async (val: string) => {
    setName(val);
    if (val) {
      const list = await client.findUsersByPartialName(val);
      setUsers(list);
    } else {
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [uid]);

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };

  return (
    <div>

      <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
        <FaPlus className="me-2" />
        Users
      </button>

      <h3 className="mb-3">Users</h3>

      {/* 控件行 */}
      <Row className="g-2 mb-3">
        <Col xs={12} md={6}>
          <FormControl
            value={name}
            onChange={(e) => filterUsersByName(e.target.value)}
            placeholder="Search people"
            className="wd-filter-by-name"
          />
        </Col>
        <Col xs={12} md={6}>
          <select
            value={role}
            onChange={(e) => filterUsersByRole(e.target.value)}
            className="form-select wd-select-role"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Administrators</option>
            <option value="USER">Users</option>
            {/* 注意：如果 schema 里没有 TA，就不要放 TA */}
          </select>
        </Col>
      </Row>

      {/* 表格行（自然在下面） */}
      <PeopleTable users={users} />
    </div>
  );
}
