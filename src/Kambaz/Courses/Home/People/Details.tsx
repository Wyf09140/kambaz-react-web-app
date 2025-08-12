import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../../../Account/client";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { FormControl, FormSelect } from "react-bootstrap";

const ROLE_OPTIONS = ["STUDENT", "FACULTY", "ADMIN", "USER"] as const;

export default function PeopleDetails() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>({});
  const [editing, setEditing] = useState(false);

  // 本地编辑用的受控状态
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<typeof ROLE_OPTIONS[number] | "">("");

  const loadUser = async () => {
    if (!uid) return;
    const u = await client.findUserById(uid);
    setUser(u);
  };

  useEffect(() => {
    loadUser();
  }, [uid]);

  // 进入编辑态时，用当前用户值初始化本地状态
  const startEditing = () => {
    setName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());
    setEmail(user.email ?? "");
    setRole((user.role as any) ?? "");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveUser = async () => {
    const [firstName = "", lastName = ""] = name.trim().split(/\s+/, 2);
    const updated = { ...user, firstName, lastName, email, role };
    await client.updateUser(updated);
    setUser(updated);
    setEditing(false);
    // 如果作业要求保存后关闭面板，就保留这一行；否则可以去掉
    // navigate(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveUser();
  };

  const deleteUser = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Confirm delete this user?")) return;
    await client.deleteUser(id);
    navigate(-1);
  };

  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      {/* 关闭按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="btn position-absolute end-0 top-0 wd-close-details"
        aria-label="Close"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      {/* 头像 */}
      <div className="text-center mt-2 mb-3">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />

      {/* 标题 + 编辑图标 */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        {!editing ? (
          <>
            <div
              className="text-danger fs-4 wd-name"
              role="button"
              onClick={startEditing}
              title="Click to edit name"
            >
              {user.firstName} {user.lastName}
            </div>
            <FaPencil
              className="fs-5 wd-edit"
              role="button"
              onClick={startEditing}
              title="Edit"
            />
          </>
        ) : (
          <>
            <div className="w-100 me-2">
              <FormControl
                className="wd-edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="First Last"
              />
            </div>
            <FaCheck
              className="fs-5 wd-save"
              role="button"
              onClick={saveUser}
              title="Save"
            />
          </>
        )}
      </div>

      {/* 其它字段（支持编辑 email / role） */}
      <div className="small">
        <div className="mb-2">
          <b>Roles:</b>{" "}
          {!editing ? (
            <span className="wd-roles text-uppercase">{user.role}</span>
          ) : (
            <FormSelect
              className="wd-edit-role mt-1"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="" disabled>
                Select role
              </option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </FormSelect>
          )}
        </div>

        <div className="mb-2">
          <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span>
        </div>

        <div className="mb-2">
          <b>Section:</b> <span className="wd-section">{user.section}</span>
        </div>

        <div className="mb-2">
          <b>Email:</b>{" "}
          {!editing ? (
            <span className="wd-email">{user.email ?? "—"}</span>
          ) : (
            <FormControl
              type="email"
              className="wd-edit-email mt-1"
              value={email}
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
            />
          )}
        </div>

        <div className="mb-1">
          <b>Total Activity:</b>{" "}
          <span className="wd-total-activity">{user.totalActivity}</span>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        {editing ? (
          <>
            <button className="btn btn-outline-secondary" onClick={cancelEditing}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveUser}>
              Save
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={() => deleteUser(uid!)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
