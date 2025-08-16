// kambaz-node-server-app/Kambaz/Quizzes/controllers/quizzes.controller.js
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

/** 列表（按课程） */
export async function listQuizzes(req, res) {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ message: "courseId required" });

    const quizzes = await Quiz.find({ courseId }).sort({ createdAt: -1 }).lean();
    // 聚合题目数量
    const qCounts = await Question.aggregate([
      { $match: { quizId: { $in: quizzes.map(q => q._id) } } },
      { $group: { _id: "$quizId", count: { $sum: 1 } } }
    ]);
    const mapCount = new Map(qCounts.map(x => [String(x._id), x.count]));

    const result = quizzes.map(q => ({
      ...q,
      questionsCount: mapCount.get(String(q._id)) || 0,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to list quizzes" });
  }
}

/** 详情（含题目）*/
export async function getQuiz(req, res) {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    const questions = await Question.find({ quizId: id }).sort({ order: 1 }).lean();
    res.json({ quiz, questions });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get quiz" });
  }
}

/** 新建 */
// …其余 import 保持
export async function createQuiz(req, res) {
  try {
    const { courseId, title } = req.body;
    if (!courseId || !title) {
      return res.status(400).json({ message: "courseId & title required" });
    }

    const payload = { courseId, title };
    if (req.user?._id) {
      payload.createdBy = req.user._id; // 兼容字符串/对象
    }

    const quiz = await Quiz.create(payload);
    return res.status(201).json(quiz);
  } catch (err) {
    console.error("createQuiz error:", err?.message);
    return res
      .status(500)
      .json({ message: err?.message || "Failed to create quiz" });
  }
}

/** 更新（Details）*/
export async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    // points 将由 Questions 编辑时顺带更新，这里也可覆写
    const updated = await Quiz.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: "Quiz not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update quiz" });
  }
}

/** 删除 */
export async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;
    await Question.deleteMany({ quizId: id });
    const del = await Quiz.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: "Quiz not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete quiz" });
  }
}

/** 发布/撤销 */
export async function setPublish(req, res) {
  try {
    const { id } = req.params;
    const { published } = req.body;
    const updated = await Quiz.findByIdAndUpdate(id, { published: !!published }, { new: true });
    if (!updated) return res.status(404).json({ message: "Quiz not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to publish/unpublish" });
  }
}

/** 新增题目（单个）*/
export async function addQuestion(req, res) {
  try {
    const { id } = req.params; // quizId
    const q = await Question.create({ ...req.body, quizId: id });
    // 更新 quiz.points（累积）
    const agg = await Question.aggregate([
      { $match: { quizId: q.quizId } },
      { $group: { _id: "$quizId", pts: { $sum: "$points" } } }
    ]);
    const total = agg[0]?.pts || 0;
    await Quiz.findByIdAndUpdate(q.quizId, { points: total });
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to add question" });
  }
}

/** 更新题目 */
export async function updateQuestion(req, res) {
  try {
    const { qid } = req.params;
    const updated = await Question.findByIdAndUpdate(qid, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Question not found" });

    // 维护 quiz.points
    const agg = await Question.aggregate([
      { $match: { quizId: updated.quizId } },
      { $group: { _id: "$quizId", pts: { $sum: "$points" } } }
    ]);
    const total = agg[0]?.pts || 0;
    await Quiz.findByIdAndUpdate(updated.quizId, { points: total });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update question" });
  }
}

/** 删除题目 */
export async function deleteQuestion(req, res) {
  try {
    const { qid } = req.params;
    const toDel = await Question.findById(qid);
    if (!toDel) return res.status(404).json({ message: "Question not found" });

    await toDel.deleteOne();

    // 维护 quiz.points
    const agg = await Question.aggregate([
      { $match: { quizId: toDel.quizId } },
      { $group: { _id: "$quizId", pts: { $sum: "$points" } } }
    ]);
    const total = agg[0]?.pts || 0;
    await Quiz.findByIdAndUpdate(toDel.quizId, { points: total });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete question" });
  }
}
