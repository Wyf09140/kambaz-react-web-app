// Kambaz/Assignments/routes.js
import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // 列出某门课的所有作业
  app.get("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const list = await dao.findAssignmentsForCourse(req.params.cid);
      res.json(list);
    } catch (err) {
      console.error("GET /courses/:cid/assignments error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 获取单个作业
  app.get("/api/assignments/:aid", async (req, res) => {
    try {
      const item = await dao.findAssignmentById(req.params.aid);
      if (!item) return res.sendStatus(404);
      res.json(item);
    } catch (err) {
      console.error("GET /assignments/:aid error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 新建作业
  app.post("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const created = await dao.createAssignment(req.params.cid, req.body);
      res.status(201).json(created);
    } catch (err) {
      // Mongoose 校验失败
      if (err?.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      console.error("POST /courses/:cid/assignments error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 更新作业（返回更新后的文档）
  app.put("/api/assignments/:aid", async (req, res) => {
    try {
      const updated = await dao.updateAssignment(req.params.aid, req.body);
      if (!updated) return res.sendStatus(404);
      res.json(updated);
    } catch (err) {
      if (err?.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      console.error("PUT /assignments/:aid error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // 删除作业
  app.delete("/api/assignments/:aid", async (req, res) => {
    try {
      const result = await dao.deleteAssignment(req.params.aid);
      if (!result?.deletedCount) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      console.error("DELETE /assignments/:aid error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
