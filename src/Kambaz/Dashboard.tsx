import { Card, Button, Row, Col, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
  enrolling,
  setEnrolling,
  updateEnrollment,
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void; // ✅ 修正类型
  updateCourse: () => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void; // 调用后端选/退课
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const enrolledCourseIds: string[] = currentUser?.enrolledCourseIds || [];

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        <button
          onClick={() => setEnrolling(!enrolling)}
          className="float-end btn btn-primary"
        >
          {enrolling ? "My Courses" : "All Courses"}
        </button>
      </h1>

      <hr />

      {currentUser?.role === "FACULTY" && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
            >
              Add
            </button>
            <Button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </Button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            placeholder="Course Name"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            placeholder="Description"
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((c) => (
            <Col
              key={c._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Link
                to={`/Kambaz/Courses/${c._id}/Home`}
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card>
                  <Card.Img
                    src={c.image}
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <Card.Body className="card-body">
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {enrolling && (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            // ✅ 顶部按钮：调用后端更新选课
                            updateEnrollment(c._id, !c.enrolled);
                          }}
                          className={`btn ${
                            c.enrolled ? "btn-danger" : "btn-success"
                          } float-end`}
                        >
                          {c.enrolled ? "Unenroll" : "Enroll"}
                        </button>
                      )}
                      {c.name}
                    </Card.Title>

                    <Card.Text
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {c.description}
                    </Card.Text>

                    {currentUser?.role === "FACULTY" && (
                      <>
                        <Button variant="primary">Go</Button>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(c._id);
                          }}
                          className="btn btn-danger float-end"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(c);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </Button>
                      </>
                    )}

                    {currentUser?.role === "STUDENT" && (
                      <>
                        <Button variant="primary">Go</Button>
                        {enrolledCourseIds.includes(c._id) ? (
                          <Button
                            variant="danger"
                            className="float-end"
                            onClick={(e) => {
                              e.preventDefault();
                              // ✅ 底部按钮：同样走后端
                              updateEnrollment(c._id, false);
                            }}
                          >
                            Unenroll
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            className="float-end"
                            onClick={(e) => {
                              e.preventDefault();
                              // ✅ 底部按钮：同样走后端
                              updateEnrollment(c._id, true);
                            }}
                          >
                            Enroll
                          </Button>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
