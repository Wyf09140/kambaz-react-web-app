// Kambaz/Users/dao.js
import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let users = db.users;
// 🔧 统一写回函数：任何改动都必须通过它更新本模块的 users 和 db.users
const save = (next) => { users = next; db.users = next; };

/** C - Create */
export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };         // 🔧 返回对象而不是数组
  save([...users, newUser]);                           // 🔧 写回 db.users
  return newUser;
};

/** R - Read */
export const findAllUsers = () => users;

export const findUserById = (userId) =>
  users.find((u) => u._id === userId);

export const findUserByUsername = (username) =>
  users.find((u) => u.username === username);

export const findUserByCredentials = (username, password) =>
  users.find((u) => u.username === username && u.password === password);

/** U - Update */
export const updateUser = (userId, changes) => {
  let updatedUser = null;
  const next = users.map((u) => {
    if (u._id !== userId) return u;
    updatedUser = { ...u, ...changes, _id: userId };  // 🔧 保留 _id，合并变更
    return updatedUser;
  });
  save(next);                                          // 🔧 写回 db.users
  return updatedUser;                                  // 🔧 返回更新后的对象
};

/** D - Delete */
export const deleteUser = (userId) => {
  const exists = users.some((u) => u._id === userId);
  if (!exists) return false;                           // 🔧 不存在时返回 false
  save(users.filter((u) => u._id !== userId));         // 🔧 写回 db.users
  return true;                                         // 🔧 删除成功
};
