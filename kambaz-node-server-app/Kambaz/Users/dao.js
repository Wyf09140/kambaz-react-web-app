// Kambaz/Users/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

/** C */
export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
}


/** R */
export const findAllUsers = () => model.find().lean();
export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) =>
  model.findOne({ username }).lean();
export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password }).lean();

/** U */
export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });

/** D */
export const deleteUser = (userId) => model.deleteOne({ _id: userId });


export const findUsersByRole = (role) => model.find({ role: role }); // or just model.find({ role })

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};

