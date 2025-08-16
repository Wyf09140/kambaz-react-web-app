import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAttemptById } from "../api/quizzesApi";

type QType = "MC" | "TF" | "FIB";

type Question = {
  _id: string;
  type: QType;
  title?: string;
  prompt: string;
  points: number;
  options?: string[];
  correctIndex?: number;
  correctBoolean?: boolean;
  correctTexts?: string[];
};

type Attempt = {
  _id: string;
  quizId: string;
  totalPoints: number;
  totalAutoScore: number;
  responses: Array<{
    questionId: string;
    answer: { mc?: number; tf?: boolean; fib?: string };
    autoScore?: number;
  }>;
};

export default function QuizResult() {
  const { cid, qid, aid } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    (async () => {
      if (!aid) return;
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getAttemptById(aid);
        setAttempt(data.attempt);
        setQuestions(
          (data.questions || []).map((q: any) => ({
            _id: q._id,
            type: q.type,
            title: q.title || "",
            prompt: q.prompt || "",
            points: Number(q.points || 0),
            options: q.options || q.choices || [],
            correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : undefined,
            correctBoolean: typeof q.correctBoolean === "boolean" ? q.correctBoolean : undefined,
            correctTexts: q.correctTexts || [],
          }))
        );
        setQuizTitle(data.quiz?.title || "");
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    })();
  }, [aid]);

  const respMap = useMemo(() => {
    const m = new Map<string, Attempt["responses"][number]>();
    (attempt?.responses || []).forEach((r) => m.set(String(r.questionId), r));
    return m;
  }, [attempt]);

  if (loading) return <div className="p-3">Loading…</div>;
  if (err) return <div className="p-3 text-danger">{err}</div>;
  if (!attempt) return null;

  const total = attempt.totalPoints || 0;
  const score = attempt.totalAutoScore || 0;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="m-0">{quizTitle || "Quiz Result"}</h3>
        <span className="badge text-bg-success fs-6">Score: {score} / {total}</span>
      </div>
      <hr />

      <ol className="list-group list-group-numbered">
        {questions.map((q) => {
          const r = respMap.get(String(q._id));
          const awarded = r?.autoScore ?? 0;

          const your =
            q.type === "MC"
              ? (typeof r?.answer?.mc === "number" ? q.options?.[r!.answer!.mc!] : undefined)
              : q.type === "TF"
              ? (r?.answer?.tf === true ? "True" : r?.answer?.tf === false ? "False" : undefined)
              : q.type === "FIB"
              ? r?.answer?.fib
              : undefined;

          const correct =
            q.type === "MC"
              ? (typeof q.correctIndex === "number" ? q.options?.[q.correctIndex] : undefined)
              : q.type === "TF"
              ? (q.correctBoolean === true ? "True" : q.correctBoolean === false ? "False" : undefined)
              : q.type === "FIB"
              ? (q.correctTexts || []).join(", ")
              : undefined;

          const isFull = awarded >= (q.points || 0);

          return (
            <li key={q._id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="fw-semibold">{q.title || q.type}</div>
                  <div className="text-muted" dangerouslySetInnerHTML={{ __html: q.prompt }} />
                </div>
                <div className={isFull ? "text-success" : "text-danger"}>
                  {awarded} / {q.points}
                </div>
              </div>
              <div className="mt-2">
                <div><b>Your answer:</b> {String(your ?? "—")}</div>
                <div><b>Correct answer:</b> {String(correct ?? "—")}</div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-3">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>&larr; Back to Details</Link>
      </div>
    </div>
  );
}
