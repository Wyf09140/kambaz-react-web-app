import { Link } from "react-router-dom";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments" id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>

      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>
      </h3>

      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link to="a1-env-html" className="wd-assignment-link">
            A1 - ENV + HTML
          </Link>
          <div>
            Multiple Modules |
            <span style={{ fontWeight: "bold" }}> Not available until</span> May 6 at 12:00am |
            <br />
            <span style={{ fontWeight: "bold" }}> Due</span> May 13 at 11:59pm | 100 pts
          </div>
        </li>
        <br />

        <li className="wd-assignment-list-item">
          <Link to="a2-css-bootstrap" className="wd-assignment-link">
            A2 - CSS + BOOTSTRAP
          </Link>
          <div>
            Multiple Modules |
            <span style={{ fontWeight: "bold" }}> Not available until</span> May 13 at 12:00am |
            <br />
            <span style={{ fontWeight: "bold" }}> Due</span> May 20 at 11:59pm | 100 pts
          </div>
        </li>
        <br />

        <li className="wd-assignment-list-item">
          <Link to="a3-js-react" className="wd-assignment-link">
            A3 - JAVASCRIPT + REACT
          </Link>
          <div>
            Multiple Modules |
            <span style={{ fontWeight: "bold" }}> Not available until</span> May 20 at 12:00am |
            <br />
            <span style={{ fontWeight: "bold" }}> Due</span> May 27 at 11:59pm | 100 pts
          </div>
        </li>
        <br />

        <li className="wd-assignment-list-item">
          <Link to="a4-redux" className="wd-assignment-link">
            A4 - State & Redux
          </Link>
          <div>
            Multiple Modules |
            <span style={{ fontWeight: "bold" }}> Not available until</span> May 27 at 12:00am |
            <br />
            <span style={{ fontWeight: "bold" }}> Due</span> June 4 at 11:59pm | 100 pts
          </div>
        </li>
      </ul>
    </div>
  );
}
