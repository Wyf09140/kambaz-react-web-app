// kambaz-node-server-app/Kambaz/Quizzes/models/Question.js
import mongoose from "mongoose";
const { Schema, Types } = mongoose;

/**
 * 题型：
 * - MC：单选（Multiple Choice, 单选正确）；options: string[]，correctIndex: number
 * - TF：判断；correctBoolean: true/false
 * - FIB：填空（大小写不敏感、多个正确值）；correctTexts: string[]
 */
const QuestionSchema = new Schema(
  {
    quizId: { type: Types.ObjectId, ref: "Quiz", required: true, index: true },
    type: { type: String, enum: ["MC", "TF", "FIB"], required: true, default: "MC" },
    title: { type: String, default: "" },        // 可选标题
    prompt: { type: String, required: true },    // 富文本可存 HTML
    points: { type: Number, required: true, min: 0 },
    order: { type: Number, default: 0, index: true },

    // MC
    options: [{ type: String }],
    correctIndex: { type: Number, min: 0 },

    // TF
    correctBoolean: { type: Boolean },

    // FIB
    correctTexts: [{ type: String }], // 多个正确答案，大小写不敏感，去空格对比
  },
  { timestamps: true }
);

// 约束：各题型的必填字段
QuestionSchema.pre("validate", function (next) {
  if (this.type === "MC") {
    if (!this.options?.length) return next(new Error("MC requires options"));
    if (typeof this.correctIndex !== "number") return next(new Error("MC requires correctIndex"));
    if (this.correctIndex < 0 || this.correctIndex >= this.options.length)
      return next(new Error("correctIndex out of range"));
  }
  if (this.type === "TF") {
    if (typeof this.correctBoolean !== "boolean")
      return next(new Error("TF requires correctBoolean"));
  }
  if (this.type === "FIB") {
    if (!this.correctTexts?.length) return next(new Error("FIB requires at least one correct text"));
  }
  next();
});

// 末尾替换为这一行（确保只有这一种导出）
export default (mongoose.models.Question || mongoose.model("Question", QuestionSchema));
