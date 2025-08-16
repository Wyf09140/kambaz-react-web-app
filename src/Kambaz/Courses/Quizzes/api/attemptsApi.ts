// src/Kambaz/Courses/Quizzes/api/attemptsApi.ts
import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const base = import.meta.env.VITE_REMOTE_SERVER;

export const startAttempt = (quizId: string) =>
  axiosWithCredentials.post(`${base}/api/attempts`, { quizId });

export const saveAttempt = (attemptId: string, payload: any) =>
  axiosWithCredentials.put(`${base}/api/attempts/${attemptId}/save`, payload);

export const submitAttempt = (attemptId: string, payload: any) =>
  axiosWithCredentials.put(`${base}/api/attempts/${attemptId}/submit`, payload);

export const getMyAttempt = (quizId: string) =>
  axiosWithCredentials.get(`${base}/api/attempts/me`, { params: { quizId } });

export const getGrades = (quizId: string) =>
  axiosWithCredentials.get(`${base}/api/attempts/grades/${quizId}`);
