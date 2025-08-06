import { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import * as client from "./client";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const data = await client.fetchTodos();
      setTodos(data);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? error?.message ?? "Failed to load todos");
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const createTodo = async () => {
    try {
      const dataOrArray = await client.createTodo(); // 返回的是数组
      setTodos(dataOrArray);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? error?.message ?? "Create failed");
    }
  };

  const postTodo = async () => {
    try {
      const newTodo = await client.postTodo({ title: "New Posted Todo", completed: false });
      setTodos([...todos, newTodo]); // 返回的是对象
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? error?.message ?? "Post failed");
    }
  };

  const removeTodo = async (todo: any) => {
    try {
      const updatedTodos = await client.removeTodo(todo); // GET /:id/delete，返回数组
      setTodos(updatedTodos);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(
        `Unable to delete Todo with ID ${todo.id}: ` +
        (error?.response?.data?.message ?? error?.message ?? "Delete failed")
      );
    }
  };

  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo); // 如果你的 delete 真正用 DELETE
      setTodos(todos.filter((t) => t.id !== todo.id));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(
        `Unable to delete Todo with ID ${todo.id}: ` +
        (error?.response?.data?.message ?? error?.message ?? "Delete failed")
      );
    }
  };

  // edit 包装 -> 实际调用 updateTodo
  const editTodo = async (todo: any) => {
    const next = { ...todo, title: `${todo.title} *` }; // 演示更新
    await updateTodo(next);
  };

  const updateTodo = async (todo: any) => {
    try {
      const updated = await client.updateTodo(todo); // 你自己的实现
      // 如果服务端返回完整数组就直接 set；若只返回单个对象，用 map 替换
      if (Array.isArray(updated)) {
        setTodos(updated);
      } else {
        setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
      }
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(
        `Unable to update Todo with ID ${todo.id}: ` +
        (error?.response?.data?.message ?? error?.message ?? "Update failed")
      );
    }
  };

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>

      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
          <button className="btn-close float-end" onClick={() => setErrorMessage(null)} />
        </div>
      )}

      <h4 className="clearfix">
        Todos
        <FaPlusCircle onClick={createTodo} className="text-success float-end fs-3" id="wd-create-todo" />
        <FaPlusCircle onClick={postTodo} className="text-primary float-end fs-3 me-3" id="wd-post-todo" />
      </h4>

      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <FaTrash
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1"
              id="wd-remove-todo"
              title="Remove via GET /:id/delete"
            />
            <TiDelete
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end me-2 fs-3"
              id="wd-delete-todo"
              title="Delete (real DELETE)"
            />
            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
              title="Edit title"
            />
            <input
              type="checkbox"
              className="form-check-input me-2"
              defaultChecked={todo.completed}
              readOnly
            />
            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.title}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
