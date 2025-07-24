import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import { Form, Button, Row, Col } from "react-bootstrap";
import React from "react";

export default function AssignmentEditor() {
  const { cid: courseId, aid: assignmentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNew = assignmentId === "new";

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const assignments = useSelector((state: any) => state.assignmentsReducer);
  const assignment = assignments.find((a: any) => a._id === assignmentId);

  // ✅ 如果不是教师，重定向
  if (currentUser?.role !== "FACULTY") {
    return <Navigate to={`/Kambaz/Courses/${courseId}/Assignments`} replace />;
  }

  const defaultAssignment = {
    _id: new Date().getTime().toString(),
    title: "",
    description: "",
    points: 100,
    dueDate: "2024-05-14T23:59",
    availableFromDate: "2024-05-06T00:00",
    untilDate: "2024-05-20T23:59",
    course: courseId,
  };

  const current = assignment || defaultAssignment;
  const [title, setTitle] = React.useState(current.title);
  const [description, setDescription] = React.useState(current.description);
  const [points, setPoints] = React.useState(current.points);
  const [dueDate, setDueDate] = React.useState(current.dueDate);
  const [availableFromDate, setAvailableFromDate] = React.useState(current.availableFromDate);
  const [untilDate, setUntilDate] = React.useState(current.untilDate);

  const handleSave = () => {
    const updated = {
      ...current,
      title,
      description,
      points,
      dueDate,
      availableFromDate,
      untilDate,
    };
    isNew ? dispatch(addAssignment(updated)) : dispatch(updateAssignment(updated));
    navigate(`/Kambaz/Courses/${courseId}/Assignments`);
  };

  return (
    <div className="container">
      <h4>{isNew ? "Create" : "Edit"} Assignment</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Points</Form.Label>
          <Form.Control type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
        </Form.Group>
        <Row className="mb-3">
          <Col>
            <Form.Label>Due Date</Form.Label>
            <Form.Control type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Col>
          <Col>
            <Form.Label>Available From</Form.Label>
            <Form.Control type="datetime-local" value={availableFromDate} onChange={(e) => setAvailableFromDate(e.target.value)} />
          </Col>
          <Col>
            <Form.Label>Until</Form.Label>
            <Form.Control type="datetime-local" value={untilDate} onChange={(e) => setUntilDate(e.target.value)} />
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="danger" onClick={handleSave}>Save</Button>
        </div>
      </Form>
    </div>
  );
}
