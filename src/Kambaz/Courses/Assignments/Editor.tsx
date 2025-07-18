import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
  const { courseId, assignmentId } = useParams();

  const assignment = assignmentId
    ? db.assignments?.find((a: any) => a._id === assignmentId)
    : null;

  const currentAssignment = assignment || {
    _id: "New Assignment",
    title: "New Assignment",
    description: "This is a new assignment.",
    points: 100,
    dueDate: "2024-05-14T23:59:00",
    availableFromDate: "2024-05-06T00:00:00",
    untilDate: "2024-05-20T23:59:00",
    course: courseId,
  };

  const [assignmentTitle, setAssignmentTitle] = React.useState(currentAssignment.title);
  const [assignmentDescription, setAssignmentDescription] = React.useState(currentAssignment.description);
  const [assignmentPoints, setAssignmentPoints] = React.useState(currentAssignment.points);
  const [assignmentDueDate, setAssignmentDueDate] = React.useState(currentAssignment.dueDate);
  const [assignmentAvailableFromDate, setAssignmentAvailableFromDate] = React.useState(currentAssignment.availableFromDate);
  const [assignmentAvailableUntilDate, setAssignmentAvailableUntilDate] = React.useState(currentAssignment.untilDate);

  const handleSave = () => {
    console.log("Saving Assignment:", {
      ...currentAssignment,
      title: assignmentTitle,
      description: assignmentDescription,
      points: assignmentPoints,
      dueDate: assignmentDueDate,
      availableFromDate: assignmentAvailableFromDate,
      untilDate: assignmentAvailableUntilDate,
    });
  };

  const handleCancel = () => {
    // navigate back if needed
  };

  return (
    <div className="container-fluid">
      <h3>Assignment Editor</h3>
      <hr />

      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formAssignmentTitle">
          <Form.Label column sm="2">Assignment Title</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              placeholder="Assignment Name"
            />
          </Col>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAssignmentDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
            placeholder="Assignment Description"
          />
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formAssignmentPoints">
          <Form.Label column sm="2">Points</Form.Label>
          <Col sm="10">
            <Form.Control
              type="number"
              value={assignmentPoints}
              onChange={(e) => setAssignmentPoints(Number(e.target.value))}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formAssignTo">
          <Form.Label column sm="2">Assign to</Form.Label>
          <Col sm="10">
            <Form.Control as="select">
              <option>Everyone</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDueDate">
          <Form.Label column sm="2">Due</Form.Label>
          <Col sm="10">
            <Form.Control
              type="datetime-local"
              value={assignmentDueDate}
              onChange={(e) => setAssignmentDueDate(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Row className="mb-3">
          <Form.Label column sm="2">Available from</Form.Label>
          <Col sm="4">
            <Form.Control
              type="datetime-local"
              value={assignmentAvailableFromDate}
              onChange={(e) => setAssignmentAvailableFromDate(e.target.value)}
            />
          </Col>
          <Form.Label column sm="2">Until</Form.Label>
          <Col sm="4">
            <Form.Control
              type="datetime-local"
              value={assignmentAvailableUntilDate}
              onChange={(e) => setAssignmentAvailableUntilDate(e.target.value)}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button variant="light" className="me-2" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
