// index.js
import "dotenv/config";                         // 可用 .env（可选）
import express from "express";
import cors from "cors";
import session from "express-session";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";

const app = express();

// ✅ CORS 必须允许凭证，并且 origin 必须与前端一致
app.use(cors({
  credentials: true,
  origin: process.env.NETLIFY_URL || "http://localhost:5173",
}));

// ✅ 解析 JSON —— 放在路由之前
app.use(express.json());

// ✅ session —— 只注册一次
app.use(session({
  // 🔧 如有 .env，优先用；否则用默认值
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // 本地开发通常 sameSite: 'lax' 即可；如要跨域 cookie，可改为 'none' 并配合 secure
    sameSite: "lax",
  },
}));

// ✅ 注册路由
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
AssignmentRoutes(app);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
