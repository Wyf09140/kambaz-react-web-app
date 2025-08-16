// src/Kambaz/Courses/Quizzes/Teacher/QuestionsEditor.tsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getQuizById,
  addQuestion,
  updateQuestionById,
  deleteQuestionById,
} from "../api/quizzesApi";

type QType = "MC" | "TF" | "FIB";
type Question = {
  _id?: string;
  type: QType;
  title?: string;
  prompt: string;
  points: number;
  order: number;
  // MC
  choices?: string[];
  correctIndex?: number;
  // TF
  correctBoolean?: boolean;
  // FIB
  correctTexts?: string[];
};

export default function QuestionsEditor() {
  const { cid, qid } = useParams();
  const nav = useNavigate();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const role = currentUser?.role as string | undefined;
  const isFaculty = role === "FACULTY" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [focusId, setFocusId] = useState<string | null>(null);

  const totalPoints = useMemo(
    () => questions.reduce((s, q) => s + Number(q.points || 0), 0),
    [questions]
  );

  // ---------- helpers ----------
  function normalizeType(t: any): QType {
    const s = String(t ?? "").toUpperCase().replace(/\s|-/g, "");
    if (s === "MC" || s === "MULTIPLECHOICE") return "MC";
    if (s === "TF" || s === "TRUEFALSE") return "TF";
    if (s === "FIB" || s === "FILLINTHEBLANK") return "FIB";
    return "MC";
  }

  const patch = (i: number, p: Partial<Question>) =>
    setQuestions((arr) => arr.map((x, idx) => (idx === i ? { ...x, ...p } : x)));

  function toggleEdit(id?: string, flag = true) {
    if (!id) return;
    setEditing((m) => ({ ...m, [id]: flag }));
  }

  /** 规范化：prompt 必填；MC 至少 2 项并修正 correctIndex；FIB 拍平答案 */
  function ensureValidForCreateOrUpdate(q: Question): Question {
    const copy: Question = { ...q };

    // 1) prompt
    if (!copy.prompt || !copy.prompt.trim()) {
      copy.prompt = copy.title?.trim() || "Your question here…";
    }

    // 2) MC
    if (copy.type === "MC") {
      const arr = (copy.choices || []).map((s) => (s ?? "").toString().trim());
      const filtered = arr.filter(Boolean);
      while (filtered.length < 2) filtered.push(`Option ${filtered.length + 1}`);
      copy.choices = filtered;
      const ci = typeof copy.correctIndex === "number" ? copy.correctIndex! : 0;
      copy.correctIndex = Math.min(Math.max(ci, 0), filtered.length - 1);
      // 清理其它类型的字段
      copy.correctBoolean = undefined;
      copy.correctTexts = undefined;
    }

    // 3) TF
    if (copy.type === "TF") {
      if (typeof copy.correctBoolean !== "boolean") copy.correctBoolean = true;
      // 清理其它类型的字段
      copy.choices = undefined;
      copy.correctIndex = undefined;
      copy.correctTexts = undefined;
    }

    // 4) FIB
    if (copy.type === "FIB") {
      copy.correctTexts = (copy.correctTexts || [])
        .join("\n")
        .split(/\n|;/)
        .map((s) => s.trim())
        .filter(Boolean);
      // 清理其它类型的字段
      copy.choices = undefined;
      copy.correctIndex = undefined;
      copy.correctBoolean = undefined;
    }

    return copy;
  }

  /** 转后端 payload：只保留该题型需要的字段（MC 用 options） */
  function normalizeForServer(q: Question) {
    const base = {
      type: q.type,
      title: q.title || "",
      prompt: q.prompt || "",
      points: Number(q.points || 0),
      order: Number(q.order || 0),
    };

    if (q.type === "MC") {
      return {
        ...base,
        options: (q.choices || []).map(String),
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      };
    }
    if (q.type === "TF") {
      return { ...base, correctBoolean: !!q.correctBoolean };
    }
    // FIB
    return { ...base, correctTexts: (q.correctTexts || []).map(String) };
  }

  // ---------- data load ----------
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  async function load() {
    if (!qid) return;
    setLoading(true);
    setErr(null);
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
        correctIndex:
          typeof q.correctIndex === "number" ? q.correctIndex : 0,
        correctBoolean: typeof q.correctBoolean === "boolean" ? q.correctBoolean : undefined,
        correctTexts: (q.correctTexts || []).map((s: any) => String(s)),
      }));
      list.sort(
        (a, b) =>
          a.order - b.order || (a._id || "").localeCompare(b._id || "")
      );
      setQuestions(list);

      if (focusId) {
        setEditing({ [focusId]: true });
        setFocusId(null);
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  // ---------- actions ----------
  async function onAdd() {
    if (!qid) return;
    if (!isFaculty) {
      setErr("Faculty only");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const draft: Question = {
        type: "MC",
        title: "New Question",
        prompt: "Your question here…",
        points: 1,
        order:
          questions.length ? Math.max(...questions.map((x) => x.order)) + 1 : 1,
        choices: ["Option 1", "Option 2"],
        correctIndex: 0,
      };
      const safe = ensureValidForCreateOrUpdate(draft);
      const { data } = await addQuestion(qid!, normalizeForServer(safe));
      if (data && data._id) setFocusId(String(data._id));
      await load();
      if (!data?._id && questions.length) {
        const last = questions[questions.length - 1];
        if (last._id) toggleEdit(last._id, true);
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  }

  async function onUpdateOne(q: Question) {
    if (!q._id) return;
    if (!isFaculty) {
      setErr("Faculty only");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const safe = ensureValidForCreateOrUpdate(q);
      await updateQuestionById(q._id, normalizeForServer(safe));
      toggleEdit(q._id, false);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to update question");
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteOne(id?: string) {
    if (!id) return;
    if (!isFaculty) {
      setErr("Faculty only");
      return;
    }
    if (!confirm("Delete this question?")) return;
    setLoading(true);
    setErr(null);
    try {
      await deleteQuestionById(id);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to delete question");
    } finally {
      setLoading(false);
    }
  }

  async function onSaveAll() {
    if (!isFaculty) {
      setErr("Faculty only");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      for (const q of questions) {
        if (!q._id) continue;
        const safe = ensureValidForCreateOrUpdate(q);
        await updateQuestionById(q._id, normalizeForServer(safe));
      }
      nav(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const onCancelAll = () =>
    nav(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);

  // ---------- UI ----------
  return (
    <div className="p-3">
      {/* Tabs + Points */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="nav nav-tabs">
          <NavLink
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`}
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "")
            }
          >
            Details
          </NavLink>
        <NavLink
            to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/questions`}
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "")
            }
          >
            Questions
          </NavLink>
        </div>
        <div className="text-muted">
          Points <b>{totalPoints}</b>
        </div>
      </div>

      <hr className="mt-2" />

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="fw-semibold fs-5">{quizTitle || "Untitled Quiz"}</div>
        <button
          className="btn btn-outline-secondary"
          onClick={onAdd}
          disabled={!isFaculty || loading}
          title={isFaculty ? "" : "Faculty only"}
        >
          + New Question
        </button>
      </div>

      {loading && <div className="mt-3">Working…</div>}
      {err && <div className="mt-3 text-danger">{err}</div>}

      <ul className="list-group mt-3">
        {questions.length === 0 ? (
          <li className="list-group-item">
            List is empty. Click <b>+ New Question</b> to add one.
          </li>
        ) : (
          questions.map((q, i) => {
            const isEditingRow = q._id ? !!editing[q._id] : true;
            return (
              <li key={q._id || `tmp-${i}`} className="list-group-item">
                {/* header row */}
                <div className="d-flex gap-2 align-items-center mb-2">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Title"
                    style={{ maxWidth: 280 }}
                    value={q.title || ""}
                    onChange={(e) => patch(i, { title: e.target.value })}
                  />
                  <select
                    className="form-select form-select-sm"
                    style={{ maxWidth: 200 }}
                    value={q.type}
                    onChange={(e) => {
                      const next = normalizeType(e.target.value);
                      if (next === "TF") {
                        patch(i, {
                          type: "TF",
                          correctBoolean: true,
                          choices: undefined,
                          correctIndex: undefined,
                          correctTexts: undefined,
                        });
                      } else if (next === "MC") {
                        patch(i, {
                          type: "MC",
                          choices:
                            (q.choices && q.choices.length >= 2
                              ? q.choices
                              : ["Option 1", "Option 2"]),
                          correctIndex:
                            typeof q.correctIndex === "number"
                              ? q.correctIndex
                              : 0,
                          correctBoolean: undefined,
                          correctTexts: undefined,
                        });
                      } else {
                        // FIB
                        patch(i, {
                          type: "FIB",
                          correctTexts:
                            (q.correctTexts && q.correctTexts.length > 0
                              ? q.correctTexts
                              : [""]),
                          choices: undefined,
                          correctIndex: undefined,
                          correctBoolean: undefined,
                        });
                      }
                    }}
                  >
                    <option value="MC">Multiple Choice</option>
                    <option value="TF">True/False</option>
                    <option value="FIB">Fill in the Blank</option>
                  </select>

                  <div className="ms-auto d-flex align-items-center gap-2">
                    <span className="small text-muted">pts:</span>
                    <input
                      type="number"
                      min={0}
                      className="form-control form-control-sm"
                      style={{ width: 90 }}
                      value={q.points}
                      onChange={(e) =>
                        patch(i, { points: Number(e.target.value) })
                      }
                    />

                    {q._id && (
                      <>
                        {!isEditingRow ? (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={!isFaculty}
                            onClick={() => toggleEdit(q._id, true)}
                          >
                            Edit
                          </button>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-secondary"
                              disabled={!isFaculty}
                              onClick={() => onUpdateOne(q)}
                            >
                              Update Question
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={load}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={!isFaculty}
                          onClick={() => onDeleteOne(q._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* prompt */}
                <div className="mb-2">
                  <div className="small text-muted">Question</div>
                  <textarea
                    className="form-control form-control-sm"
                    rows={3}
                    placeholder="Enter your question (HTML ok)"
                    value={q.prompt}
                    onChange={(e) => patch(i, { prompt: e.target.value })}
                  />
                </div>

                {/* type specific */}
                {q.type === "MC" && (
                  <div>
                    <div className="small text-muted mb-1">Answers</div>
                    {(q.choices || []).map((c, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center gap-2 mb-1"
                      >
                        <input
                          type="radio"
                          className="form-check-input"
                          name={`mc-${q._id || i}`}
                          checked={q.correctIndex === idx}
                          onChange={() => patch(i, { correctIndex: idx })}
                        />
                        <input
                          className="form-control form-control-sm"
                          value={c}
                          onChange={(e) => {
                            const copy = [...(q.choices || [])];
                            copy[idx] = e.target.value;
                            patch(i, { choices: copy });
                          }}
                        />
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled={!isFaculty}
                          onClick={() => {
                            const copy = [...(q.choices || [])];
                            copy.splice(idx + 1, 0, "New option");
                            patch(i, { choices: copy });
                          }}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={!isFaculty}
                          onClick={() => {
                            const copy = [...(q.choices || [])];
                            copy.splice(idx, 1);
                            patch(i, {
                              choices: copy,
                              correctIndex:
                                (q.correctIndex ?? 0) >= copy.length
                                  ? 0
                                  : q.correctIndex,
                            });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(!q.choices || q.choices.length === 0) && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={!isFaculty}
                        onClick={() =>
                          patch(i, { choices: ["Option 1", "Option 2"] })
                        }
                      >
                        Add choices
                      </button>
                    )}
                  </div>
                )}

                {q.type === "TF" && (
                  <div className="d-flex align-items-center gap-3">
                    <span className="small text-muted">Correct:</span>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`tf-${q._id || i}`}
                        checked={q.correctBoolean === true}
                        onChange={() => patch(i, { correctBoolean: true })}
                      />
                      <label className="form-check-label">True</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`tf-${q._id || i}`}
                        checked={q.correctBoolean === false}
                        onChange={() => patch(i, { correctBoolean: false })}
                      />
                      <label className="form-check-label">False</label>
                    </div>
                  </div>
                )}

                {q.type === "FIB" && (
                  <div>
                    <div className="small text-muted mb-1">
                      Correct answers (one per line or “;” separated)
                    </div>
                    <textarea
                      className="form-control form-control-sm"
                      rows={3}
                      value={(q.correctTexts || []).join("\n")}
                      onChange={(e) => {
                        const arr = e.target.value
                          .split(/\n|;/)
                          .map((s) => s.trim());
                        patch(i, { correctTexts: arr });
                      }}
                    />
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>

      {/* Footer */}
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-outline-secondary" onClick={onCancelAll}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onSaveAll} disabled={!isFaculty}>
          Save
        </button>
      </div>
    </div>
  );
}
