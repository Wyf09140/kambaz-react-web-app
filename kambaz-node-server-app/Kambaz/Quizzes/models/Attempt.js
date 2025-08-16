// kambaz-node-server-app/Kambaz/Quizzes/models/Attempt.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * 统一使用 String 存储 quizId / userId / questionId，避免 UUID 与 ObjectId 混用的 CastError
 * responses.answer:
 *   - MC: { mc: number }
 *   - TF: { tf: boolean }
 *   - FIB:{ fib: string }
 */
const ResponseSchema = new Schema(
  {
    questionId: { type: String, required: true }, // ⬅️ String
    answer: {
      mc: { type: Number },
      tf: { type: Boolean },
      fib: { type: String },
    },
    autoScore: { type: Number, default: 0 },
  },
  { _id: false }
);

const AttemptSchema = new Schema(
  {
    quizId: { type: String, required: true, index: true }, // ⬅️ String
    userId: { type: String, required: true, index: true }, // ⬅️ String
    status: { type: String, enum: ["IN_PROGRESS", "SUBMITTED"], default: "IN_PROGRESS" },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    responses: { type: [ResponseSchema], default: [] },
    totalAutoScore: { type: Number, default: 0 },
    totalPoints: { type: Number, required: true },
    attemptNo: { type: Number, default: 1 },
  },
  { timestamps: true }
);

AttemptSchema.index({ quizId: 1, userId: 1, attemptNo: -1 });

export default mongoose.models.Attempt || mongoose.model("Attempt", AttemptSchema);
