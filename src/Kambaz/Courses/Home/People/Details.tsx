import { useEffect, useState, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom"; // ✅ 改：从 react-router-dom 导入
import * as client from "../../../Account/client";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { FormControl, FormSelect, Spinner, Alert } from "react-bootstrap";

const ROLE_OPTIONS = ["STUDENT", "FACULTY", "ADMIN", "USER"] as const;

export default function PeopleDetails() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  // 本地编辑用的受控状态
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<typeof ROLE_OPTIONS[number] | "">("");

  const [loading, setLoading] = useState(true);   // ✅ 新增：加载态
  const [error, setError] = useState<string>(""); // ✅ 新增：错误态

  const loadUser = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    setError("");
    try {
      const u = await client.findUserById(uid);
      setUser(u ?? null);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load user.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    setEditing(false); // ✅ 切换 uid 时退出编辑态，避免状态串台
    loadUser();
  }, [uid, loadUser]);

  // 进入编辑态时，用当前用户值初始化本地状态
  const startEditing = () => {
    if (!user) return;
    setName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());
    setEmail(user.email ?? "");
    setRole((user.role as any) ?? "");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveUser = async () => {
    if (!user) return;
    const trimmed = name.trim();
    // 更稳的姓名切分：多个空白、只填名字等都能处理
    const [firstName = "", lastName = ""] = trimmed.split(/\s+/, 2);
    const updated = { ...user, firstName, lastName, email: email.trim(), role };
    try {
      await client.updateUser(updated);
      setUser(updated);
      setEditing(false);
      // 如作业要求保存后关闭面板，可启用下一行
      // navigate(-1);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save user.");
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveUser();
    if (e.key === "Escape") cancelEditing(); // ✅ 新增：ESC 取消
  };

  const deleteUser = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Confirm delete this user?")) return;
    try {
      await client.deleteUser(id);
      navigate(-1);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to delete user.");
    }
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

      {/* 加载 / 错误 */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" />
        </div>
      )}
      {!loading && error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && !user && <div>User not found.</div>}

      {!loading && !error && user && (
        <>
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
                    onKeyDown={onInputKeyDown}
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
              <b>Login ID:</b>{" "}
              <span className="wd-login-id">{user.loginId ?? "—"}</span>
            </div>

            <div className="mb-2">
              <b>Section:</b> <span className="wd-section">{user.section ?? "—"}</span>
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
                  onKeyDown={onInputKeyDown}
                />
              )}
            </div>

            <div className="mb-1">
              <b>Total Activity:</b>{" "}
              <span className="wd-total-activity">{user.totalActivity ?? "—"}</span>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            {editing ? (
              <>
                <button className="btn btn-outline-secondary" onClick={cancelEditing}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveUser}
                  disabled={!name.trim()} // ✅ 没有名字时禁用保存
                >
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
        </>
      )}
    </div>
  );
}
