// Kambaz/Users/routes.js
import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
let currentUser = null;

export default function UserRoutes(app) {
  // 把敏感字段去掉，确保是 plain object
  const toSafeUser = (doc) => {
    if (!doc) return doc;
    const obj = doc; // dao 已经 .lean()，拿到的是普通对象
    const { password, ...safe } = obj;
    return safe;
  };

  // C
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };


  // D
  const deleteUser = async (req, res) => {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
  };


  // R
// Kambaz/Users/routes.js
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      return res.json(users);
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };
  app.get("/api/users", findAllUsers);


  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };


  // U
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
   if (currentUser && currentUser._id === userId) {
     req.session["currentUser"] = { ...currentUser, ...userUpdates };
   }

    res.json(safe);
  };

  // Auth
  const signup =  async (req, res) => {
    const exists = await dao.findUserByUsername(req.body.username);
    if (exists) return res.status(400).json({ message: "Username already in use" });
    const created = await dao.createUser(req.body);
    const safe = toSafeUser(created);
    req.session.currentUser = safe;
    res.json(safe);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = await dao.findUserByCredentials(username, password);
    if (!user) return res.status(401).json({ message: "Unable to login. Try again later." });
    const safe = toSafeUser(user);
    req.session.currentUser = safe;
    res.json(safe);
  };

  const signout = (req, res) => {
    req.session.destroy(() => res.sendStatus(200));
  };

  const profile = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    res.json(currentUser);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session.currentUser;
      if (!currentUser) return res.sendStatus(401);
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId); // 如果这些 DAO 以后接数据库，再改 async/await
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  const createCourse = (req, res) => {
    const currentUser = req.session.currentUser;
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
    };
    const unenrollUserFromCourse = async (req, res) => {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        uid = currentUser._id;
      }
      const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.send(status);
    };
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  const findCoursesForUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
    res.sendStatus(401);
    return;
    }
    if (currentUser.role === "ADMIN") {
    const courses = await courseDao.findAllCourses();
    res.json(courses);
    return;
    }
    let { uid } = req.params;
    if (uid === "current") {
    uid = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(uid);
    res.json(courses);
    };
  app.get("/api/users/:uid/courses", findCoursesForUser);
  app.post("/api/users/current/courses", createCourse);

  // routes
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
