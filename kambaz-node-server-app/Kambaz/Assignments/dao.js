// Kambaz/Assignments/dao.js
import model from "./model.js";

/** 按课程查询所有作业（最新在前） */
export async function findAssignmentsForCourse(courseId) {
  return model
    .find({ course: courseId })
    .sort({ updatedAt: -1, createdAt: -1 });
}

/** 按作业ID查询单个 */
export function findAssignmentById(assignmentId) {
  return model.findById(assignmentId);
}

/** 新建作业（强制归属到 courseId） */
export function createAssignment(courseId, assignment = {}) {
  const doc = {
    title: "New Assignment",
    description: "",
    points: 100,
    course: courseId,
    ...assignment,
    course: courseId, // 覆盖防止外部传错课程
  };
  return model.create(doc);
}

/** 更新作业（返回更新后的文档） */
export function updateAssignment(assignmentId, updates = {}) {
  return model.findByIdAndUpdate(
    assignmentId,
    { $set: updates },
    { new: true }
  );
}

/** 删除作业（返回 { deletedCount }） */
export function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });
}
