import Lab1 from "./Lab1";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import TOC from "./TOC";
import { Route, Routes, Navigate } from "react-router";

export default function Labs() {
  return (
    <div>
      <h1>Labs</h1>
      <h5 className="mt-3">Yifan Wei</h5> <br />
      <TOC />

      <Routes>
        <Route path="/" element={<Navigate to="Lab1" />} />
        <Route path="Lab1" element={<Lab1 />} />
        <Route path="Lab2/*" element={<Lab2 />} />
        <Route path="Lab3/*" element={<Lab3 />} />
      </Routes>

      <div className="mt-3">
        <a
          id="wd-github"
          href="https://github.com/Wyf09140/kambaz-react-web-app"
          target="_blank"
          rel="noreferrer"
        >
          GitHub Repo
        </a>
      </div>
    </div>
  );
}
