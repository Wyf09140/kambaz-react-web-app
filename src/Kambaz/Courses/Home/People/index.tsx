// src/Kambaz/Courses/Home/People/index.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PeopleTable from "./Table";
import * as client from "../../../Account/client";

export default function People() {
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    if (!cid) return;
    try {
      // 调用后端 API 获取某课程的用户
      const data = await client.findUsersForCourse(cid);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users for course:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [cid]);

  return <PeopleTable users={users} />;
}
