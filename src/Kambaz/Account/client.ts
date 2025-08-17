// src/Kambaz/Account/client.ts
import axios from "axios";

// 统一后端基地址（部署时在 Netlify 环境变量里设置）
const BASE_URL = import.meta.env.VITE_REMOTE_SERVER;
if (!BASE_URL) {
  console.error(
    "[client] VITE_REMOTE_SERVER is missing. Example: https://kambaz-node-server-app-ufbd.onrender.com"
  );
}

// 统一的 axios 实例：基地址 + 携带凭证（cookie）
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ========== Users ==========
const USERS_API = "/api/users";

export const findAllUsers = async () => (await api.get(USERS_API)).data;

export const signin = async (credentials: { username: string; password: string }) =>
  (await api.post(`${USERS_API}/signin`, credentials)).data;

export const signup = async (user: any) =>
  (await api.post(`${USERS_API}/signup`, user)).data;

export const updateUser = async (user: any) =>
  (await api.put(`${USERS_API}/${user._id}`, user)).data;

// 建议 GET，减少预检
export const profile = async () => (await api.get(`${USERS_API}/profile`)).data;

export const signout = async () => (await api.post(`${USERS_API}/signout`)).data;

export const findMyCourses = async () =>
  (await api.get(`${USERS_API}/current/courses`)).data;

export const createCourse = async (course: any) =>
  (await api.post(`${USERS_API}/current/courses`, course)).data;

export const findUsersByRole = async (role: string) =>
  (await api.get(`${USERS_API}`, { params: { role } })).data;

export const findUsersByPartialName = async (name: string) =>
  (await api.get(`${USERS_API}`, { params: { name } })).data;

export const findUserById = async (id: string) =>
  (await api.get(`${USERS_API}/${id}`)).data;

export const deleteUser = async (userId: string) =>
  (await api.delete(`${USERS_API}/${userId}`)).data;

export const createUser = async (user: any) =>
  (await api.post(`${USERS_API}`, user)).data;

export const findCoursesForUser = async (userId: string) =>
  (await api.get(`${USERS_API}/${userId}/courses`)).data;

export const enrollIntoCourse = async (userId: string, courseId: string) =>
  (await api.post(`${USERS_API}/${userId}/courses/${courseId}`)).data;

export const unenrollFromCourse = async (userId: string, courseId: string) =>
  (await api.delete(`${USERS_API}/${userId}/courses/${courseId}`)).data;

// ========== Enrollments ==========
const ENROLLMENTS_API = "/api/enrollments";

export const enroll = async (userId: string, courseId: string) =>
  (await api.post(ENROLLMENTS_API, { user: userId, course: courseId })).data;

export const unenroll = async (userId: string, courseId: string) =>
  (await api.delete(`${ENROLLMENTS_API}/${userId}/${courseId}`)).data;

// ========== Courses（如果你这边也要直连课程端点）==========
export const createCourseForCurrentUser = async (course: any) =>
  (await api.post(`/api/courses`, course)).data;

export const findUsersForCourse = async (courseId: string) =>
  (await api.get(`/api/courses/${courseId}/users`)).data;
