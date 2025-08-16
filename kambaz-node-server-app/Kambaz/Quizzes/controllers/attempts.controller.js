import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { scoreAll } from "../utils/autoScore.js";
import { getAvailability, checkAttemptAllowance } from "../utils/availability.js";

const { Types } = mongoose;
const toObjectId = (id) => (Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null);

/** 学生开始一次尝试 */
export async function startAttempt(req, res) {
  try {
    const userId = req.user?._id;
    const { quizId } = req.body || {};
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!quizId) return res.status(400).json({ message: "quizId required" });

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    if (!quiz.published) return res.status(403).json({ message: "Quiz not published" });

    const avail = getAvailability(quiz);
    if (avail.status !== "AVAILABLE") {
      return res.status(403).json({ message: avail.label || "Not available" });
    }

    const usedCount = await Attempt.countDocuments({
      quizId: String(quizId),
      userId: String(userId),
      status: "SUBMITTED",
    });

    const { allowed, nextAttemptNo } = checkAttemptAllowance(quiz, usedCount);
    if (!allowed) return res.status(403).json({ message: "No more attempts allowed" });

    const totalPoints = Number(quiz.points || 0);
    const attempt = await Attempt.create({
      quizId: String(quizId),
      userId: String(userId),
      totalPoints,
      attemptNo: nextAttemptNo,
      status: "IN_PROGRESS",
      responses: [],
    });

    res.status(201).json(attempt);
  } catch (err) {
    console.error("startAttempt error:", err);
    res.status(500).json({ message: err.message || "Failed to start attempt" });
  }
}

/** 保存（中途自动保存，不计分） */
export async function saveAttempt(req, res) {
  try {
    const { id } = req.params; // attemptId
    const body = req.body || {};
    const incoming = Array.isArray(body.responses)
      ? body.responses
      : Array.isArray(body.answers)
      ? body.answers
      : [];

    const attempt = await Attempt.findById(id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (attempt.status === "SUBMITTED")
      return res.status(400).json({ message: "Already submitted" });

    // 不要把 TF 的 false 过滤掉
    attempt.responses = incoming
      .filter((r) => r && r.questionId && typeof r.answer === "object")
      .map((r) => ({
        questionId: String(r.questionId),
        answer: {
          mc: typeof r.answer.mc === "number" ? r.answer.mc : undefined,
          tf: typeof r.answer.tf === "boolean" ? r.answer.tf : undefined,
          fib: typeof r.answer.fib === "string" ? r.answer.fib : undefined,
        },
      }));

    await attempt.save();
    res.json(attempt);
  } catch (err) {
    console.error("saveAttempt error:", err);
    res.status(500).json({ message: err.message || "Failed to save attempt" });
  }
}

/** 提交（自动评分 MC/TF/FIB） */
export async function submitAttempt(req, res) {
  try {
    const { id } = req.params;
    const attempt = await Attempt.findById(id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (attempt.status === "SUBMITTED")
      return res.status(400).json({ message: "Already submitted" });

    // 兼容 quizId 为 ObjectId / String
    const qidObj = toObjectId(attempt.quizId);
    let questions = [];
    if (qidObj) {
      questions = await Question.find({ quizId: qidObj }).lean();
      if (!questions.length) {
        questions = await Question.find({ quizId: String(attempt.quizId) }).lean();
      }
    } else {
      questions = await Question.find({ quizId: String(attempt.quizId) }).lean();
    }

    const { totalAutoScore, detailed } = scoreAll(questions, attempt.responses);

    const autoScoreMap = new Map(detailed.map((d) => [String(d.questionId), d.autoScore]));
    attempt.responses = attempt.responses.map((r) => ({
      ...r,
      autoScore: autoScoreMap.get(String(r.questionId)) || 0,
    }));

    attempt.totalAutoScore = totalAutoScore;
    attempt.submittedAt = new Date();
    attempt.status = "SUBMITTED";
    await attempt.save();

    res.json({
      attemptId: attempt._id,
      totalAutoScore: attempt.totalAutoScore,
      totalPoints: attempt.totalPoints,
    });
  } catch (err) {
    console.error("submitAttempt error:", err);
    res.status(500).json({ message: err.message || "Failed to submit attempt" });
  }
}

/** 学生“我的最后一次” */
export async function getMyAttempt(req, res) {
  try {
    const userId = req.user?._id;
    const { quizId } = req.query || {};
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!quizId) return res.status(400).json({ message: "quizId required" });

    const last = await Attempt.find({
      quizId: String(quizId),
      userId: String(userId),
      status: "SUBMITTED",
    })
      .sort({ attemptNo: -1 })
      .limit(1)
      .lean();

    res.json(last[0] || null);
  } catch (err) {
    console.error("getMyAttempt error:", err);
    res.status(500).json({ message: err.message || "Failed to get my attempt" });
  }
}

/** ✅ 新增：按 attemptId 返回 attempt + 问题 + quiz 配置（结果页使用） */
export async function getAttemptById(req, res) {
  try {
    const { id } = req.params; // attemptId
    const me = req.user;
    if (!me?._id) return res.status(401).json({ message: "Not authenticated" });

    const attempt = await Attempt.findById(id).lean();
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    const isOwner = String(attempt.userId) === String(me._id);
    const isFaculty = me.role === "FACULTY" || me.role === "ADMIN";
    if (!isOwner && !isFaculty) return res.status(403).json({ message: "Forbidden" });

    const qidObj = toObjectId(attempt.quizId);
    let questions = [];
    if (qidObj) {
      questions = await Question.find({ quizId: qidObj }).lean();
      if (!questions.length) {
        questions = await Question.find({ quizId: String(attempt.quizId) }).lean();
      }
    } else {
      questions = await Question.find({ quizId: String(attempt.quizId) }).lean();
    }

    const quiz = await Quiz.findById(attempt.quizId, { scoring: 1, title: 1, points: 1 }).lean();

    res.json({ attempt, questions, quiz });
  } catch (err) {
    console.error("getAttemptById error:", err);
    res.status(500).json({ message: err.message || "Failed to get attempt" });
  }
}

/** ✅ 改进：成绩统计（平均分 + 直方图） */
export async function getGrades(req, res) {
  try {
    const { id } = req.params; // quizId
    const attempts = await Attempt.find({
      quizId: String(id),
      status: "SUBMITTED",
    }).lean();

    const scores = attempts.map((a) => a.totalAutoScore || 0);
    const count = scores.length;
    const totalPoints = attempts.length ? attempts[0].totalPoints || 0 : 0;
    const average = count ? scores.reduce((s, x) => s + x, 0) / count : 0;

    // 分数段（按百分比）：0–59, 60–69, 70–79, 80–89, 90–100
    const buckets = [0, 0, 0, 0, 0];
    if (totalPoints > 0) {
      scores.forEach((s) => {
        const p = Math.round((s / totalPoints) * 100);
        if (p < 60) buckets[0] += 1;
        else if (p < 70) buckets[1] += 1;
        else if (p < 80) buckets[2] += 1;
        else if (p < 90) buckets[3] += 1;
        else buckets[4] += 1;
      });
    }

    res.json({
      count,
      average,
      totalPoints,
      histogram: [
        { range: "0–59", count: buckets[0] },
        { range: "60–69", count: buckets[1] },
        { range: "70–79", count: buckets[2] },
        { range: "80–89", count: buckets[3] },
        { range: "90–100", count: buckets[4] },
      ],
    });
  } catch (err) {
    console.error("getGrades error:", err);
    res.status(500).json({ message: err.message || "Failed to get grades" });
  }
}
