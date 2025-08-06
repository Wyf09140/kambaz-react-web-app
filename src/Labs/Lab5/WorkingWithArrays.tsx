// src/Labs/Lab5/WorkingWithArrays.tsx
import { useState } from "react";
import { FormControl, FormCheck } from "react-bootstrap";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER as string;

export default function WorkingWithArrays() {
  const API = `${REMOTE_SERVER}/lab5/todos`;

  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
  });

  // 本题新增需要的状态
  const [desc, setDesc] = useState("Create a NodeJS server with ExpressJS");
  const [done, setDone] = useState(false);

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>

      {/* 1) Retrieving Arrays */}
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API} target="_blank" rel="noreferrer">
        Get Todos
      </a>
      <hr />

      {/* 2) Retrieving by ID */}
      <h4>Retrieving an Item from an Array by ID</h4>
      <a
        id="wd-retrieve-todo-by-id"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}`}
        target="_blank"
        rel="noreferrer"
      >
        Get Todo by ID
      </a>
      <FormControl
        id="wd-todo-id"
        className="w-50"
        value={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />

      {/* 3) Filtering */}
      <h3>Filtering Array Items</h3>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
        target="_blank"
        rel="noreferrer"
      >
        Get Completed Todos
      </a>
      <hr />

      {/* 4) Create */}
      <h3>Creating new Items in an Array</h3>
      <a
        id="wd-create-todo"
        className="btn btn-primary"
        href={`${API}/create`}
        target="_blank"
        rel="noreferrer"
      >
        Create Todo
      </a>
      <hr />

      {/* 5) Delete */}
      <h3>Deleting from an Array</h3>
      <a
        id="wd-delete-todo"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}/delete`}
        target="_blank"
        rel="noreferrer"
      >
        Delete Todo with ID = {todo.id}
      </a>
      <FormControl
        id="wd-delete-todo-id"
        className="w-50"
        value={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />

      {/* 6) Update title */}
      <h3>Updating an Item in an Array</h3>
      <a
        id="wd-update-todo-title"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}/title/${encodeURIComponent(todo.title)}`}
        target="_blank"
        rel="noreferrer"
      >
        Update Title
      </a>
      <FormControl
        id="wd-update-todo-id"
        className="w-25 float-start me-2"
        value={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <FormControl
        id="wd-todo-title"
        className="w-50 float-start"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <br />
      <br />
      <hr />

      {/* 7) On Your Own - description */}
      <h3>Editing Todo Description</h3>
      <FormControl
        id="wd-todo-description"
        className="w-50 mb-2"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <a
        id="wd-update-todo-description"
        className="btn btn-primary"
        href={`${API}/${todo.id}/description/${encodeURIComponent(desc)}`}
        target="_blank"
        rel="noreferrer"
      >
        Update Description
      </a>
      <hr />

      {/* 8) On Your Own - completed */}
      <h3>Editing Todo Completed</h3>
      <FormCheck
        id="wd-todo-completed"
        type="checkbox"
        label="Completed"
        checked={done}
        onChange={(e) => setDone(e.target.checked)}
        className="mb-2"
      />
      <a
        id="wd-update-todo-completed"
        className="btn btn-primary"
        href={`${API}/${todo.id}/completed/${done}`}
        target="_blank"
        rel="noreferrer"
      >
        Update Completed
      </a>
      <hr />
    </div>
  );
}
