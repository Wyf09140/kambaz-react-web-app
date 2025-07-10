import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const courses = [
    {
      id: 1234,
      code: "CS1234",
      title: "React JS",
      description: "Full Stack software developer",
      img: "/images/reactjs.jpg"
    },
    {
      id: 5100,
      code: "CS5100",
      title: "Foundations of AI",
      description: "Intro to AI concepts and algorithms",
      img: "/images/course1.jpg"
    },
    {
      id: 5180,
      code: "CS5180",
      title: "Reinforcement Learning",
      description: "Learn how agents make decisions",
      img: "/images/course2.jpg"
    },
    {
      id: 5330,
      code: "CS5330",
      title: "Pattern Recognition",
      description: "From vision to recognition models",
      img: "/images/course3.jpg"
    },
    {
      id: 5340,
      code: "CS5340",
      title: "Human Interaction",
      description: "Explore human-computer interaction",
      img: "/images/course4.jpg"
    },
    {
      id: 6120,
      code: "CS6120",
      title: "Natural Language Processing",
      description: "Understand and process language",
      img: "/images/course5.jpg"
    },
    {
      id: 6200,
      code: "CS6200",
      title: "Information Retrieval",
      description: "Search engines and ranking",
      img: "/images/course6.jpg"
    }
  ];

  return (
    <div id="wd-dashboard" className="p-3" style={{ paddingLeft: "40px", paddingRight: "20px" }}>
  <h1 id="wd-dashboard-title">Dashboard</h1>
  <hr />
  <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
  <hr />
  <div id="wd-dashboard-courses">
    <Row className="g-4" style={{ rowGap: "40px" }}>
      {courses.map(course => (
        <Col key={course.id} style={{ width: "270px", flex: "0 0 auto" }}>
          <Card className="h-100">
            <Link to={`/Kambaz/Courses/${course.id}/Home`} className="text-decoration-none text-dark">
              <Card.Img variant="top" src={course.img} height={160} />
              <Card.Body>
                <Card.Title className="text-nowrap overflow-hidden">{course.code} {course.title}</Card.Title>
                <Card.Text style={{ height: "100px" }} className="overflow-hidden">{course.description}</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
</div>
  );
}