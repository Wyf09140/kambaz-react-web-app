// src/Kambaz/Courses/Quizzes/Teacher/Grades.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getGradesByQuiz, getQuizById } from "../api/quizzesApi";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | string;

type AttemptRow = {
  _id: string;
  userId: string;
  quizId: string;
  totalAutoScore: number;
  totalPoints: number;
  submittedAt?: string;
};

export default function TeacherGrades() {
  const { cid, qid } = useParams();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const role: Role | undefined = currentUser?.role;
  const isFaculty = role === "FACULTY" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ average: number; count: number } | null>(null);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    if (!qid) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [gradesRes, quizRes] = await Promise.all([
          getGradesByQuiz(qid),
          getQuizById(qid),
        ]);
        const g = gradesRes.data || {};
        setMeta({ average: Number(g.average || 0), count: Number(g.count || 0) });
        setAttempts(Array.isArray(g.attempts) ? g.attempts : []);
        setQuizTitle(quizRes.data?.quiz?.title || "");
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load grades");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  const rows = useMemo(() => attempts.map((a) => ({
    ...a,
    pct: a.totalPoints ? Math.round((a.totalAutoScore / a.totalPoints) * 100) : 0,
  })), [attempts]);

  if (!isFaculty) return <div className="p-3 text-danger">Faculty only.</div>;
  if (loading) return <div className="p-3">Loading…</div>;
  if (err) return <div className="p-3 text-danger">{err}</div>;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">{quizTitle || "Quiz"} — Grades</h2>
        <div>
          <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} className="btn btn-outline-secondary">
            Back to Details
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-2 text-muted">
        Submissions: <b>{meta?.count ?? 0}</b> · Average: <b>{Math.round(meta?.average ?? 0)}</b>
      </div>

      {/* Chart (超轻量，不引入库，纯 CSS 柱状条) */}
      <div className="mt-3">
        <div className="small text-muted mb-1">Distribution (by %)</div>
        <div className="d-flex align-items-end gap-2" style={{height: 120}}>
          {rows.length === 0 ? (
            <div className="text-secondary">No data yet</div>
          ) : (
            rows.slice(0, 30).map((r) => (
              <div key={r._id}
                   title={`${r.pct}%`}
                   style={{
                     width: 10,
                     height: Math.max(4, (r.pct / 100) * 120),
                     background: "#0d6efd",
                     borderRadius: 2
                   }}/>
            ))
          )}
        </div>
        {rows.length > 30 && (
          <div className="small text-muted">Showing first 30 bars…</div>
        )}
      </div>

      {/* Table */}
      <div className="mt-4">
        {rows.length === 0 ? (
          <div className="alert alert-secondary">No submissions yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Score</th>
                <th>%</th>
                <th>Submitted</th>
              </tr>
              </thead>
              <tbody>
              {rows.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td><code>{r.userId}</code></td>
                  <td>{r.totalAutoScore} / {r.totalPoints}</td>
                  <td>{r.pct}%</td>
                  <td>{r.submittedAt ? fmt(new Date(r.submittedAt)) : "—"}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(d: Date) {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
