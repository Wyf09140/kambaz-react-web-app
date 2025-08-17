// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";

import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import quizzesRouter from "./Kambaz/Quizzes/routes/quizzes.routes.js";
import attemptsRouter from "./Kambaz/Quizzes/routes/attempts.routes.js";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);

const app = express();

// 代理后（Render 等）下发 secure cookie 必须
app.set("trust proxy", 1);

// 可选：简单请求日志，确认新代码在跑
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.path, "Origin:", req.headers.origin || "(none)");
  next();
});

// ===== CORS（放最前）=====
app.use((req, res, next) => { res.header("Vary", "Origin"); next(); });
app.use(cors({
  origin: true,              // 回显来源，先打通；确认后可收紧白名单
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With"],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 204,
}));
// ⭐ 在 Express 5 / path-to-regexp v6 下，用 RegExp 兜底预检
app.options(/.*/, cors({ origin: true, credentials: true }));

// 解析 JSON
app.use(express.json());

// ===== 会话（跨站 Cookie）=====
const PROD = process.env.NODE_ENV === "production";
app.use(session({
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: PROD ? "none" : "lax",
    secure:   PROD ? true   : false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// 将 session 用户映射到 req.user
app.use((req, _res, next) => {
  req.user = req.session?.currentUser || null;
  next();
});

// 业务路由
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/attempts", attemptsRouter);

// 健康检查
app.get("/", (_req, res) => { res.send("Backend is running!"); });

// Render 注入端口
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
