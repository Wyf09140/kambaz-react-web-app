import { Router } from "express";
import {
  startAttempt,
  saveAttempt,
  submitAttempt,
  getMyAttempt,
  getGrades,
  getAttemptById,
} from "../controllers/attempts.controller.js";

const router = Router();

const ensureAuth = (req, res, next) =>
  req.user?._id ? next() : res.status(401).json({ message: "Not authenticated" });

const ensureStudent = (req, res, next) =>
  req.user?.role === "STUDENT" ? next() : res.status(403).json({ message: "Student only" });

const ensureFaculty = (req, res, next) =>
  req.user?.role === "FACULTY" || req.user?.role === "ADMIN"
    ? next()
    : res.status(403).json({ message: "Faculty only" });

// 学生端
router.post("/", ensureStudent, startAttempt);
router.put("/:id/save", ensureStudent, saveAttempt);
router.put("/:id/submit", ensureStudent, submitAttempt);
router.get("/me", ensureStudent, getMyAttempt);

// 详情（本人或教师）
router.get("/:id", ensureAuth, getAttemptById);

// 教师端：成绩统计
router.get("/grades/:id", ensureFaculty, getGrades); // :id = quizId

export default router;
