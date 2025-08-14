// src/Kambaz/Courses/Assignments/Editor.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as client from "./client";

/** 将 ISO 或可解析时间转为 <input type="datetime-local"> 需要的本地格式 */
function toLocalInput(value?: string | Date | null) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  // 本地时区 yyyy-MM-ddTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function AssignmentEditor() {
  const { cid: courseId, aid } = useParams();
  const navigate = useNavigate();
  const isNew = !aid || aid === "new";

  const { currentUser } = useSelector((s: any) => s.accountReducer);
  if (currentUser?.role !== "FACULTY") {
    return <Navigate to={`/Kambaz/Courses/${courseId}/Assignments`} replace />;
  }

  const [loading, setLoading] = useState<boolean>(!isNew);
  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    points: 100,
    // 用 datetime-local 控件
    dueDate: "",
    availableFromDate: "",
    untilDate: "",
  });

  // 编辑态：加载作业详情
  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      if (isNew) {
        setLoading(false);
        return;
      }
      try {
        const a = await client.findAssignmentById(aid!);
        setForm({
          title: a?.title ?? "",
          description: a?.description ?? "",
          points: a?.points ?? 100,
          dueDate: toLocalInput(a?.dueDate),
          availableFromDate: toLocalInput(a?.availableFromDate),
          untilDate: toLocalInput(a?.untilDate),
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, aid, isNew]);

  const onChange = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const onSave = async () => {
    if (!courseId) return;
    setSaving(true);
    try {
      if (isNew) {
        await client.createAssignment(courseId, {
          ...form,
          course: courseId,
        });
      } else {
        await client.updateAssignment(aid!, {
          ...form,
          course: courseId,
        });
      }
      navigate(`/Kambaz/Courses/${courseId}/Assignments`);
    } catch (e) {
      console.error("Save assignment failed:", e);
      alert("Failed to save assignment.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => navigate(`/Kambaz/Courses/${courseId}/Assignments`);

  if (loading) return <div className="p-3 text-muted">Loading...</div>;

  return (
    <div className="container">
      <h4>{isNew ? "Create" : "Edit"} Assignment</h4>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Assignment title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Assignment description"
          />
        </Form.Group>

        <Form.Group className="mb-3" style={{ maxWidth: 240 }}>
          <Form.Label>Points</Form.Label>
          <Form.Control
            type="number"
            value={form.points}
            onChange={(e) => onChange("points", Number(e.target.value))}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.dueDate || ""}
              onChange={(e) => onChange("dueDate", e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label>Available From</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.availableFromDate || ""}
              onChange={(e) => onChange("availableFromDate", e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label>Until</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.untilDate || ""}
              onChange={(e) => onChange("untilDate", e.target.value)}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
