import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

export const signin = async (credentials: any) => {
  const response = await axiosWithCredentials.post( `${USERS_API}/signin`, credentials );
  return response.data;
};

export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data;
};

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};


export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};

// src/.../client.ts
export const findUsersByRole = async (role: string) => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}?role=${encodeURIComponent(role)}`);
  return data;
};

export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(`${USERS_API}?name=${name}`);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get(`${USERS_API}/${id}`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete( `${USERS_API}/${userId}` );
  return response.data;
};

export const createUser = async (user: any) => {
  const response = await axios.post(`${USERS_API}`, user);
  return response.data;
};

export const findCoursesForUser = async (userId: string) => {
const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/courses`);
return response.data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
return response.data;
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/courses/${courseId}/users`
  );
  return data;
};

export const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

export const enroll = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.post(ENROLLMENTS_API, {
    user: userId,
    course: courseId,
  });
  return data; // -> enrollment 文档
};

/** 退课 */
export const unenroll = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${ENROLLMENTS_API}/${userId}/${courseId}`
  );
  return data; // -> { deletedCount: n }
};

export const createCourseForCurrentUser = async (course: any) => {
  // 你的后端在 POST /api/courses 时会把 currentUser 自动加入该课
  const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/courses`, course);
  return data;
};