import { useEffect, useState } from "react";
import * as client from "./client";
import { FormControl } from "react-bootstrap";

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<any>({});

  const fetchAssignment = async () => {
    const assignment = await client.fetchAssignment();
    setAssignment(assignment);
  };

  const updateTitle = async (title: string) => {
    const updatedAssignment = await client.updateTitle(title);
    setAssignment(updatedAssignment);
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  return (
    <div id="wd-asynchronous-objects">
      <h3>Working with Objects Asynchronously</h3>
      <h4>Assignment</h4>

      {/* Title Input */}
      <FormControl
        defaultValue={assignment.title}
        className="mb-2"
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      {/* Description Textarea (Fixed TypeScript error) */}
      <FormControl
        as="textarea" // ✅ Make it a textarea so rows={3} is allowed
        rows={3}
        defaultValue={assignment.description}
        className="mb-2"
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />

      {/* Due Date Input */}
      <FormControl
        type="date"
        className="mb-2"
        defaultValue={assignment.due}
        onChange={(e) =>
          setAssignment({ ...assignment, due: e.target.value })
        }
      />

      {/* Completed Toggle */}
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="wd-completed"
          defaultChecked={assignment.completed}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
        <label className="form-check-label" htmlFor="wd-completed">
          Completed
        </label>
      </div>

      {/* Update Title Button */}
      <button
        className="btn btn-primary me-2"
        onClick={() => updateTitle(assignment.title)}
      >
        Update Title
      </button>

      {/* JSON Output */}
      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <hr />
    </div>
  );
}
