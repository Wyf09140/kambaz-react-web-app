// index.js — minimal CORS + session sanity check (Express 5 / Node 22 friendly)
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

const app = express();

// ---------- 必备：反向代理下 secure cookie ----------
app.set("trust proxy", 1);

// ---------- 观测日志，确认新代码在跑 ----------
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.path, "Origin:", req.headers.origin || "(none)");
  next();
});

// ---------- CORS（放最前）----------
app.use((req, res, next) => { res.header("Vary", "Origin"); next(); });
app.use(cors({
  origin: true,                 // ⭐ 回显请求的 Origin（先打通）
  credentials: true,            // ⭐ 允许携带 Cookie
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With"],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 204,
}));
// Express 5 / path-to-regexp v6：用 RegExp 兜底 OPTIONS（不要用 "*"）
app.options(/.*/, cors({ origin: true, credentials: true }));

// ---------- JSON 解析 ----------
app.use(express.json());

// ---------- 会话（跨站 Cookie 配置）----------
const PROD = process.env.NODE_ENV === "production";
app.use(session({
  secret: process.env.SESSION_SECRET || "kambaz-minimal",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: PROD ? "none" : "lax", // ⭐ 生产环境必须 'none'
    secure:   PROD ? true   : false, // ⭐ 生产环境必须 true
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// ---------- 极简测试路由 ----------
app.get("/", (_req, res) => {
  res.send("Minimal backend is running");
});

// 检查 CORS：浏览器或 curl 打这个看响应头是否含 ACAO/ACC
app.get("/__corscheck", (req, res) => {
  res.json({
    ok: true,
    origin: req.headers.origin || null,
    note: "Expect 'Access-Control-Allow-Origin' and 'Access-Control-Allow-Credentials' in response headers.",
  });
});

// 伪登录：把一个假用户写进 session
app.post("/login", (req, res) => {
  const { username = "demo-user" } = req.body || {};
  req.session.currentUser = { _id: "u1", username };
  res.json({ ok: true, user: req.session.currentUser });
});

// 读取当前用户（未登录则 401）
app.get("/whoami", (req, res) => {
  if (!req.session.currentUser) return res.status(401).json({ message: "Not signed in" });
  res.json(req.session.currentUser);
});

// 退出登录
app.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// ---------- 监听端口（Render 会注入 PORT）----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Minimal server on http://localhost:${PORT} (PORT=${PORT})`);
});
