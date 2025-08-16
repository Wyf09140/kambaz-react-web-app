import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getQuizById } from "../api/quizzesApi";

type QType = "MC" | "TF" | "FIB";
type Question = {
  _id: string;
  type: QType;
  title?: string;
  prompt: string;
  points: number;
  order: number;
  choices?: string[];      // MC
  correctIndex?: number;   // MC
  correctBoolean?: boolean;// TF
  correctTexts?: string[]; // FIB
};

type AnswerState = Record<string, number | boolean | string>;

function normalizeType(t: any): QType {
  const s = String(t ?? "").toUpperCase().replace(/\s|-/g, "");
  if (s === "MC" || s === "MULTIPLECHOICE") return "MC";
  if (s === "TF" || s === "TRUEFALSE") return "TF";
  if (s === "FIB" || s === "FILLINTHEBLANK") return "FIB";
  return "MC";
}

export default function TeacherPreview() {
  const { cid, qid } = useParams();
  const nav = useNavigate();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const isFaculty = ["FACULTY", "ADMIN"].includes(currentUser?.role);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!qid) return;
    (async () => {
      setLoading(true); setErr(null);
      try {
        const { data } = await getQuizById(qid);
        setQuizTitle(data.quiz?.title || "");
        const list: Question[] = (data.questions || []).map((q: any) => ({
          _id: q._id,
          type: normalizeType(q.type),
          title: q.title || "",
          prompt: q.prompt || "",
          points: Number(q.points || 0),
          order: Number(q.order || 0),
          choices: q.choices || q.options || [],
          correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
          correctBoolean: typeof q.correctBoolean === "boolean" ? q.correctBoolean : undefined,
          correctTexts: (q.correctTexts || []).map((s: any) => String(s)),
        }));
        list.sort((a,b)=>a.order - b.order || a._id.localeCompare(b._id));
        setQuestions(list);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  const totalPoints = useMemo(
    () => questions.reduce((s, q) => s + Number(q.points || 0), 0),
    [questions]
  );

  const { score, detail } = useMemo(() => {
    let s = 0;
    const det = questions.map((q) => {
      const ans = answers[q._id];
      let correct = false;
      if (q.type === "MC") correct = typeof ans === "number" && ans === q.correctIndex;
      if (q.type === "TF") correct = typeof ans === "boolean" && ans === q.correctBoolean;
      if (q.type === "FIB") {
        const given = String(ans ?? "").trim().toLowerCase();
        const set = new Set((q.correctTexts || []).map((t) => String(t).trim().toLowerCase()).filter(Boolean));
        correct = given.length > 0 && set.has(given);
      }
      if (correct) s += Number(q.points || 0);
      return { qid: q._id, correct, pts: correct ? Number(q.points || 0) : 0 };
    });
    return { score: s, detail: det };
  }, [answers, questions]);

  function setAns(qid: string, v: number | boolean | string) {
    setAnswers((a) => ({ ...a, [qid]: v }));
  }

  if (!isFaculty) {
    return (
      <div className="p-3 text-danger">
        Faculty only.
        <div className="mt-2"><Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>Back</Link></div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">Preview — {quizTitle || "Untitled Quiz"}</h2>
        <div className="text-muted">Total Points: <b>{totalPoints}</b></div>
      </div>

      {loading && <div className="mt-3">Loading…</div>}
      {err && <div className="mt-3 text-danger">{err}</div>}

      {!loading && questions.length === 0 && (
        <div className="alert alert-secondary mt-3">
          No questions yet. Go to Questions editor to add some.
        </div>
      )}

      <ol className="mt-3">
        {questions.map((q, idx) => {
          const res = detail.find((d) => d.qid === q._id);
          const correct = submitted ? res?.correct : undefined;
          return (
            <li key={q._id} className="mb-4">
              <div className="d-flex align-items-center gap-2">
                <h5 className="m-0">{q.title || `Question ${idx + 1}`}</h5>
                <span className="badge text-bg-light">{q.points} pts</span>
                {submitted && correct === true && <span className="badge text-bg-success">Correct</span>}
                {submitted && correct === false && <span className="badge text-bg-danger">Incorrect</span>}
              </div>

              <div className="mt-1" dangerouslySetInnerHTML={{ __html: q.prompt }} />

              {/* Controls */}
              {q.type === "MC" && (
                <div className="mt-2">
                  {(q.choices || []).map((c, i) => (
                    <div key={i} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`mc-${q._id}`}
                        checked={answers[q._id] === i}
                        onChange={() => setAns(q._id, i)}
                        disabled={submitted}
                      />
                      <label className="form-check-label">{c}</label>
                    </div>
                  ))}
                </div>
              )}

              {q.type === "TF" && (
                <div className="mt-2 d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`tf-${q._id}`}
                      checked={answers[q._id] === true}
                      onChange={() => setAns(q._id, true)}
                      disabled={submitted}
                    />
                    <label className="form-check-label">True</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`tf-${q._id}`}
                      checked={answers[q._id] === false}
                      onChange={() => setAns(q._id, false)}
                      disabled={submitted}
                    />
                    <label className="form-check-label">False</label>
                  </div>
                </div>
              )}

              {q.type === "FIB" && (
                <div className="mt-2" style={{ maxWidth: 420 }}>
                  <input
                    className="form-control"
                    placeholder="Type your answer"
                    value={String(answers[q._id] ?? "")}
                    onChange={(e) => setAns(q._id, e.target.value)}
                    disabled={submitted}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <hr />
      <div className="d-flex align-items-center gap-3">
        {!submitted ? (
          <>
            <button className="btn btn-danger" onClick={() => setSubmitted(true)} disabled={questions.length === 0}>
              Submit (Preview)
            </button>
            <button className="btn btn-outline-secondary" onClick={() => nav(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="fs-6">Score: <b>{score}</b> / {totalPoints}</div>
            <button className="btn btn-outline-secondary" onClick={() => { setAnswers({}); setSubmitted(false); }}>
              Retake (Preview)
            </button>
            <button className="btn btn-secondary" onClick={() => nav(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}>
              Back to Details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
