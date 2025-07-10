import ModulesControls from "./ModulesControls";
import { ListGroup } from "react-bootstrap";
import GreenCheckmark from "./GreenCheckmark"; 
import LessonControlButtons from "./LessonControlButtons"
import { BsGripVertical } from "react-icons/bs";

export default function Modules() {
  return (
    <div>
      <ModulesControls />
      <br />

      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 1<LessonControlButtons />
          </div>

          <ListGroup className="wd-lessons rounded-0">
            <ListGroup.Item className="wd-lesson p-3 ps-1 fw-bold">
               <BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Introduction to the course<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Learn what is Web Development<LessonControlButtons />
            </ListGroup.Item>

            <ListGroup.Item className="wd-lesson p-3 ps-1 fw-bold">
               <BsGripVertical className="me-2 fs-3" />READING<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Full Stack Developer - Chapter 1 - Introduction<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Full Stack Developer - Chapter 2 - Creating User<LessonControlButtons />
            </ListGroup.Item>

            <ListGroup.Item className="wd-lesson p-3 ps-1 fw-bold">
               <BsGripVertical className="me-2 fs-3" />SLIDES<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Introduction to Web Development<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Creating an HTTP server with Node.js<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Creating a React Application<LessonControlButtons />
            </ListGroup.Item>
          </ListGroup>
        </ListGroup.Item>

       
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
             <BsGripVertical className="me-2 fs-3" />Week 2<LessonControlButtons />
          </div>

          <ListGroup className="wd-lessons rounded-0">
            <ListGroup.Item className="wd-lesson p-3 ps-1 fw-bold">
               <BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Learn how to create user interfaces with HTML<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Deploy the assignment to Netlify<LessonControlButtons/>
            </ListGroup.Item>

            <ListGroup.Item className="wd-lesson p-3 ps-1 fw-bold">
               <BsGripVertical className="me-2 fs-3" />SLIDES<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Introduction to HTML and the DOM<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Formatting Web content with Headings and<LessonControlButtons />
            </ListGroup.Item>
            <ListGroup.Item className="wd-lesson p-3 ps-3">
               <BsGripVertical className="me-2 fs-3" />Formatting content with Lists and Tables<LessonControlButtons />
            </ListGroup.Item>
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
