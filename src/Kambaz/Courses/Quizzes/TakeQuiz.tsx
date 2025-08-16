import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQuizById, startAttempt, saveAttempt, submitAttempt } from "./api/quizzesApi";

type A = Record<string, any>;
type Q = {
  _id: string;
  type: "MC" | "TF" | "FIB";
  title?: string;
  prompt: string;
  points: number;
  options?: string[];
  choices?: string[]; // 兼容旧字段
};

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const nav = useNavigate();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const isStudent = currentUser?.role === "STUDENT";

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<A>({});
  const [attemptId, setAttemptId] = useState<string>("");
  const [_attemptStartedAt, setAttemptStartedAt] = useState<number | null>(null); // ✅ 修复
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // one-at-a-time
  const [idx, setIdx] = useState(0);
  const lockedRef = useRef<Set<string>>(new Set());
  const dirtyRef = useRef(false);
  const autoSubmitOnce = useRef(false);

  // 计时
  const [remaining, setRemaining] = useState<number | null>(null);
  const hasTimeLimit = useMemo(
    () => Number(quiz?.scoring?.timeLimit || 0) > 0,
    [quiz?.scoring?.timeLimit]
  );

  const totalPoints = useMemo(
    () => questions.reduce((s, q) => s + (q.points || 0), 0),
    [questions]
  );

  // 初始化：拉题面 & 开始一次 attempt
  useEffect(() => {
    if (!qid) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getQuizById(qid);
        setQuiz(data.quiz);
        setQuestions((data.questions || []) as Q[]);

        const sa = await startAttempt(qid); 
        const a = sa.data;
        setAttemptId(a._id);

        // 记录后端 startedAt（统一以此为准）
        const startedAtMs = a?.startedAt ? new Date(a.startedAt).getTime() : Date.now();
        setAttemptStartedAt(startedAtMs);   // ✅ 存入 state

        // 初始化倒计时
        const tlSec = Number(data.quiz?.scoring?.timeLimit || 0);
        if (tlSec > 0) {
          const usedSec = Math.floor((Date.now() - startedAtMs) / 1000);
          setRemaining(Math.max(0, tlSec - usedSec));
        } else {
          setRemaining(null);
        }
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to start quiz");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  // 倒计时计时器 & 自动提交
  useEffect(() => {
    if (!hasTimeLimit || submitted) return;
    if (remaining === null) return;
    if (remaining <= 0) {
      if (!autoSubmitOnce.current) {
        autoSubmitOnce.current = true;
        onSubmit();
      }
      return;
    }
    const t = setInterval(() => setRemaining((s) => (typeof s === "number" ? s - 1 : s)), 1000);
    return () => clearInterval(t);
  }, [hasTimeLimit, remaining, submitted]);

  // 自动保存
  useEffect(() => {
    if (!attemptId || submitted) return;
    const t = setInterval(async () => {
      if (!dirtyRef.current) return;
      try {
        await onSave();
        dirtyRef.current = false;
      } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [attemptId, submitted]);

  // 离开提醒
  useEffect(() => {
    if (submitted) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [submitted]);

  function setAns(q: Q, v: any) {
    setAnswers((prev) => {
      const next = { ...prev, [q._id]: v };
      dirtyRef.current = true;
      return next;
    });

    if (quiz?.scoring?.oneQuestionAtATime && quiz?.scoring?.lockAfterAnswering) {
      lockedRef.current.add(String(q._id));
    }
  }

  function isLocked(q: Q) {
    if (!(quiz?.scoring?.oneQuestionAtATime && quiz?.scoring?.lockAfterAnswering)) return false;
    return lockedRef.current.has(String(q._id));
  }

  function buildResponses() {
    const arr: any[] = [];
    for (const q of questions) {
      const a = answers[q._id];
      if (!a) continue;
      if (a.type === "MC") {
        arr.push({ questionId: q._id, answer: { mc: a.index } });
      } else if (a.type === "TF") {
        arr.push({ questionId: q._id, answer: { tf: a.value === true } });
      } else if (a.type === "FIB") {
        const first = Array.isArray(a.texts) ? a.texts.find((s: string) => s && s.trim()) : "";
        arr.push({ questionId: q._id, answer: { fib: first || "" } });
      }
    }
    return arr;
  }

  async function onSave() {
    if (!attemptId) return;
    const responses = buildResponses();
    await saveAttempt(attemptId, responses);
  }

  async function onSubmit() {
    if (!attemptId) return;
    try {
      await onSave();
      const { data } = await submitAttempt(attemptId);
      setSubmitted(true);
      setScore(data?.totalAutoScore ?? 0);
      nav(`/Kambaz/Courses/${cid}/Quizzes/${qid}/result/${attemptId}`);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to submit");
    }
  }

  const oneAtATime = !!quiz?.scoring?.oneQuestionAtATime;
  const q = questions[idx];

  function fmtMMSS(s: number) {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(m)}:${pad(ss)}`;
  }

  if (!isStudent) return <div className="p-3 text-danger">Students only.</div>;
  if (loading) return <div className="p-3">Loading…</div>;
  if (err) return <div className="p-3 text-danger">{err}</div>;
  if (!quiz) return null;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">{quiz.title}</h2>
        <div className="d-flex align-items-center gap-2">
          {hasTimeLimit && remaining !== null && !submitted && (
            <span className={`badge ${remaining <= 30 ? "text-bg-danger" : "text-bg-secondary"} fs-6`}>
              ⏱ {fmtMMSS(remaining)}
            </span>
          )}
          {!submitted && (
            <button className="btn btn-outline-secondary" onClick={onSave}>
              Save
            </button>
          )}
          {!submitted ? (
            <button className="btn btn-danger" onClick={onSubmit}>
              Submit Quiz
            </button>
          ) : (
            <span className="badge text-bg-success fs-6">
              Score: {score} / {totalPoints}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 text-muted">
        Points: <b>{totalPoints}</b>
        {quiz?.scoring?.timeLimit ? <> · Time limit: {Math.round((quiz.scoring.timeLimit || 0) / 60)} min</> : null}
        {quiz?.scoring?.multipleAttempts ? <> · Attempts: {quiz.scoring.maxAttempts ?? 1}</> : <> · Attempts: 1</>}
      </div>

      <hr />

      {!oneAtATime ? (
        <ol className="mt-3">
          {questions.map((q: Q, i: number) => {
            const opts = q.options || q.choices || [];
            const disabled = submitted;
            return (
              <li key={q._id} className="mb-4">
                <div className="mb-1">
                  <b>{q.title || `Question ${i + 1}`}</b>{" "}
                  <span className="text-muted">({q.points || 0} pts)</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: q.prompt }} className="mb-2" />
                {q.type === "MC" &&
                  opts.map((opt: string, k: number) => (
                    <div className="form-check" key={k}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`mc-${q._id}`}
                        id={`mc-${q._id}-${k}`}
                        disabled={disabled}
                        checked={answers[q._id]?.index === k}
                        onChange={() => setAns(q, { type: "MC", index: k })}
                      />
                      <label className="form-check-label" htmlFor={`mc-${q._id}-${k}`}>
                        {opt}
                      </label>
                    </div>
                  ))}
                {q.type === "TF" && (
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`tf-${q._id}`}
                        id={`tf-${q._id}-t`}
                        disabled={disabled}
                        checked={answers[q._id]?.value === true}
                        onChange={() => setAns(q, { type: "TF", value: true })}
                      />
                      <label className="form-check-label" htmlFor={`tf-${q._id}-t`}>
                        True
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`tf-${q._id}`}
                        id={`tf-${q._id}-f`}
                        disabled={disabled}
                        checked={answers[q._id]?.value === false}
                        onChange={() => setAns(q, { type: "TF", value: false })}
                      />
                      <label className="form-check-label" htmlFor={`tf-${q._id}-f`}>
                        False
                      </label>
                    </div>
                  </div>
                )}
                {q.type === "FIB" && (
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Enter all answers, one per line"
                    disabled={disabled}
                    value={(answers[q._id]?.texts || []).join("\n")}
                    onChange={(e) =>
                      setAns(q, {
                        type: "FIB",
                        texts: e.target.value.split(/\n|;/).map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <>
          <div className="mb-1">
            <b>{q?.title || `Question ${idx + 1}`}</b>{" "}
            <span className="text-muted">({q?.points || 0} pts)</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: q?.prompt || "" }} className="mb-2" />

          {q && (
            <>
              {q.type === "MC" &&
                (q.options || q.choices || []).map((opt: string, k: number) => (
                  <div className="form-check" key={k}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`mc-${q._id}`}
                      id={`mc-${q._id}-${k}`}
                      disabled={submitted || isLocked(q)}
                      checked={answers[q._id]?.index === k}
                      onChange={() => setAns(q, { type: "MC", index: k })}
                    />
                    <label className="form-check-label" htmlFor={`mc-${q._id}-${k}`}>
                      {opt}
                    </label>
                  </div>
                ))}
              {q.type === "TF" && (
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`tf-${q._id}`}
                      id={`tf-${q._id}-t`}
                      disabled={submitted || isLocked(q)}
                      checked={answers[q._id]?.value === true}
                      onChange={() => setAns(q, { type: "TF", value: true })}
                    />
                    <label className="form-check-label" htmlFor={`tf-${q._id}-t`}>
                      True
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`tf-${q._id}`}
                      id={`tf-${q._id}-f`}
                      disabled={submitted || isLocked(q)}
                      checked={answers[q._id]?.value === false}
                      onChange={() => setAns(q, { type: "TF", value: false })}
                    />
                    <label className="form-check-label" htmlFor={`tf-${q._id}-f`}>
                      False
                    </label>
                  </div>
                </div>
              )}
              {q.type === "FIB" && (
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Enter all answers, one per line"
                  disabled={submitted || isLocked(q)}
                  value={(answers[q._id]?.texts || []).join("\n")}
                  onChange={(e) =>
                    setAns(q, {
                      type: "FIB",
                      texts: e.target.value.split(/\n|;/).map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              )}
            </>
          )}

          <div className="mt-3 d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              disabled={idx === 0}
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
            >
              Prev
            </button>
            <div className="text-muted">
              {idx + 1} / {questions.length}
            </div>
            <button
              className="btn btn-outline-secondary"
              disabled={idx === questions.length - 1}
              onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}

      <div className="mt-4">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>&larr; Back to Details</Link>
      </div>
    </div>
  );
}
