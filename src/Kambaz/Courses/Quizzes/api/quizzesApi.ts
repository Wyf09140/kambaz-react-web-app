// src/Kambaz/Courses/Quizzes/api/quizzesApi.ts
import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const base = import.meta.env.VITE_REMOTE_SERVER;

// 列表 / 管理
export const listQuizzes = (courseId: string) =>
  axiosWithCredentials.get(`${base}/api/quizzes`, { params: { courseId } });

export const createQuiz = (payload: { courseId: string; title: string }) =>
  axiosWithCredentials.post(`${base}/api/quizzes`, payload);

export const publishQuiz = (quizId: string, published: boolean) =>
  axiosWithCredentials.put(`${base}/api/quizzes/${quizId}/publish`, { published });

export const deleteQuiz = (quizId: string) =>
  axiosWithCredentials.delete(`${base}/api/quizzes/${quizId}`);

// ✅ 新增：学生“我的最后一次”成绩（后端：GET /api/attempts/me?quizId=...）
export const getMyLastAttempt = (quizId: string) =>
  axiosWithCredentials.get(`${base}/api/attempts/me`, { params: { quizId } });

export const getQuizById = (quizId: string) =>
  axiosWithCredentials.get(`${base}/api/quizzes/${quizId}`);

export const updateQuiz = (quizId: string, payload: any) =>
  axiosWithCredentials.put(`${base}/api/quizzes/${quizId}`, payload);

export const addQuestion = (quizId: string, q: any) =>
  axiosWithCredentials.post(`${base}/api/quizzes/${quizId}/questions`, q);

export const updateQuestionById = (qid: string, q: any) =>
  axiosWithCredentials.put(`${base}/api/quizzes/questions/${qid}`, q);

export const deleteQuestionById = (qid: string) =>
  axiosWithCredentials.delete(`${base}/api/quizzes/questions/${qid}`);

// ----- Attempts APIs -----
export const startAttempt = (quizId: string) =>
  axiosWithCredentials.post(`${base}/api/attempts`, { quizId });

// 关键：这里用 responses 字段
export const saveAttempt = (attemptId: string, responses: any[]) =>
  axiosWithCredentials.put(`${base}/api/attempts/${attemptId}/save`, { responses });

export const submitAttempt = (attemptId: string) =>
  axiosWithCredentials.put(`${base}/api/attempts/${attemptId}/submit`);

export const getMyAttempt = (quizId: string) =>
  axiosWithCredentials.get(`${base}/api/attempts/me`, { params: { quizId } });

export const getGradesByQuiz = (quizId: string) =>
  axiosWithCredentials.get(`${base}/api/attempts/grades/${quizId}`);

export const getAttemptById = (attemptId: string) =>
  axiosWithCredentials.get(`${base}/api/attempts/${attemptId}`);
