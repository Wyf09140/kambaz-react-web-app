// Kambaz/Courses/dao.js
import model from "./model.js";
// 如果将来需要按选课查课程，再引入 enrollments 的 model 进行查询

export function findAllCourses() {
  return model.find().lean();
}

export async function findCoursesForEnrolledUser(_userId) {
  // 先返回空数组，等你接好 Enrollments 再实现
  return [];
}

export function createCourse(course) {
  // 现在 _id 由 Mongoose 自动生成
  return model.create(course);
}

export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}

export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}
