// src/Kambaz/Courses/Quizzes/Teacher/QuizList.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  listQuizzes,
  createQuiz,
  publishQuiz,
  deleteQuiz,
  getMyLastAttempt,
} from "../api/quizzesApi";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | string;

type Quiz = {
  _id: string;
  courseId: string;
  title: string;
  published: boolean;
  points: number;
  window?: { due?: string; availableFrom?: string; availableUntil?: string };
  questionsCount?: number;
  createdAt?: string;
};

type LastAttempt = {
  _id: string;
  totalAutoScore: number;
  totalPoints: number;
  attemptNo: number;
} | null;

export default function QuizList() {
  const { cid } = useParams();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const role: Role | undefined = currentUser?.role;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [myScores, setMyScores] = useState<Record<string, LastAttempt>>({});

  const isFaculty = role === "FACULTY" || role === "ADMIN";
  const isEmpty = useMemo(() => !loading && quizzes.length === 0, [loading, quizzes]);

  async function fetchData() {
    if (!cid) return;
    setLoading(true);
    setErr(null);
    try {
      const { data } = await listQuizzes(cid);
      setQuizzes(data);

      if (role === "STUDENT") {
        const entries = await Promise.all(
          data.map(async (q: Quiz) => {
            try {
              const res = await getMyLastAttempt(q._id);
              return [q._id, res.data as LastAttempt] as const;
            } catch {
              return [q._id, null] as const;
            }
          })
        );
        setMyScores(Object.fromEntries(entries));
      } else {
        setMyScores({});
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, role]);

  async function onCreate() {
    if (!cid) return;
    const title = `New Quiz ${new Date().toLocaleString()}`;
    await createQuiz({ courseId: cid, title });
    await fetchData();
  }

  async function onTogglePublish(q: Quiz) {
    await publishQuiz(q._id, !q.published);
    await fetchData();
  }

  async function onDelete(q: Quiz) {
    if (!confirm(`Delete quiz "${q.title}"?`)) return;
    await deleteQuiz(q._id);
    await fetchData();
  }

  function availabilityLabel(q: Quiz) {
    const from = q.window?.availableFrom ? new Date(q.window.availableFrom) : undefined;
    const until = q.window?.availableUntil ? new Date(q.window.availableUntil) : undefined;
    const now = new Date();
    if (from && now < from) return `Not available until ${fmt(from)}`;
    if (until && now > until) return "Closed";
    return "Available";
  }

  function fmt(d: Date) {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Quizzes</h2>

        {isFaculty && (
          <button className="btn btn-danger" onClick={onCreate}>
            + Quiz
          </button>
        )}
      </div>

      {loading && <div>Loading…</div>}
      {err && <div className="text-danger">{err}</div>}

      {isEmpty && (
        <div className="alert alert-secondary">
          No quizzes yet.
          {isFaculty ? (
            <> Click <b>+ Quiz</b> in the top right to create one.</>
          ) : (
            <> Please wait for the instructor to publish a quiz.</>
          )}
        </div>
      )}

      {!isEmpty && (
        <ul className="list-group">
          {quizzes.map((q) => {
            const last = myScores[q._id];
            return (
              <li
                key={q._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex flex-column">
                  <Link
                    to={`/Kambaz/Courses/${cid}/Quizzes/${q._id}`}
                    className="fw-bold"
                  >
                    {q.title}
                  </Link>
                  <small className="text-muted">
                    Questions: {q.questionsCount ?? 0} · Points: {q.points ?? 0} ·{" "}
                    {q.published ? "✅ Published" : "🚫 Unpublished"} ·{" "}
                    Availability: {availabilityLabel(q)}{" "}
                    {q.window?.due && <>· Due: {fmt(new Date(q.window.due))}</>}
                    {role === "STUDENT" && last && (
                      <> · Last score: {last.totalAutoScore ?? 0} / {last.totalPoints ?? q.points ?? 0}</>
                    )}
                  </small>
                </div>

                {isFaculty && (
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => onTogglePublish(q)}
                    >
                      {q.published ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      to={`/Kambaz/Courses/${cid}/Quizzes/${q._id}/edit`}
                      className="btn btn-outline-primary"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => onDelete(q)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
