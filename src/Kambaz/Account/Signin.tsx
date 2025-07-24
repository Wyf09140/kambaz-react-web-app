import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = () => {
    const user = db.users.find(
      (u: any) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!user) return; // 无效登录

    // ✅ 获取该用户的所有报名课程 ID
    const enrolledCourseIds = db.enrollments
      .filter((enrollment) => enrollment.user === user._id)
      .map((enrollment) => enrollment.course);

    // ✅ 附加到 user 对象上
    const enrichedUser = { ...user, enrolledCourseIds };

    // ✅ 存入 Redux + localStorage
    dispatch(setCurrentUser(enrichedUser));

    // ✅ 跳转到 Dashboard
    navigate("/Kambaz/Dashboard");
  };

  return (
    <div id="wd-signin-screen" className="p-4">
      <h1>Sign in</h1>
      <FormControl
        placeholder="Username"
        value={credentials.username || ""}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-3"
      />
      <FormControl
        type="password"
        placeholder="Password"
        value={credentials.password || ""}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-3"
      />
      <Button onClick={signin} className="w-100 mb-2">
        Sign In
      </Button>
      <Link to="/Kambaz/Account/Signup">Don't have an account? Sign up</Link>
    </div>
  );
}
