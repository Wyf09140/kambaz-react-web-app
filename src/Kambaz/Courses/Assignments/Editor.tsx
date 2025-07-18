import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database"; // <--- 确保 Database 模块已正确设置 index.ts/js

export default function AssignmentEditor() {
  const { courseId, assignmentId } = useParams(); // 获取路由参数中的 courseId 和 assignmentId

  // 假设 assignments 数据也存在于 Database 模块中，或者您需要从别处获取
  // 为了示例，我们先模拟一个空的 assignment 对象
  const assignment = assignmentId ? db.assignments?.find((a: any) => a._id === assignmentId) : null;

  // 如果 assignmentId 存在但未找到对应的 assignment，可以处理这种情况
  // 这里简化处理，直接使用一个默认值
  const currentAssignment = assignment || {
    _id: "New Assignment",
    title: "New Assignment",
    description: "This is a new assignment.",
    points: 100,
    due_date: "2024-05-14T23:59:00", // 示例日期时间格式
    available_from_date: "2024-05-06T00:00:00",
    available_until_date: "2024-05-20T23:59:00",
    course: courseId, // 将当前课程ID关联到新作业
  };

  // 假设您还需要状态来管理表单输入
  const [assignmentTitle, setAssignmentTitle] = React.useState(currentAssignment.title);
  const [assignmentDescription, setAssignmentDescription] = React.useState(currentAssignment.description);
  const [assignmentPoints, setAssignmentPoints] = React.useState(currentAssignment.points);
  const [assignmentDueDate, setAssignmentDueDate] = React.useState(currentAssignment.due_date);
  const [assignmentAvailableFromDate, setAssignmentAvailableFromDate] = React.useState(currentAssignment.available_from_date);
  const [assignmentAvailableUntilDate, setAssignmentAvailableUntilDate] = React.useState(currentAssignment.available_until_date);


  const handleSave = () => {
    // 这里可以添加保存作业的逻辑，例如更新 db.assignments 或发送 API 请求
    console.log("Saving Assignment:", {
      ...currentAssignment,
      title: assignmentTitle,
      description: assignmentDescription,
      points: assignmentPoints,
      due_date: assignmentDueDate,
      available_from_date: assignmentAvailableFromDate,
      available_until_date: assignmentAvailableUntilDate,
    });
    // 保存后通常会导航回作业列表页面
    // 例如：navigate(`/Kanbas/Courses/${courseId}/Assignments`);
  };

  const handleCancel = () => {
    // 导航回作业列表页面
    // 例如：navigate(`/Kanbas/Courses/${courseId}/Assignments`);
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
            {/* 这里通常是下拉选择框，列出学生或组 */}
            <Form.Control as="select">
              <option>Everyone</option>
              {/* 根据 db.users 或其他数据动态生成选项 */}
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