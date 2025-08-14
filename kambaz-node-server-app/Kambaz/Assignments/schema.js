// Kambaz/Assignments/schema.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    // 关联课程（字符串 id，保持与你的 CourseModel 一致）
    course: { type: String, ref: "CourseModel", required: true },

    // 基本字段
    title: { type: String, required: true },
    description: { type: String, default: "" },

    // 评分/时间
    points: { type: Number, default: 100 },
    dueDate: { type: Date },
    availableFrom: { type: Date },
    availableTo: { type: Date },

    // 其它可选状态位
    published: { type: Boolean, default: true },
  },
  { collection: "assignments", timestamps: true }
);

export default assignmentSchema;
