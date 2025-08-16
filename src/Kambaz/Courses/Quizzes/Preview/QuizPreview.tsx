// src/Kambaz/Courses/Quizzes/Preview/QuizPreview.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQuizById } from "../api/quizzesApi";

type QType = "MC" | "TF" | "FIB";
type Question = {
  _id: string;
  type: QType;
  title?: string;
  prompt: string;
  points: number;
  // MC
  choices?: string[];   // 后端可能叫 options，这里统一兜底
  options?: string[];
  correctIndex?: number;
  // TF
  correctBoolean?: boolean;
  // FIB
  correctTexts?: string[];
};

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const nav = useNavigate();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const role = currentUser?.role as string | undefined;
  const isFaculty = role === "FACULTY" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [points, setPoints] = useState(0);
  const [scoring, setScoring] = useState<any>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  // 本地答案
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const totalScore = useMemo(() => {
    if (!submitted) return 0;
    let sum = 0;
    for (const q of questions) {
      const a = answers[q._id];
      sum += autoScore(q, a);
    }
    return sum;
  }, [submitted, answers, questions]);

  useEffect(() => {
    if (!qid) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getQuizById(qid);
        setTitle(data.quiz?.title || "");
        setPoints(Number(data.quiz?.points || 0));
        setScoring(data.quiz?.scoring || {});
        const list: Question[] = (data.questions || []).map((q: any) => ({
          _id: q._id,
          type: q.type,
          title: q.title || "",
          prompt: q.prompt || "",
          points: Number(q.points || 0),
          choices: q.choices || q.options || [],
          options: q.options,
          correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : undefined,
          correctBoolean: typeof q.correctBoolean === "boolean" ? q.correctBoolean : undefined,
          correctTexts: Array.isArray(q.correctTexts) ? q.correctTexts : [],
        }));
        setQuestions(list);
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
          <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>&larr; Back to Details</Link>
        </div>
      </div>
    );
  }

  function setAnswer(qid: string, value: any) {
    setAnswers((m) => ({ ...m, [qid]: value }));
  }

  function onSubmitPreview() {
    setSubmitted(true);
    // 不落库，只计算并展示
  }

  return (
    <div className="p-3">
      {/* 顶部横幅 */}
      <div className="alert alert-warning d-flex justify-content-between align-items-center">
        <div className="fw-semibold">Preview mode — not saved</div>
        {submitted && (
          <span className="badge text-bg-success fs-6">
            Score: {totalScore} / {points}
          </span>
        )}
      </div>

      {/* 标题 + meta */}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">{title || "Untitled Quiz"}</h2>
        <div className="text-muted">
          Points: <b>{points}</b>
          {scoring?.timeLimit ? <> · Time limit: {Math.round((scoring.timeLimit || 0) / 60)} min</> : null}
          {scoring?.multipleAttempts ? <> · Attempts: {scoring.maxAttempts ?? 1}</> : <> · Attempts: 1</>}
        </div>
      </div>

      {loading && <div className="mt-3">Loading…</div>}
      {err && <div className="mt-3 text-danger">{err}</div>}

      {/* 题目 */}
      <ol className="mt-3">
        {questions.map((q, _idx) => {
          const choiceList = q.choices && q.choices.length ? q.choices : q.options || [];
          const showCorrect = submitted && !!scoring?.showCorrectAnswers;
          const got = submitted ? autoScore(q, answers[q._id]) : 0;

          return (
            <li key={q._id} className="mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="fw-semibold">{q.title || typeLabel(q.type)}</div>
                <div className="text-muted small">({q.points} pts)</div>
                {submitted && (
                  <span className={"badge " + (got > 0 ? "text-bg-success" : "text-bg-secondary")}>
                    {got} / {q.points}
                  </span>
                )}
              </div>

              <div className="mt-1" dangerouslySetInnerHTML={{ __html: q.prompt }} />

              {/* MC */}
              {q.type === "MC" && (
                <div className="mt-2">
                  {(choiceList || []).map((opt, i) => {
                    const checked = answers[q._id] === i;
                    const isCorrect = q.correctIndex === i;
                    const decorate =
                      showCorrect && (checked || isCorrect)
                        ? isCorrect
                          ? "border border-success rounded px-2 py-1"
                          : checked
                          ? "border border-danger rounded px-2 py-1"
                          : ""
                        : "";
                    return (
                      <div key={i} className="form-check my-1">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`mc-${q._id}`}
                          checked={!!checked}
                          onChange={() => setAnswer(q._id, i)}
                        />
                        <label className={"form-check-label " + decorate}>{opt}</label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TF */}
              {q.type === "TF" && (
                <div className="mt-2">
                  {([true, false] as const).map((val, i) => {
                    const checked = answers[q._id] === val;
                    const isCorrect = q.correctBoolean === val;
                    const text = val ? "True" : "False";
                    const decorate =
                      showCorrect && (checked || isCorrect)
                        ? isCorrect
                          ? "border border-success rounded px-2 py-1"
                          : checked
                          ? "border border-danger rounded px-2 py-1"
                          : ""
                        : "";
                    return (
                      <div key={i} className="form-check my-1">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`tf-${q._id}`}
                          checked={!!checked}
                          onChange={() => setAnswer(q._id, val)}
                        />
                        <label className={"form-check-label " + decorate}>{text}</label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* FIB */}
              {q.type === "FIB" && (
                <div className="mt-2">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Type your answer here…"
                    value={answers[q._id]?.fib ?? ""}
                    onChange={(e) => setAnswer(q._id, { fib: e.target.value })}
                  />
                  {showCorrect && (
                    <div className="small text-muted mt-1">
                      Acceptable answers: {(q.correctTexts || []).join(", ")}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* 操作区 */}
      <div className="d-flex gap-2">
        {!submitted ? (
          <button className="btn btn-danger" onClick={onSubmitPreview}>
            Submit Preview
          </button>
        ) : (
          <button className="btn btn-outline-secondary" onClick={() => setSubmitted(false)}>
            Reset Preview
          </button>
        )}
        <button
          className="btn btn-outline-secondary"
          onClick={() => nav(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
        >
          Back to Edit
        </button>
        <Link className="btn btn-outline-secondary" to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>
          Back to Details
        </Link>
      </div>
    </div>
  );
}

/** 题目类型中文名 */
function typeLabel(t: QType) {
  if (t === "MC") return "Multiple Choice";
  if (t === "TF") return "True/False";
  return "Fill in the Blank";
}

/** 本地自动评分（与后端一致的简版） */
function autoScore(q: Question, a: any) {
  if (!q) return 0;
  const pts = Number(q.points || 0);
  if (q.type === "MC") {
    const idx = typeof a === "number" ? a : undefined;
    return idx !== undefined && idx === q.correctIndex ? pts : 0;
  }
  if (q.type === "TF") {
    const v = typeof a === "boolean" ? a : undefined;
    return v !== undefined && v === q.correctBoolean ? pts : 0;
  }
  if (q.type === "FIB") {
    const input = (a?.fib ?? "").toString().trim().toLowerCase();
    const arr = (q.correctTexts || []).map((s) => (s || "").toString().trim().toLowerCase());
    return input && arr.includes(input) ? pts : 0;
  }
  return 0;
}
