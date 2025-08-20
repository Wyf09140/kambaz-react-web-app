// Kambaz/Courses/routes.js
import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  // ---- Helper ----
  const safeJson = (res, status, payload) =>
    res.status(status).json(payload ?? {});

  // =========================
  // 获取所有课程
  // =========================
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await dao.findAllCourses();
      return res.json(courses);
    } catch (e) {
      console.error("[GET /api/courses] error:", e);
      return safeJson(res, 500, { message: e?.message || "Failed to fetch courses" });
    }
  });

  // =========================
  // 获取某课程的所有模块
  // =========================
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    try {
      const modules = await modulesDao.findModulesForCourse(courseId);
      return res.json(modules);
    } catch (e) {
      console.error(`[GET /api/courses/${courseId}/modules] error:`, e);
      return safeJson(res, 500, { message: e?.message || "Failed to fetch modules" });
    }
  });

  // =========================
  // 为课程创建模块
  // =========================
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    try {
      const module = { ...req.body, course: courseId };
      console.log("[POST /api/courses/:courseId/modules] body =", req.body);
      const newModule = await modulesDao.createModule(module);
      return safeJson(res, 201, newModule);
    } catch (e) {
      console.error(`[POST /api/courses/${courseId}/modules] error:`, e);
      return safeJson(res, 500, { message: e?.message || "Create module failed" });
    }
  });

  // =========================
  // 创建课程（忽略 _id，清洗字段；登录则尝试自动选课）
  // =========================
  app.post("/api/courses", async (req, res) => {
    try {
      console.log("[POST /api/courses] raw body =", req.body);

      // 丢弃 _id，并做字段白名单 + 清洗
      const {
        _id, // 丢弃，避免 ObjectId 转换报错
        name,
        number,
        credits,
        description,
        // 目前 schema 只有以上四个字段；其余（startDate/endDate/department/image）
        // 即使传了也不入库。若你想存储它们，请在 schema.js 增加定义并在此处白名单。
      } = req.body;

      const payload = {};
      if (typeof name === "string" && name.trim() !== "") {
        payload.name = name.trim();
      } else {
        // 可选：若必须 name，直接返回 400
        // return safeJson(res, 400, { message: "Field 'name' is required" });
      }

      if (typeof number === "string" && number.trim() !== "") {
        payload.number = number.trim();
      }

      if (credits !== undefined && credits !== "") {
        const n = Number(credits);
        if (!Number.isNaN(n)) payload.credits = n;
      }

      if (description != null && String(description).trim() !== "") {
        payload.description = String(description).trim();
      }

      console.log("[POST /api/courses] cleaned payload =", payload);

      const course = await dao.createCourse(payload);

      const currentUser = req.session?.currentUser;
      if (currentUser) {
        try {
          await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
        } catch (enrollErr) {
          // 选课失败不阻断课程创建
          console.error("[ENROLL AFTER CREATE] error:", enrollErr);
        }
      }

      return safeJson(res, 201, course);
    } catch (e) {
      console.error("[POST /api/courses] error name:", e?.name);
      console.error("[POST /api/courses] error message:", e?.message);
      if (e?.errors) {
        Object.keys(e.errors).forEach((k) => {
          console.error(` [field ${k}]`, e.errors[k].message);
        });
      }
      const status =
        e?.name === "ValidationError" || e?.code === 11000 ? 400 : 500;
      return safeJson(res, status, { message: e?.message || "Create course failed" });
    }
  });

  // =========================
  // 更新课程
  // =========================
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    try {
      console.log(`[PUT /api/courses/${courseId}] body =`, req.body);
      const status = await dao.updateCourse(courseId, req.body);
      return res.json(status);
    } catch (e) {
      console.error(`[PUT /api/courses/${courseId}] error:`, e);
      return safeJson(res, 500, { message: e?.message || "Update course failed" });
    }
  });

  // =========================
  // 删除课程
  // =========================
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    try {
      console.log(`[DELETE /api/courses/${courseId}]`);
      const status = await dao.deleteCourse(courseId);
      return res.json(status);
    } catch (e) {
      console.error(`[DELETE /api/courses/${courseId}] error:`, e);
      return safeJson(res, 500, { message: e?.message || "Delete course failed" });
    }
  });

  // =========================
  // 查询某课程的所有“已注册用户”
  // =========================
  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    try {
      const users = await enrollmentsDao.findUsersForCourse(cid);
      return res.json(users);
    } catch (e) {
      console.error(`[GET /api/courses/${cid}/users] error:`, e);
      return safeJson(res, 500, { message: e?.message || "Failed to fetch users for course" });
    }
  });
}
