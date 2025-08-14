import axios from "axios";

const api = axios.create({ withCredentials: true });
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const BASE = `${REMOTE_SERVER}/api`;

export const findAssignmentsForCourse = async (cid: string) => {
  const { data } = await api.get(`${BASE}/courses/${cid}/assignments`);
  return data;
};

export const findAssignmentById = async (aid: string) => {
  const { data } = await api.get(`${BASE}/assignments/${aid}`);
  return data;
};

export const createAssignment = async (cid: string, a: any) => {
  const { data } = await api.post(`${BASE}/courses/${cid}/assignments`, a);
  return data; // 返回新作业
};

export const updateAssignment = async (aid: string, updates: any) => {
  const { data } = await api.put(`${BASE}/assignments/${aid}`, updates);
  return data;
};
export const deleteAssignment = async (aid: string) => {
  await api.delete(`${BASE}/assignments/${aid}`);
  return true;
};

export * from "../client";
