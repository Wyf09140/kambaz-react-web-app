// Kambaz/Users/routes.js
import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

// 把 mongoose 文档转普通对象
const toPlain = (doc) =>
  doc && typeof doc.toObject === "function" ? doc.toObject() : doc;

// 去掉密码
const toSafeUser = (doc) => {
  if (!doc) return doc;
  const obj = toPlain(doc);
  if (!obj) return obj;
  const { password, ...safe } = obj;
  return safe;
};

// 允许更新的字段白名单
const ALLOWED_FIELDS = new Set([
  "username",
  "password",
  "firstName",
  "lastName",
  "dob",
  "email",
  "role",
]);

// 统一清洗更新数据（避免把空密码、空日期写入触发校验）
const sanitizeUpdate = (body = {}) => {
  const out = {};
  for (const k of Object.keys(body)) {
    if (!ALLOWED_FIELDS.has(k)) continue;
    out[k] = body[k];
  }
  // 空密码不覆盖
  if (!out.password) delete out.password;
  // 把空字符串 dob 去掉，避免 Date 校验
  if (out.dob === "" || out.dob === null) delete out.dob;
  return out;
};

export default function UserRoutes(app) {
  /** ---------- C ---------- */
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(toSafeUser(user));
  };
  app.post("/api/users", createUser);

  /** ---------- R ---------- */
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      return res.json(users.map(toSafeUser));
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      return res.json(users.map(toSafeUser));
    }
    const users = await dao.findAllUsers();
    res.json(users.map(toSafeUser));
  };
  app.get("/api/users", findAllUsers);

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(toSafeUser(user));
  };
  app.get("/api/users/:userId", findUserById);

  /** ---------- U ---------- */
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const actor = req.session?.currentUser || null;

    if (!actor) return res.status(401).json({ message: "Not signed in" });

    // 允许本人或管理员更新
    const isSelf = String(actor._id) === String(userId);
    const isAdmin = actor.role === "ADMIN";
    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const update = sanitizeUpdate(req.body);

    try {
      const updated = await dao.updateUser(userId, update);
      if (!updated) return res.status(404).json({ message: "User not found" });

      const safe = toSafeUser(updated);

      // 如果是本人，回写 session
      if (isSelf) {
        req.session.currentUser = safe;
      }

      res.json(safe);
    } catch (e) {
      console.error("update user error:", e);
      if (e?.code === 11000) {
        return res
          .status(400)
          .json({ message: "Duplicate key (username/email already exists)" });
      }
      return res.status(400).json({ message: e?.message || "Update failed" });
    }
  };
  app.put("/api/users/:userId", updateUser);

  /** ---------- D ---------- */
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  app.delete("/api/users/:userId", deleteUser);

  /** ---------- Auth ---------- */
  const signup = async (req, res) => {
    const exists = await dao.findUserByUsername(req.body.username);
    if (exists)
      return res.status(400).json({ message: "Username already in use" });
    const created = await dao.createUser(req.body);
    const safe = toSafeUser(created);
    req.session.currentUser = safe;
    res.json(safe);
  };
  app.post("/api/users/signup", signup);

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = await dao.findUserByCredentials(username, password);
    if (!user)
      return res
        .status(401)
        .json({ message: "Unable to login. Try again later." });
    const safe = toSafeUser(user);
    req.session.currentUser = safe;
    res.json(safe);
  };
  app.post("/api/users/signin", signin);

  const signout = (req, res) => {
    req.session.destroy(() => res.sendStatus(200));
  };
  app.post("/api/users/signout", signout);
  
// 放在 Users/routes.js 里，和原来的 profile 一起
const profile = (req, res) => {
  const me = req.session?.currentUser;
  if (!me) return res.sendStatus(401);
  res.json(me);
};
app.post("/api/users/profile", profile);
app.get("/api/users/profile", profile);   // ← 新增

  /** ---------- Courses 与 Enrollments 相关（保持原逻辑） ---------- */
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const me = req.session.currentUser;
      if (!me) return res.sendStatus(401);
      userId = me._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  const createCourse = (req, res) => {
    const me = req.session.currentUser;
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(me._id, newCourse._id);
    res.json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const me = req.session["currentUser"];
      uid = me._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const me = req.session["currentUser"];
      uid = me._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  const findCoursesForUser = async (req, res) => {
    const me = req.session["currentUser"];
    if (!me) return res.sendStatus(401);
    if (me.role === "ADMIN") {
      const courses = await courseDao.findAllCourses();
      return res.json(courses);
    }
    let { uid } = req.params;
    if (uid === "current") uid = me._id;
    const courses = await enrollmentsDao.findCoursesForUser(uid);
    res.json(courses);
  };
  app.get("/api/users/:uid/courses", findCoursesForUser);
}
