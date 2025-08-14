// Kambaz/Enrollments/dao.js
import model from "./model.js";

/** 某用户的课程 */
export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((e) => e.course).filter(Boolean);
}

/** 某课程的用户 */
export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((e) => e.user).filter(Boolean);
}

/** 选课：先查，避免重复键 */
export async function enrollUserInCourse(user, course) {
  const existing = await model.findOne({ user, course });
  if (existing) return existing;           // 已选过，直接返回
  return model.create({ user, course });    // 让 Mongo 自己生成 _id
}

/** 退课 */
export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}
