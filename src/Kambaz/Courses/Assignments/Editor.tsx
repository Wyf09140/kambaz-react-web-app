import { useState } from "react";

export default function AssignmentEditor() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(100);
  const [group, setGroup] = useState("ASSIGNMENTS");
  const [gradeDisplay, setGradeDisplay] = useState("Percentage");
  const [submissionType, setSubmissionType] = useState("Online");
  const [entryOptions, setEntryOptions] = useState([]);
  const [assignTo, setAssignTo] = useState("Everyone");
  const [dueDate, setDueDate] = useState();
  const [availableFrom, setAvailableFrom] = useState();
  const [availableUntil, setAvailableUntil] = useState();

  const handleCheckboxChange = (option) => {
    setEntryOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleSave = () => {
    const result = {
      name,
      description,
      points,
      group,
      gradeDisplay,
      submissionType,
      entryOptions,
      assignTo,
      dueDate,
      availableFrom,
      availableUntil
    };
    console.log("Assignment Saved:", result);
    alert("Assignment saved! Check console for data.");
  };

  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label><br />
      <input id="wd-name" value={name} onChange={e => setName(e.target.value)} /><br /><br />

      <label htmlFor="wd-description">Description</label><br />
      <textarea
        id="wd-description"
        rows={6}
        cols={60}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <br /><br />

      <table>
        <tbody>
          <tr>
            <td align="right"><label htmlFor="wd-points">Points</label></td>
            <td>
              <input
                id="wd-points"
                type="number"
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
              />
            </td>
          </tr>

          <tr>
            <td align="right"><label htmlFor="wd-assignment-group">Assignment Group</label></td>
            <td>
              <select
                id="wd-assignment-group"
                value={group}
                onChange={e => setGroup(e.target.value)}
              >
                <option>ASSIGNMENTS</option>
                <option>QUIZZES</option>
                <option>EXAMS</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right"><label htmlFor="wd-display-grade">Display Grade as</label></td>
            <td>
              <select
                id="wd-display-grade"
                value={gradeDisplay}
                onChange={e => setGradeDisplay(e.target.value)}
              >
                <option>Percentage</option>
                <option>Points</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right" valign="top"><label htmlFor="wd-submission-type">Submission Type</label></td>
            <td>
              <select
                id="wd-submission-type"
                value={submissionType}
                onChange={e => setSubmissionType(e.target.value)}
              >
                <option>Online</option>
                <option>On Paper</option>
                <option>No Submission</option>
              </select>
              <br />
              {["Text Entry", "Website URL", "Media Recordings", "Student Annotation", "File Uploads"].map(option => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={entryOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  {option}
                  <br />
                </label>
              ))}
            </td>
          </tr>

         <tr>
            <td align="right"><label htmlFor="wd-assign-to">Assign to</label></td>
            <td>
                <select
                id="wd-assign-to"
                value={assignTo}
                onChange={e => setAssignTo(e.target.value)}
                >
                <option value="Everyone">Everyone</option>
                <option value="Students Only">Students Only</option>
                <option value="TA Only">TA Only</option>
                </select>
            </td>
        </tr>

          <tr>
            <td align="right"><label htmlFor="wd-due-date">Due</label></td>
            <td>
              <input
                id="wd-due-date"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td align="right"><label>Available from</label></td>
            <td>
              <input
                type="date"
                value={availableFrom}
                onChange={e => setAvailableFrom(e.target.value)}
              />
              &nbsp;Until&nbsp;
              <input
                type="date"
                value={availableUntil}
                onChange={e => setAvailableUntil(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <br />
      <button onClick={() => alert("Cancelled")}>Cancel</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
