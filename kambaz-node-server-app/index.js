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

// ⬇️ 新增：Quizzes 路由（Express Router 实例）
import quizzesRouter from "./Kambaz/Quizzes/routes/quizzes.routes.js";
import attemptsRouter from "./Kambaz/Quizzes/routes/attempts.routes.js";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      "https://a5--cosmic-pithivier-a2929c.netlify.app",
      "https://a6--cosmic-pithivier-a2929c.netlify.app",
      "http://localhost:5173",
      "https://final-project--cosmic-pithivier-a2929c.netlify.app",

    ],
  })
);

// 解析 JSON
app.use(express.json());

// session（确保在挂载任何需要读 session 的中间件/路由之前）
app.use(
  session({
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      // 若未来跨域到 https 站点，需要：sameSite: "none", secure: true
    },
  })
);

// 🔐 将 session 用户映射到 req.user，供 Quizzes 控制器使用
app.use((req, res, next) => {
  req.user = req.session?.currentUser || null;
  next();
});

// 旧有路由（保持不变）
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);


// ✅ 正确挂载 Quizzes / Attempts（注意是 app.use + 前缀）
app.use("/api/quizzes", quizzesRouter);
app.use("/api/attempts", attemptsRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
