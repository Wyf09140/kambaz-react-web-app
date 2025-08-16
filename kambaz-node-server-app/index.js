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

// Quizzes
import quizzesRouter from "./Kambaz/Quizzes/routes/quizzes.routes.js";
import attemptsRouter from "./Kambaz/Quizzes/routes/attempts.routes.js";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);

const app = express();

// ⭐ 在代理后面（Render）发 secure cookie 必须：
app.set("trust proxy", 1);

// ===== CORS（务必在路由和 session 之前）=====
const allowlist =
  (process.env.ALLOWED_ORIGINS?.split(",").map(s => s.trim()).filter(Boolean)) || [
    "http://localhost:5173",
    "https://final-project--cosmic-pithivier-a2929c.netlify.app", // 你当前的 Netlify 预览域
    "https://a5--cosmic-pithivier-a2929c.netlify.app",
    "https://a6--cosmic-pithivier-a2929c.netlify.app",
  ];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);              // 允许无 Origin（健康检查等）
      if (allowlist.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,                                  // ⭐ 允许带 Cookie
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  })
);
// 预检（有些平台需要显式 options）
app.options("*", cors({ origin: (o,cb)=>cb(null,true), credentials: true }));

// 解析 JSON
app.use(express.json());

// ===== session（在需要读写 session 的路由之前）=====
const PROD = process.env.NODE_ENV === "production";
// ⭐ 跨站 Cookie 必须 sameSite: 'none' + secure: true
app.use(
  session({
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: PROD ? "none" : "lax",  // ⭐ 生产用 none
      secure:   PROD ? true   : false,  // ⭐ 生产用 true（需要 https + trust proxy）
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// 将 session 用户映射到 req.user
app.use((req, res, next) => {
  req.user = req.session?.currentUser || null;
  next();
});

// 路由
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/attempts", attemptsRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

