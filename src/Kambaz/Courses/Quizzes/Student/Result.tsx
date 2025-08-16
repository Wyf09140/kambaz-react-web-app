// src/Kambaz/Courses/Quizzes/Student/Result.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyAttempt, getQuizById } from "../api/quizzesApi";

type Role = "STUDENT" | "FACULTY" | "ADMIN" | string;

type QuizDoc = {
  _id: string;
  title: string;
  description?: string;
  points: number;
  scoring?: {
    showCorrectAnswers?: boolean;
  };
};

type QuestionDoc = {
  _id: string;
  type: "MC" | "TF" | "FIB";
  title?: string;
  prompt: string;
  points: number;
  // MC
  options?: string[];
  choices?: string[];
  correctIndex?: number;
  // TF
  correctBoolean?: boolean;
  // FIB
  correctTexts?: string[];
};

type AttemptDoc = {
  _id: string;
  quizId: string;
  userId: string;
  status: "IN_PROGRESS" | "SUBMITTED";
  totalAutoScore: number;
  totalPoints: number;
  responses: Array<{
    questionId: string;
    answer: { mc?: number; tf?: boolean; fib?: string | string[] };
    autoScore?: number;
  }>;
};

export default function Result() {
  const { cid, qid } = useParams();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const role: Role | undefined = currentUser?.role;
  const isStudent = role === "STUDENT";

  const [quiz, setQuiz] = useState<QuizDoc | null>(null);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [attempt, setAttempt] = useState<AttemptDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const showCorrect = !!quiz?.scoring?.showCorrectAnswers;

  const qmap = useMemo(() => {
    const m = new Map<string, QuestionDoc>();
    for (const q of questions) m.set(String(q._id), q);
    return m;
  }, [questions]);

  const totalPoints = useMemo(
    () => questions.reduce((s, q) => s + Number(q.points || 0), 0),
    [questions]
  );

  useEffect(() => {
    if (!qid) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [{ data: quizData }, { data: attemptData }] = await Promise.all([
          getQuizById(qid),
          getMyAttempt(qid),
        ]);
        setQuiz(quizData.quiz);
        setQuestions(quizData.questions || []);
        setAttempt(attemptData || null);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  if (!isStudent) return <div className="p-3 text-danger">Students only.</div>;
  if (loading) return <div className="p-3">Loading…</div>;
  if (err) return <div className="p-3 text-danger">{err}</div>;
  if (!quiz) return null;

  const score = attempt?.totalAutoScore ?? 0;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">{quiz.title} — Result</h2>
        <span className="badge text-bg-success fs-6">
          Score: {score} / {attempt?.totalPoints ?? totalPoints}
        </span>
      </div>

      {!attempt && (
        <div className="alert alert-secondary mt-3">
          You don’t have a submitted attempt yet.
        </div>
      )}

      {attempt && (
        <div className="mt-3">
          {!showCorrect ? (
            <div className="alert alert-info">
              Correct answers are hidden by instructor.
            </div>
          ) : null}

          {/* 题目回顾（若允许显示正确答案才展示逐题详情） */}
          {showCorrect && (
            <>
              <h5 className="mt-3 mb-2">Review</h5>
              <ol className="list-group list-group-numbered">
                {attempt.responses.map((r, i) => {
                  const q = qmap.get(String(r.questionId));
                  if (!q) return null;
                  const earned = r.autoScore ?? 0;
                  const maxPts = q.points || 0;

                  const your = r.answer;
                  let yourDisplay = "";
                  let correctDisplay = "";
                  let isCorrect = false;

                  if (q.type === "MC") {
                    const opts = q.options ?? q.choices ?? [];
                    const yi = typeof your?.mc === "number" ? your.mc : -1;
                    const ci =
                      typeof q.correctIndex === "number" ? q.correctIndex : -1;
                    yourDisplay = yi >= 0 && yi < opts.length ? opts[yi] : "—";
                    correctDisplay = ci >= 0 && ci < opts.length ? opts[ci] : "—";
                    isCorrect = yi === ci;
                  } else if (q.type === "TF") {
                    const yb =
                      typeof your?.tf === "boolean" ? your.tf : undefined;
                    yourDisplay =
                      typeof yb === "boolean" ? (yb ? "True" : "False") : "—";
                    correctDisplay =
                      typeof q.correctBoolean === "boolean"
                        ? q.correctBoolean
                          ? "True"
                          : "False"
                        : "—";
                    isCorrect =
                      typeof yb === "boolean" &&
                      typeof q.correctBoolean === "boolean" &&
                      yb === q.correctBoolean;
                  } else if (q.type === "FIB") {
                    const ys = Array.isArray(your?.fib)
                      ? your.fib
                      : typeof your?.fib === "string"
                      ? [your.fib]
                      : [];
                    yourDisplay = ys.length ? ys.join("; ") : "—";
                    correctDisplay = (q.correctTexts || []).join("; ");
                    // 评分已在后端做，这里只根据得分判断
                    isCorrect = earned >= maxPts;
                  }

                  return (
                    <li key={i} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <div>
                          <b>{q.title || `Question ${i + 1}`}</b>{" "}
                          <span className="text-muted">({maxPts} pts)</span>
                        </div>
                        <div>
                          {isCorrect ? (
                            <span className="badge text-bg-success">Correct</span>
                          ) : (
                            <span className="badge text-bg-danger">Incorrect</span>
                          )}{" "}
                          <span className="text-muted ms-2">
                            +{earned}/{maxPts}
                          </span>
                        </div>
                      </div>
                      <div
                        className="mt-1"
                        dangerouslySetInnerHTML={{ __html: q.prompt }}
                      />
                      <div className="mt-2 small">
                        <div>
                          <span className="text-muted">Your answer: </span>
                          <span>{yourDisplay}</span>
                        </div>
                        <div>
                          <span className="text-muted">Correct answer: </span>
                          <span>{correctDisplay}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </div>
      )}

      <div className="mt-4">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>
          &larr; Back to Quiz Details
        </Link>
      </div>
    </div>
  );
}
