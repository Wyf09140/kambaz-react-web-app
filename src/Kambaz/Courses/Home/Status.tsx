export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      <div>
        <button>Unpublish</button> <button>Publish</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
        <button>Import Existing Content</button>
        <button>Import from Commons</button>
        <button>Choose Home Page</button>
        <button>View Course Stream</button>
        <button>New Announcement</button>
        <button>New Analytics</button>
        <button>View Course Notifications</button>
      </div>
    </div>
  );
}
