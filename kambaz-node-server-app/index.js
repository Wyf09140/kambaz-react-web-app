// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";

// 路由
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import quizzesRouter from "./Kambaz/Quizzes/routes/quizzes.routes.js";
import attemptsRouter from "./Kambaz/Quizzes/routes/attempts.routes.js";

// ===== 数据库 =====
const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

// ===== 反向代理（Render 等）下发 Secure Cookie 必须 =====
app.set("trust proxy", 1);

// ===== CORS（放在所有路由 & session 之前）=====
// 先用 “回显来源” 的方式把链路打通；确认正常后可改成严格白名单
app.use((req, res, next) => { res.header("Vary", "Origin"); next(); });
app.use(
  cors({
    origin: true,            // ⭐ 回显请求的 Origin
    credentials: true,       // ⭐ 允许带 Cookie
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  })
);
// 显式处理预检，确保总能回 CORS 头
app.options("*", cors({ origin: true, credentials: true }));

// ===== 解析 JSON =====
app.use(express.json());

// ===== 会话（跨站 Cookie 设置）=====
const PROD = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: PROD ? "none" : "lax", // ⭐ 生产用 none 才能跨站
      secure:   PROD ? true   : false, // ⭐ 生产用 true（需要 https + trust proxy）
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// 将 session 用户映射到 req.user（供控制器使用）
app.use((req, res, next) => {
  req.user = req.session?.currentUser || null;
  next();
});

// ===== 业务路由 =====
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/attempts", attemptsRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ===== 监听端口（Render 会注入 PORT）=====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
