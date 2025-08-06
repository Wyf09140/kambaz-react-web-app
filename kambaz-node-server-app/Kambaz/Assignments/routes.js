// Kambaz/Assignments/routes.js
import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // list by course
  app.get("/api/courses/:cid/assignments", (req, res) => {
    res.json(dao.findAssignmentsForCourse(req.params.cid));
  });

  // get one
  app.get("/api/assignments/:aid", (req, res) => {
    const a = dao.findAssignmentById(req.params.aid);
    if (!a) return res.sendStatus(404);
    res.json(a);
  });

  // create
  app.post("/api/courses/:cid/assignments", (req, res) => {
    const created = dao.createAssignment(req.params.cid, req.body);
    res.status(201).json(created);
  });

  // update
  app.put("/api/assignments/:aid", (req, res) => {
    dao.updateAssignment(req.params.aid, req.body);
    res.sendStatus(204); // 按要求返回 204
  });

  // delete
  app.delete("/api/assignments/:aid", (req, res) => {
    dao.deleteAssignment(req.params.aid);
    res.sendStatus(204); // 按要求返回 204
  });
}
