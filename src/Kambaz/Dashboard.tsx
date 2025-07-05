import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1234/Home"
                className="wd-dashboarsd-course-link" >
            <img src="/images/reactjs.jpg" width={200} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">CS 5100 Foundations of Artificial Intelligence </div>
        <div className="wd-dashboard-course">CS 5180 Reinforcement Learning and Sequential Decision Making </div>
        <div className="wd-dashboard-course">CS 5330 Pattern Recognition and Computer Vision </div>
        <div className="wd-dashboard-course">CS 5340 Computer/Human Interaction </div>
        <div className="wd-dashboard-course">CS 5610 Web Development </div>
        <div className="wd-dashboard-course">CS 6120 Natural Language Processing </div>
        <div className="wd-dashboard-course">CS 6200 Information Retrieval </div>

      </div>
    </div>
);}

