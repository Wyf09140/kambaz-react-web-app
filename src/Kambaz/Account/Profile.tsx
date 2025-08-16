// src/Kambaz/Account/Profile.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl, Button } from "react-bootstrap";
import * as client from "./client";

type Role = "USER" | "ADMIN" | "FACULTY" | "STUDENT" | string;

type ProfileState = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;     // "YYYY-MM-DD"
  email: string;
  role: Role;
};

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [profile, setProfile] = useState<ProfileState>({
    _id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/Kambaz/Account/Signin");
      return;
    }
    // 将 currentUser 映射为受控输入的初值（确保都是字符串）
    setProfile({
      _id: currentUser._id ?? "",
      username: currentUser.username ?? "",
      password: currentUser.password ?? "",
      firstName: currentUser.firstName ?? "",
      lastName: currentUser.lastName ?? "",
      dob: toDateInput(currentUser.dob),
      email: currentUser.email ?? "",
      role: (currentUser.role as Role) ?? "USER",
    });
  }, [currentUser, navigate]);

  const signout = async () => {
    try {
      setErr(null); setOk(null);
      await client.signout();
      dispatch(setCurrentUser(null));
      navigate("/Kambaz/Account/Signin");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Sign out failed");
    }
  };

  const updateProfile = async () => {
    setErr(null); setOk(null);
    if (!profile._id) {
      setErr("Missing user id. Please sign in again.");
      return;
    }
    setLoading(true);
    try {
      // 发送给后端的 dob 尽量用 ISO；如果后端就是存 YYYY-MM-DD 也无妨
      const payload = {
        ...profile,
        dob: profile.dob ? new Date(profile.dob).toISOString() : "",
      };
      const updated = await client.updateUser(payload);
      // 将后端返回再规范回受控输入格式
      const normalized: ProfileState = {
        _id: updated._id ?? profile._id,
        username: updated.username ?? "",
        password: updated.password ?? "",
        firstName: updated.firstName ?? "",
        lastName: updated.lastName ?? "",
        dob: toDateInput(updated.dob),
        email: updated.email ?? "",
        role: (updated.role as Role) ?? profile.role,
      };
      setProfile(normalized);
      dispatch(setCurrentUser(updated));
      setOk("Profile updated successfully.");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>

      {err && <div className="alert alert-danger py-2">{err}</div>}
      {ok && <div className="alert alert-success py-2">{ok}</div>}

      <div>
        <FormControl
          placeholder="Username"
          className="mb-2"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />

        <FormControl
          type="password"
          placeholder="Password"
          className="mb-2"
          value={profile.password}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
        />

        <FormControl
          placeholder="First name"
          className="mb-2"
          value={profile.firstName}
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        />

        <FormControl
          placeholder="Last name"
          className="mb-2"
          value={profile.lastName}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        />

        <FormControl
          type="date"
          className="mb-2"
          value={profile.dob}
          onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
        />

        <FormControl
          placeholder="Email"
          className="mb-2"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />

        <select
          className="form-control mb-3"
          value={profile.role}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </select>

        <Button
          className="btn btn-primary w-100 mb-2"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>

        <Button
          variant="secondary"
          className="w-100 mb-2"
          id="wd-signout-btn"
          onClick={signout}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}

/** 将任意可解析日期转换为 <input type="date" /> 需要的 YYYY-MM-DD 字符串 */
function toDateInput(input: any): string {
  if (!input) return "";
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}
