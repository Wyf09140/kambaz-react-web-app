// Kambaz/Modules/routes.js
import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  // 更新模块：PUT /api/modules/:moduleId
  app.put("/api/modules/:moduleId", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleUpdates = req.body;

      // dao.updateModule 可以是同步或异步；这里用 await 以兼容异步实现
      await modulesDao.updateModule(moduleId, moduleUpdates);

      // 按要求：成功时返回 204 No Content
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // 删除模块：DELETE /api/modules/:moduleId
  app.delete("/api/modules/:moduleId", async (req, res) => {
    try {
      const { moduleId } = req.params;
      await modulesDao.deleteModule(moduleId);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
}
