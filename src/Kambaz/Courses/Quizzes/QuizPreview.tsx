// src/Kambaz/Courses/Quizzes/QuizPreview.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQuizById } from "./api/quizzesApi";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const isFaculty = ["FACULTY", "ADMIN"].includes(currentUser?.role);

  // ✅ 所有 hooks 顶层无条件调用
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!qid) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getQuizById(qid);
        setQuiz(data.quiz);
        setQuestions(data.questions || []);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  const totalPoints = useMemo(
    () => (questions || []).reduce((s: number, q: any) => s + (q.points || 0), 0),
    [questions]
  );

  const score = useMemo(() => {
    if (!submitted) return 0;
    let sum = 0;
    for (const q of questions || []) {
      const a = answers[q._id];
      if (!a) continue;
      if (q.type === "MC" && typeof a.index === "number" && a.index === q.correctIndex) {
        sum += q.points || 0;
      }
      if (q.type === "TF" && typeof a.value === "boolean" && a.value === !!q.correctBoolean) {
        sum += q.points || 0;
      }
      if (q.type === "FIB") {
        const correct = (q.correctTexts || [])
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean);
        const given = (a.texts || [])
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean);
        if (correct.length && given.length && given.every((t: string) => correct.includes(t))) {
          sum += q.points || 0;
        }
      }
    }
    return sum;
  }, [submitted, answers, questions]);

  function setAns(q: any, v: any) {
    setAnswers((prev) => ({ ...prev, [q._id]: v }));
  }

  // ✅ 把“早退/权限/加载错误”放到渲染分支
  if (!isFaculty) {
    return <div className="p-3 text-danger">Faculty only.</div>;
  }
  if (loading) {
    return <div className="p-3">Loading…</div>;
  }
  if (err) {
    return <div className="p-3 text-danger">{err}</div>;
  }
  if (!quiz) return null;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">{quiz.title} (Preview)</h2>
        <div>
          <Link
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`}
            className="btn btn-outline-secondary me-2"
          >
            Keep Editing This Quiz
          </Link>
          {!submitted ? (
            <button className="btn btn-danger" onClick={() => setSubmitted(true)}>
              Submit Quiz
            </button>
          ) : (
            <span className="badge text-bg-success fs-6">
              Score: {score} / {totalPoints}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 text-muted">
        This is a preview; your answers are <b>not stored</b>.
      </div>

      <hr />
      <ol className="mt-3">
        {(questions || []).map((q: any, idx: number) => (
          <li key={q._id || idx} className="mb-4">
            <div className="mb-1">
              <b>{q.title || `Question ${idx + 1}`}</b>{" "}
              <span className="text-muted">({q.points || 0} pts)</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: q.prompt || "" }} className="mb-2" />

            {q.type === "MC" &&
              (q.options || q.choices || []).map((opt: string, i: number) => (
                <div className="form-check" key={i}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`mc-${q._id || idx}`}
                    id={`mc-${q._id || idx}-${i}`}
                    checked={answers[q._id]?.index === i}
                    onChange={() => setAns(q, { type: "MC", index: i })}
                  />
                  <label className="form-check-label" htmlFor={`mc-${q._id || idx}-${i}`}>
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
                    name={`tf-${q._id || idx}`}
                    id={`tf-${q._id || idx}-t`}
                    checked={answers[q._id]?.value === true}
                    onChange={() => setAns(q, { type: "TF", value: true })}
                  />
                  <label className="form-check-label" htmlFor={`tf-${q._id || idx}-t`}>
                    True
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`tf-${q._id || idx}`}
                    id={`tf-${q._id || idx}-f`}
                    checked={answers[q._id]?.value === false}
                    onChange={() => setAns(q, { type: "TF", value: false })}
                  />
                  <label className="form-check-label" htmlFor={`tf-${q._id || idx}-f`}>
                    False
                  </label>
                </div>
              </div>
            )}

            {q.type === "FIB" && (
              <textarea
                className="form-control"
                rows={2}
                placeholder="Enter all acceptable answers, one per line"
                value={(answers[q._id]?.texts || []).join("\n")}
                onChange={(e) =>
                  setAns(q, {
                    type: "FIB",
                    texts: e.target.value
                      .split(/\n|;/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            )}

            {submitted && (
              <div className="mt-2">
                <span
                  className={
                    (q.type === "MC" &&
                      answers[q._id]?.index === q.correctIndex) ||
                    (q.type === "TF" &&
                      answers[q._id]?.value === !!q.correctBoolean) ||
                    (q.type === "FIB" &&
                      (answers[q._id]?.texts || []).every((t: string) =>
                        (q.correctTexts || [])
                          .map((x: string) => x.toLowerCase().trim())
                          .includes(t.toLowerCase().trim())
                      ))
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {(q.type === "MC" &&
                    answers[q._id]?.index === q.correctIndex) ||
                  (q.type === "TF" &&
                    answers[q._id]?.value === !!q.correctBoolean) ||
                  (q.type === "FIB" &&
                    (answers[q._id]?.texts || []).every((t: string) =>
                      (q.correctTexts || [])
                        .map((x: string) => x.toLowerCase().trim())
                        .includes(t.toLowerCase().trim())
                    ))
                    ? "Correct"
                    : "Incorrect"}
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
