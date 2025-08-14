// Kambaz/Enrollments/routes.js
import * as dao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  app.get("/api/users/:uid/courses", async (req, res) => {
    const { uid } = req.params;
    const courses = await dao.findCoursesForUser(uid);
    res.json(courses);
  });

  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const users = await dao.findUsersForCourse(cid);
    res.json(users);
  });

  // 选课
  app.post("/api/enrollments", async (req, res) => {
    try {
      const { user, course } = req.body;
      if (!user || !course) {
        return res.status(400).json({ error: "user and course are required" });
      }
      const enrollment = await dao.enrollUserInCourse(user, course);
      res.status(201).json(enrollment);
    } catch (err) {
      if (err?.code === 11000) {
        // MongoDB duplicate key
        return res.status(409).json({ error: "Already enrolled" });
      }
      console.error("Enroll error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 退课
  app.delete("/api/enrollments/:uid/:cid", async (req, res) => {
    try {
      const { uid, cid } = req.params;
      const status = await dao.unenrollUserFromCourse(uid, cid);
      res.json(status);
    } catch (err) {
      console.error("Unenroll error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
