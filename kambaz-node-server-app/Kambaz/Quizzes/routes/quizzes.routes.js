import { Router } from "express";
import {
  listQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  setPublish,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/quizzes.controller.js";

const router = Router();

// ✅ 可用于快速排查前缀是否命中（浏览器试 GET /api/quizzes/_ping）
router.get("/_ping", (_req, res) => res.json({ ok: true }));

// 简易角色守卫（如果你在入口已做更严格鉴权，这里也可以去掉）
const ensureFaculty = (req, res, next) =>
  req.user?.role === "FACULTY" || req.user?.role === "ADMIN"
    ? next()
    : res.status(403).json({ message: "Faculty only" });

// 列表 & 详情（教师/学生都可访问）
router.get("/", listQuizzes);
router.get("/:id", getQuiz);

// 教师操作
router.post("/", ensureFaculty, createQuiz);
router.put("/:id", ensureFaculty, updateQuiz);
router.delete("/:id", ensureFaculty, deleteQuiz);
router.put("/:id/publish", ensureFaculty, setPublish);

// 题目 CRUD
router.post("/:id/questions", ensureFaculty, addQuestion);
router.put("/questions/:qid", ensureFaculty, updateQuestion);
router.delete("/questions/:qid", ensureFaculty, deleteQuestion);

export default router; // ⬅️ 一定要默认导出
