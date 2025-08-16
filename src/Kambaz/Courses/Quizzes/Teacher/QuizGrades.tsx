import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGradesByQuiz } from "../api/quizzesApi";

export default function QuizGrades() {
  const { cid, qid } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<{
    count: number;
    average: number;
    totalPoints: number;
    histogram: { range: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    (async () => {
      if (!qid) return;
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getGradesByQuiz(qid);
        setData(data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load grades");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  if (loading) return <div className="p-3">Loading…</div>;
  if (err) return <div className="p-3 text-danger">{err}</div>;
  if (!data) return null;

  return (
    <div className="p-3">
      <h3 className="mb-3">Grades</h3>

      <div className="mb-3">
        <b>Submissions:</b> {data.count} &nbsp;·&nbsp;
        <b>Average:</b> {data.average.toFixed(2)} / {data.totalPoints}
      </div>

      <ul className="list-group" style={{ maxWidth: 420 }}>
        {data.histogram.map((b) => (
          <li className="list-group-item d-flex justify-content-between" key={b.range}>
            <span>{b.range}</span>
            <span className="badge text-bg-secondary">{b.count}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}>&larr; Back to Details</Link>
      </div>
    </div>
  );
}
