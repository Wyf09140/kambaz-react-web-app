let module = {
  id: "CS5002",
  name: "Discrete Structures",
  description: "Learn logic and combinatorics",
  course: "Computer Science",
  score: 95,
  completed: false
};

export default function ModuleObjects(app) {
  app.get("/lab5/module", (req, res) => {
    res.json(module);
  });

  app.get("/lab5/module/name", (req, res) => {
    res.send(module.name);
  });

  app.get("/lab5/module/name/update/:name", (req, res) => {
    module.name = req.params.name;
    res.send(`Module name updated to ${module.name}`);
  });

  app.get("/lab5/module/score/update/:score", (req, res) => {
    module.score = parseInt(req.params.score);
    res.send(`Module score updated to ${module.score}`);
  });

  app.get("/lab5/module/completed/update/:status", (req, res) => {
    module.completed = req.params.status === "true";
    res.send(`Module completed set to ${module.completed}`);
  });
}
