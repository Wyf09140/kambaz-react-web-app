export default function ProjectInfo() {
  return (
    <div className="p-4" style={{ maxWidth: 720 }}>
      <h3>Project Information</h3>
      <p>
        <strong>Project:</strong> Kambaz Quizzes <br />
        <strong>Class:</strong> CS5610 <br />
        <strong>Team Member:</strong> Yifan Wei
      </p>

      <p>
        <strong>GitHub (Frontend):</strong>{" "}
        <a
          href="https://github.com/Wyf09140/kambaz-react-web-app"
          target="_blank"
          rel="noreferrer"
        >
          github.com/Wyf09140/kambaz-react-web-app
        </a>
        <br />
        <strong>GitHub (Backend):</strong>{" "}
        <a
          href="https://github.com/Wyf09140/kambaz-node-server-app"
          target="_blank"
          rel="noreferrer"
        >
          github.com/Wyf09140/kambaz-node-server-app
        </a>
        <br />
        <strong>Project Demo Video:</strong>{" "}
        <a
          href="https://youtu.be/qokooek0xtA"
          target="_blank"
          rel="noreferrer"
        >
          https://youtu.be/qokooek0xtA
        </a>
      </p>
    </div>
  );
}
