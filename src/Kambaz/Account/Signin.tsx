// src/Kambaz/Account/Signin.tsx
import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";       // 如果没有可移除 enrichment 逻辑
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function doSignin() {
    setError("");
    setPending(true);
    try {
      const user = await client.signin(credentials);
      if (!user) {
        setError("Invalid username or password");
        return;
      }

      // 可选的 enrichment：把报名课程 ID 附在 user 上（若 db.enrollments 存在）
      let enriched = user as any;
      if (db?.enrollments) {
        const enrolledCourseIds = db.enrollments
          .filter((en: any) => en.user === user._id)
          .map((en: any) => en.course);
        enriched = { ...user, enrolledCourseIds };
      }

      dispatch(setCurrentUser(enriched));
      navigate("/Kambaz/Dashboard");
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Sign in failed");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault(); // 防止默认刷新
    void doSignin();
  }

  return (
    <div id="wd-signin-screen" className="p-4" style={{ maxWidth: 560 }}>
      <h3 className="mb-3">Sign in</h3>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <form onSubmit={onSubmit}>
        <FormControl
          id="username"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials((c) => ({ ...c, username: e.target.value }))
          }
          autoComplete="username"
          className="mb-3"
        />
        <FormControl
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((c) => ({ ...c, password: e.target.value }))
          }
          autoComplete="current-password"
          className="mb-3"
        />

        <Button
          type="submit"
          className="w-100 mb-2"
          disabled={pending || !credentials.username || !credentials.password}
        >
          {pending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <Link to="/Kambaz/Account/Signup">Don&apos;t have an account? Sign up</Link>
    </div>
  );
}
