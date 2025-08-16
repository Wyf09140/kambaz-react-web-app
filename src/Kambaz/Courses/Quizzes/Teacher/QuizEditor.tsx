// src/Kambaz/Courses/Quizzes/Teacher/QuizEditor.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQuizById, updateQuiz, publishQuiz } from "../api/quizzesApi";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | string;

type QuizForm = {
  title: string;
  description: string;
  scoring: {
    timeLimit: number;             // seconds
    multipleAttempts: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    shuffleAnswers: boolean;
    oneQuestionAtATime: boolean;
    lockAfterAnswering: boolean;
    accessCode: string;
  };
  window: {
    availableFrom?: string;        // local datetime input
    availableUntil?: string;
    due?: string;
  };
};

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const nav = useNavigate();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const role: Role | undefined = currentUser?.role;
  const isFaculty = role === "FACULTY" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [initialPublished, setInitialPublished] = useState(false);
  const [form, setForm] = useState<QuizForm>({
    title: "",
    description: "",
    scoring: {
      timeLimit: 20 * 60,
      multipleAttempts: false,
      maxAttempts: 1,
      showCorrectAnswers: true,
      shuffleAnswers: false,
      oneQuestionAtATime: false,
      lockAfterAnswering: false,
      accessCode: "",
    },
    window: {},
  });

  useEffect(() => {
    if (!qid) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getQuizById(qid);
        const q = data.quiz;
        setInitialPublished(!!q.published);
        setForm({
          title: q.title || "",
          description: q.description || "",
          scoring: {
            timeLimit: Number(q.scoring?.timeLimit ?? 20 * 60),
            multipleAttempts: !!q.scoring?.multipleAttempts,
            maxAttempts: Number(q.scoring?.maxAttempts ?? 1),
            showCorrectAnswers: !!q.scoring?.showCorrectAnswers,
            shuffleAnswers: !!q.scoring?.shuffleAnswers,
            oneQuestionAtATime: !!q.scoring?.oneQuestionAtATime,
            lockAfterAnswering: !!q.scoring?.lockAfterAnswering,
            accessCode: q.scoring?.accessCode ?? "",
          },
          window: {
            availableFrom: toLocalInput(q.window?.availableFrom),
            availableUntil: toLocalInput(q.window?.availableUntil),
            due: toLocalInput(q.window?.due),
          },
        });
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  if (!isFaculty) {
    return (
      <div className="p-3 text-danger">
        Faculty only.
        <div className="mt-2">
          <Link to={`/Kambaz/Courses/${cid}/Quizzes`}>&larr; Back</Link>
        </div>
      </div>
    );
  }

  const set = <K extends keyof QuizForm>(k: K, v: QuizForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const setS = <K extends keyof QuizForm["scoring"]>(k: K, v: QuizForm["scoring"][K]) =>
    setForm((f) => ({ ...f, scoring: { ...f.scoring, [k]: v } }));
  const setW = <K extends keyof QuizForm["window"]>(k: K, v: QuizForm["window"][K]) =>
    setForm((f) => ({ ...f, window: { ...f.window, [k]: v } }));

  async function onSave(go: "details" | "list") {
    if (!qid) return;
    setLoading(true);
    setErr(null);
    try {
      const payload = {
        title: form.title.trim() || "Untitled Quiz",
        description: form.description || "",
        scoring: {
          ...form.scoring,
          // 防止负数：timeLimit 以秒存储
          timeLimit: Math.max(0, Number(form.scoring.timeLimit || 0)),
          // 当 multipleAttempts 为 false 时强制为 1
          maxAttempts: form.scoring.multipleAttempts
            ? Math.max(1, Math.floor(Number(form.scoring.maxAttempts) || 1))
            : 1,
        },
        window: {
          availableFrom: toISO(form.window.availableFrom),
          availableUntil: toISO(form.window.availableUntil),
          due: toISO(form.window.due),
        },
      };
      await updateQuiz(qid, payload);
      nav(
        go === "list"
          ? `/Kambaz/Courses/${cid}/Quizzes`
          : `/Kambaz/Courses/${cid}/Quizzes/${qid}`
      );
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  }

  async function onSaveAndPublish() {
    if (!qid) return;
    await onSave("list");
    try {
      await publishQuiz(qid, true);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <h2 className="m-0">Edit Quiz</h2>
          <Link
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/questions`}
            className="btn btn-outline-secondary ms-2"
          >
            Edit Questions
          </Link>
        </div>
        <div className="text-muted">
          {initialPublished ? "Currently Published" : "Currently Unpublished"}
        </div>
      </div>

      {loading && <div className="mt-3">Saving/Loading…</div>}
      {err && <div className="mt-3 text-danger">{err}</div>}

      {/* Title */}
      <div className="mt-3">
        <label className="form-label fw-semibold">Title</label>
        <input
          className="form-control"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Enter quiz title"
        />
      </div>

      {/* Description */}
      <div className="mt-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          className="form-control"
          rows={5}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Rich text/HTML allowed"
        />
      </div>

      {/* Scoring & Attempts */}
      <div className="mt-4">
        <h5>Scoring & Attempts</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Time Limit (minutes)</label>
            <input
              type="number"
              min={0}
              className="form-control"
              value={Math.round((form.scoring.timeLimit || 0) / 60)}
              onChange={(e) => setS("timeLimit", Number(e.target.value) * 60)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Multiple Attempts</label>
            <select
              className="form-select"
              value={form.scoring.multipleAttempts ? "1" : "0"}
              onChange={(e) => {
                const on = e.target.value === "1";
                setS("multipleAttempts", on);
                if (!on && form.scoring.maxAttempts !== 1) {
                  setS("maxAttempts", 1); // 立刻归 1，避免视觉与保存不一致
                }
              }}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Max Attempts</label>
            <input
              type="number"
              min={1}
              step={1}
              className="form-control"
              value={form.scoring.maxAttempts}
              onChange={(e) => {
                const v = Math.max(1, Math.floor(Number(e.target.value) || 1));
                setS("maxAttempts", v);
                // 输入 >1 时自动开启 Multiple Attempts，提升可用性
                if (v > 1 && !form.scoring.multipleAttempts) {
                  setS("multipleAttempts", true);
                }
              }}
            />

          </div>

          <div className="col-md-3">
            <label className="form-label">Show Correct Answers</label>
            <select
              className="form-select"
              value={form.scoring.showCorrectAnswers ? "1" : "0"}
              onChange={(e) =>
                setS("showCorrectAnswers", e.target.value === "1")
              }
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-3">
            <label className="form-label">Shuffle Answers</label>
            <select
              className="form-select"
              value={form.scoring.shuffleAnswers ? "1" : "0"}
              onChange={(e) => setS("shuffleAnswers", e.target.value === "1")}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">One Question at a Time</label>
            <select
              className="form-select"
              value={form.scoring.oneQuestionAtATime ? "1" : "0"}
              onChange={(e) =>
                setS("oneQuestionAtATime", e.target.value === "1")
              }
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Lock Questions After Answering</label>
            <select
              className="form-select"
              value={form.scoring.lockAfterAnswering ? "1" : "0"}
              onChange={(e) =>
                setS("lockAfterAnswering", e.target.value === "1")
              }
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Access Code</label>
            <input
              className="form-control"
              value={form.scoring.accessCode}
              onChange={(e) => setS("accessCode", e.target.value)}
              placeholder="Optional code"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-4">
        <h5>Availability</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Available from</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.window.availableFrom ?? ""}
              onChange={(e) => setW("availableFrom", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Until</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.window.availableUntil ?? ""}
              onChange={(e) => setW("availableUntil", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Due</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.window.due ?? ""}
              onChange={(e) => setW("due", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 d-flex gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => onSave("details")}
          disabled={loading}
        >
          Save
        </button>
        <button
          className="btn btn-danger"
          onClick={onSaveAndPublish}
          disabled={loading}
        >
          Save &amp; Publish
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => nav(`/Kambaz/Courses/${cid}/Quizzes`)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>

      <div className="mt-3">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>
          &larr; Back to Details
        </Link>
      </div>
    </div>
  );
}

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}
function toISO(local?: string) {
  if (!local) return undefined;
  return new Date(local).toISOString();
}
