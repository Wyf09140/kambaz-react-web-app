// kambaz-node-server-app/Kambaz/Quizzes/models/Quiz.js
import mongoose from "mongoose";
const { Schema } = mongoose;



const WindowSchema = new Schema(
  {
    due: { type: Date },
    availableFrom: { type: Date },
    availableUntil: { type: Date },
  },
  { _id: false }
);


const ScoringSchema = new Schema(
  {
    shuffleAnswers: { type: Boolean, default: true },    // ✅ 默认 Yes
    timeLimit: { type: Number, default: 20 * 60 },       // 20 分钟
    multipleAttempts: { type: Boolean, default: false }, // 默认 No
    maxAttempts: { type: Number, default: 1, min: 1 },
    showCorrectAnswers: { type: Boolean, default: true },
    oneQuestionAtATime: { type: Boolean, default: false },
    lockAfterAnswering: { type: Boolean, default: false },
    accessCode: { type: String, default: "" },
    webcamRequired: { type: Boolean, default: false },   // ✅ 新增
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    courseId: { type: String, required: true, index: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },
    published: { type: Boolean, default: false },
    points: { type: Number, default: 0 },

    // ✅ 新增：评分点要求的两个枚举
    type: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },

    scoring: { type: ScoringSchema, default: () => ({}) },
    window: { type: WindowSchema, default: () => ({}) },
    createdBy: { type: Schema.Types.Mixed, required: false, index: true },
  },
  { timestamps: true }
);



export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
