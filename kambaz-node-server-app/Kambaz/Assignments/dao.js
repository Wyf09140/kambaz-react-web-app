// Kambaz/Assignments/dao.js
import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// 统一读/写入口，避免本地副本与 Database 脱节
const getAll = () => Database.assignments ?? [];
const saveAll = (next) => { Database.assignments = next; };

/** 按课程取作业列表 */
export const findAssignmentsForCourse = (cid) =>
  getAll().filter((a) => a.course === cid);

/** 按作业ID取单个 */
export const findAssignmentById = (aid) =>
  getAll().find((a) => a._id === aid);

/** 新建作业（返回新作业） */
export const createAssignment = (cid, assignment = {}) => {
  const fresh = {
    _id: uuidv4(),
    course: cid,                                  // 强制归属课程
    title: assignment.title ?? "New Assignment",
    description: assignment.description ?? "",
    points: assignment.points ?? 100,
    dueDate: assignment.dueDate ?? new Date().toISOString().slice(0, 10),
    availableFromDate: assignment.availableFromDate ?? null,
    untilDate: assignment.untilDate ?? null,
    ...assignment,
    course: cid,                                  // 覆盖防止外部传错
  };
  const next = [...getAll(), fresh];
  saveAll(next);
  return fresh;
};

/** 更新作业（返回更新后的对象；不存在则返回 null） */
export const updateAssignment = (aid, updates = {}) => {
  const list = getAll();
  const idx = list.findIndex((a) => a._id === aid);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...updates, _id: aid };
  const next = [...list];
  next[idx] = updated;
  saveAll(next);
  return updated;
};

/** 删除作业（返回是否删除成功） */
export const deleteAssignment = (aid) => {
  const list = getAll();
  const next = list.filter((a) => a._id !== aid);
  const removed = next.length !== list.length;
  if (removed) saveAll(next);
  return removed;
};
