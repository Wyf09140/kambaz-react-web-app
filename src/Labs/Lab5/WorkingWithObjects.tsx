// src/Labs/Lab5/WorkingWithObjects.tsx
import { useState } from "react";
import { FormControl, Button, FormCheck } from "react-bootstrap";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER as string;

type ModuleT = {
  id: string;
  name: string;
  description: string;
  course: string;
  score: number;
  completed: boolean;
};

export default function WorkingWithObjects() {
  // --- 保留：Assignment（你现有的代码原样） ---
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;

  // --- 新增：Module ---
  const [mod, setMod] = useState<ModuleT | null>(null);
  const [modName, setModName] = useState("");
  const [modScore, setModScore] = useState<number | "">("");
  const [modCompleted, setModCompleted] = useState(false);
  const [onlyName, setOnlyName] = useState("");

  const getModule = async () => {
    const res = await fetch(`${REMOTE_SERVER}/lab5/module`);
    const data = (await res.json()) as ModuleT;
    setMod(data);
    // 同步到输入控件，便于立即编辑
    setModName(data.name);
    setModScore(data.score);
    setModCompleted(data.completed);
  };

  const getModuleName = async () => {
    const res = await fetch(`${REMOTE_SERVER}/lab5/module/name`);
    setOnlyName(await res.text());
  };

  const updateModuleName = async () => {
    if (!modName.trim()) return;
    await fetch(
      `${REMOTE_SERVER}/lab5/module/name/update/${encodeURIComponent(modName)}`
    );
    await getModule();
  };

  const updateModuleScore = async () => {
    if (modScore === "" || isNaN(Number(modScore))) return;
    await fetch(`${REMOTE_SERVER}/lab5/module/score/update/${Number(modScore)}`);
    await getModule();
  };

  const updateModuleCompleted = async () => {
    await fetch(
      `${REMOTE_SERVER}/lab5/module/completed/update/${modCompleted ? "true" : "false"}`
    );
    await getModule();
  };

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      {/* ---------- 保留：Assignment 区块 ---------- */}
      <h4>Modifying Properties</h4>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title
      </a>
      <FormControl
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <hr />

      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />

      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>

      {/* ---------- 新增：Module 区块（本题核心） ---------- */}
      <hr />
      <h3>Module (Lab 5)</h3>

      {/* 评分用的超链接（必须有） */}
      <div className="mb-2">
        <a
          id="wd-get-module-link"
          href={`${REMOTE_SERVER}/lab5/module`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-link p-0 me-3"
        >
          Get Module (link)
        </a>
        <a
          id="wd-get-module-name-link"
          href={`${REMOTE_SERVER}/lab5/module/name`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-link p-0"
        >
          Get Module Name (link)
        </a>
      </div>

      {/* 页面内操作/展示 */}
      <div className="mb-3">
        <Button id="wd-get-module-btn" onClick={getModule} className="me-2">
          Get Module
        </Button>
        <Button id="wd-get-module-name-btn" onClick={getModuleName}>
          Get Module Name
        </Button>
        {onlyName && <span className="ms-2">Name: <b>{onlyName}</b></span>}
      </div>

      {/* 编辑 name */}
      <div className="mb-2 d-flex align-items-center gap-2">
        <label htmlFor="wd-module-name-input" className="mb-0">Name:</label>
        <FormControl
          id="wd-module-name-input"
          className="w-auto"
          value={modName}
          onChange={(e) => setModName(e.target.value)}
        />
        <Button id="wd-update-module-name" onClick={updateModuleName}>
          Update Name
        </Button>
      </div>

      {/* 编辑 score */}
      <div className="mb-2 d-flex align-items-center gap-2">
        <label htmlFor="wd-module-score-input" className="mb-0">Score:</label>
        <FormControl
          id="wd-module-score-input"
          type="number"
          className="w-auto"
          value={modScore}
          onChange={(e) => setModScore(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Button id="wd-update-module-score" onClick={updateModuleScore}>
          Update Score
        </Button>
      </div>

      {/* 编辑 completed */}
      <div className="mb-2 d-flex align-items-center gap-2">
        <FormCheck
          id="wd-module-completed-checkbox"
          label="Completed"
          checked={modCompleted}
          onChange={(e) => setModCompleted(e.target.checked)}
        />
        <Button id="wd-update-module-completed" onClick={updateModuleCompleted}>
          Update Completed
        </Button>
      </div>

      {/* 显示当前 module */}
      {mod && (
        <pre id="wd-module-json" className="mt-3">
          {JSON.stringify(mod, null, 2)}
        </pre>
      )}
    </div>
  );
}
