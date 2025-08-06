// kambaz-node-server-app/Lab5/WorkingWithArrays.js
let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
  // GET /lab5/todos  （支持 ?completed=true/false 过滤）
  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const filtered = todos.filter((t) => t.completed === completedBool);
      return res.json(filtered);
    }
    res.json(todos);
  });

  // GET /lab5/todos/:id
  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    res.json(todo ?? null);
  });

  // GET /lab5/todos/create  （示例：创建一个新 todo）
  app.get("/lab5/todos/create", (req, res) => {
    const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    const newTodo = { id: nextId, title: `Task ${nextId}`, completed: false };
    todos = [...todos, newTodo];
    res.json(todos);
  });

  // GET /lab5/todos/:id/delete
  app.get("/lab5/todos/:id/delete", (req, res) => {
    const { id } = req.params;
    todos = todos.filter((t) => t.id !== parseInt(id));
    res.json(todos);
  });

  // GET /lab5/todos/:id/title/:title
  app.get("/lab5/todos/:id/title/:title", (req, res) => {
    const { id, title } = req.params;
    todos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, title } : t
    );
    res.json(todos);
  });

  // GET /lab5/todos/:id/description/:description
  app.get("/lab5/todos/:id/description/:description", (req, res) => {
    const { id, description } = req.params;
    todos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, description } : t
    );
    res.json(todos);
  });

  // GET /lab5/todos/:id/completed/:completed
  app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
    const { id, completed } = req.params;
    const completedBool = completed === "true";
    todos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, completed: completedBool } : t
    );
    res.json(todos);
  });

  app.post("/lab5/todos", (req, res) => {
    const newTodo = { ...req.body,  id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  });

  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  });

  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    
    todos = todos.map((t) => {
      if (t.id === parseInt(id)) {
        return { ...t, ...req.body };
      }
      return t;
    });
    res.sendStatus(200);
  });




}
