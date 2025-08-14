// Kambaz/Enrollments/schema.js
import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema(
  {
    user:   { type: String, ref: "UserModel",   required: true },
    course: { type: String, ref: "CourseModel", required: true },
    grade: Number,
    letterGrade: String,
    enrollmentDate: Date,
    status: { type: String, enum: ["ENROLLED", "DROPPED", "COMPLETED"], default: "ENROLLED" },
  },
  { collection: "enrollments", timestamps: true }
);

// 同一 user 对同一 course 只允许一条
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default enrollmentSchema;
