// Kambaz/Users/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// 工具：把可能的 mongoose 文档转普通对象
const toPlain = (doc) =>
  doc && typeof doc.toObject === "function" ? doc.toObject() : doc;

/** C */
export const createUser = async (user) => {
  const newUser = { ...user, _id: uuidv4() };
  const doc = await model.create(newUser);
  return toPlain(doc);
};

/** R */
export const findAllUsers = () => model.find().lean();
export const findUserById = (userId) => model.findById(userId).lean();

export const findUserByUsername = (username) =>
  model.findOne({ username }).lean();

export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password }).lean();

/** U
 * 用 findOneAndUpdate 返回更新后的文档，便于路由返回给前端
 * 这里不做字段过滤，过滤放在 routes/controller 中
 */
export const updateUser = (userId, user) =>
  model
    .findOneAndUpdate({ _id: userId }, { $set: user }, { new: true, runValidators: true })
    .lean();

/** D */
export const deleteUser = (userId) => model.deleteOne({ _id: userId });

export const findUsersByRole = (role) => model.find({ role }).lean();

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model
    .find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    })
    .lean();
};
