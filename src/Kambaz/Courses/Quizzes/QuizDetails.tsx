import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQuizById, publishQuiz } from "./api/quizzesApi";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | string;

type QuizDoc = {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  published: boolean;
  points: number;
  window?: { due?: string; availableFrom?: string; availableUntil?: string };
  scoring?: {
    timeLimit?: number;              // seconds
    multipleAttempts?: boolean;
    maxAttempts?: number;
    showCorrectAnswers?: boolean;
    shuffleAnswers?: boolean;
    oneQuestionAtATime?: boolean;
    lockAfterAnswering?: boolean;
    accessCode?: string;
  };
};

type QuestionDoc = {
  _id: string;
  type: "MC" | "TF" | "FIB";
  title?: string;
  prompt: string;
  points: number;
};

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const nav = useNavigate();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const role: Role | undefined = currentUser?.role;

  const [quiz, setQuiz] = useState<QuizDoc | null>(null);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isFaculty = role === "FACULTY" || role === "ADMIN";

  useEffect(() => {
    async function load() {
      if (!qid) return;
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getQuizById(qid);
        setQuiz(data.quiz);
        setQuestions(data.questions || []);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [qid]);

  const availability = useMemo(() => {
    if (!quiz) return { label: "", status: "UNKNOWN" as "UNKNOWN" | "NOT_YET" | "CLOSED" | "AVAILABLE" };
    const from = quiz.window?.availableFrom ? new Date(quiz.window.availableFrom) : undefined;
    const until = quiz.window?.availableUntil ? new Date(quiz.window.availableUntil) : undefined;
    const now = new Date();
    if (from && now < from) return { label: `Not available until ${fmt(from)}`, status: "NOT_YET" as const };
    if (until && now > until) return { label: "Closed", status: "CLOSED" as const };
    return { label: "Available", status: "AVAILABLE" as const };
  }, [quiz]);

  async function onTogglePublish() {
    if (!quiz) return;
    const { data } = await publishQuiz(quiz._id, !quiz.published);
    setQuiz(data);
  }

  function onStart() {
    // 学生开始答题（进入作答页）
    nav(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`);
  }

  if (loading) return <div className="p-3">Loading…</div>;
  if (err) return <div className="p-3 text-danger">{err}</div>;
  if (!quiz) return null;

  return (
    <div className="p-3">
      {/* 顶部：标题 + 操作按钮（保持你的原样式与布局） */}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">{quiz.title}</h2>
        <div className="d-flex gap-2">
          {isFaculty ? (
            <>
 

              <Link
                to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`}
                className="btn btn-outline-secondary"
              >
                Preview
              </Link>
              <Link
                to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/grades`}
                className="btn btn-outline-secondary"
              >
                Grades
              </Link>
              <Link
                to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`}
                className="btn btn-primary"
              >
                Edit
              </Link>
              <button className="btn btn-outline-secondary" onClick={onTogglePublish}>
                {quiz.published ? "Unpublish" : "Publish"}
              </button>
            </>
          ) : (
            <button
              className="btn btn-danger"
              onClick={onStart}
              disabled={!quiz.published || availability.status !== "AVAILABLE"}
              title={
                !quiz.published
                  ? "Quiz not published"
                  : availability.status !== "AVAILABLE"
                  ? availability.label
                  : ""
              }
            >
              Start Quiz
            </button>
          )}
        </div>
      </div>

      {/* meta 信息（保持你的原 UI） */}
      <div className="mt-2 text-muted">
        Points: <b>{quiz.points ?? 0}</b> · Availability: {availability.label}
        {quiz.window?.due && <> · Due: {fmt(new Date(quiz.window.due))}</>}
        {quiz.scoring?.timeLimit ? <> · Time limit: {Math.round((quiz.scoring.timeLimit || 0) / 60)} min</> : null}
        {quiz.scoring?.multipleAttempts ? (
          <> · Attempts: {quiz.scoring.maxAttempts ?? 1}</>
        ) : (
          <> · Attempts: 1</>
        )}
      </div>

      {/* description */}
      {quiz.description && (
        <div className="mt-3" dangerouslySetInnerHTML={{ __html: quiz.description }} />
      )}

      {/* questions 列表（保持你的原 UI） */}
      <div className="mt-4">
        <h5 className="mb-2">Questions ({questions.length})</h5>
        {questions.length === 0 ? (
          <div className="alert alert-secondary">No questions yet.</div>
        ) : (
          <ul className="list-group">
            {questions.map((q) => (
              <li key={q._id} className="list-group-item">
                <b>{q.title || q.type}</b> — {stripHtml(q.prompt).slice(0, 80)}
                {stripHtml(q.prompt).length > 80 ? "…" : ""}{" "}
                <span className="text-muted">({q.points} pts)</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* back link */}
      <div className="mt-3">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes`}>&larr; Back to Quizzes</Link>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function fmt(d: Date) {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}
