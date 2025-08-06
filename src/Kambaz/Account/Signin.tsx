import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";      // 必须能导出 enrollments 数组
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async () => {
    setError("");
    try {
      const user = await client.signin(credentials);
      if (!user) {
        setError("Invalid username or password");
        return;
      }

      // ✅ enrichment：把该用户的报名课程 ID 附加到 user 上
      const enrolledCourseIds = db.enrollments
        .filter((en) => en.user === user._id)
        .map((en) => en.course);

      const enrichedUser = { ...user, enrolledCourseIds };

      dispatch(setCurrentUser(enrichedUser));
      navigate("/Kambaz/Dashboard");
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Sign in failed");
    }
  };

  return (
    <div id="wd-signin-screen" className="p-4">
      <h1>Sign in</h1>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

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
