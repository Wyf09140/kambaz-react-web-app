import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  const [name, setName] = useState("A1");
  const [description, setDescription] = useState("The assignment is available online...");
  const [points, setPoints] = useState(100);
  const [group, setGroup] = useState("ASSIGNMENTS");
  const [gradeDisplay, setGradeDisplay] = useState("Percentage");
  const [submissionType, setSubmissionType] = useState("Online");
  const [entryOptions, setEntryOptions] = useState(["Website URL"]);
  const [assignTo, setAssignTo] = useState("Everyone");
  const [dueDate, setDueDate] = useState("2024-05-13T23:59");
  const [availableFrom, setAvailableFrom] = useState("2024-05-06T12:00");
  const [availableUntil, setAvailableUntil] = useState("2024-05-20T12:00");

  const handleCheckboxChange = (option: string) => {
    setEntryOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleSave = () => {
    const data = {
      name, description, points, group,
      gradeDisplay, submissionType, entryOptions,
      assignTo, dueDate, availableFrom, availableUntil,
    };
    console.log("Assignment saved:", data);
    alert("Saved! Check console for data.");
  };

  return (
    <div className="container mt-4" id="wd-assignment-editor">
      <h3 className="mb-4 text-danger fw-bold">Assignment Editor</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4 row">
          <Form.Label className="col-sm-2 fw-bold">Points</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              value={points}
              onChange={e => setPoints(Number(e.target.value))}
            />
          </Col>
        </Form.Group>

        <Form.Group className="mb-4 row">
          <Form.Label className="col-sm-2 fw-bold">Assignment Group</Form.Label>
          <Col sm={10}>
            <Form.Select value={group} onChange={e => setGroup(e.target.value)}>
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
              <option>EXAMS</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group className="mb-4 row">
          <Form.Label className="col-sm-2 fw-bold">Display Grade as</Form.Label>
          <Col sm={10}>
            <Form.Select value={gradeDisplay} onChange={e => setGradeDisplay(e.target.value)}>
              <option>Percentage</option>
              <option>Points</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group className="mb-4 row">
          <Form.Label className="col-sm-2 fw-bold">Submission Type</Form.Label>
          <Col sm={10} className="border rounded p-3 bg-light">
            <Form.Select
              value={submissionType}
              onChange={e => setSubmissionType(e.target.value)}
              className="mb-2"
            >
              <option>Online</option>
              <option>On Paper</option>
              <option>No Submission</option>
            </Form.Select>

            <div className="fw-bold mb-2">Online Entry Options</div>
            {["Text Entry", "Website URL", "Media Recordings", "Student Annotation", "File Uploads"].map(option => (
              <Form.Check
                key={option}
                type="checkbox"
                label={option}
                checked={entryOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
            ))}
          </Col>
        </Form.Group>

        <Form.Group className="mb-4 row">
          <Form.Label className="col-sm-2 fw-bold">Assign</Form.Label>
          <Col sm={10} className="border rounded p-3 bg-light">
            <Form.Label>Assign to</Form.Label>
            <Form.Select
              className="mb-3"
              value={assignTo}
              onChange={e => setAssignTo(e.target.value)}
            >
              <option>Everyone</option>
              <option>Students Only</option>
              <option>TA Only</option>
            </Form.Select>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Due</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Label>Available from</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={availableFrom}
                  onChange={e => setAvailableFrom(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Until</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={availableUntil}
                  onChange={e => setAvailableUntil(e.target.value)}
                />
              </Col>
            </Row>
          </Col>
        </Form.Group>

        <div className="d-flex justify-content-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => alert("Cancelled")}>Cancel</Button>
          <Button variant="danger" onClick={handleSave}>Save</Button>
        </div>
      </Form>
    </div>
  );
}
