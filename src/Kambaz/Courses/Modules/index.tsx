import { useParams } from "react-router";
import * as db from "../../Database";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import GreenCheckmark from "./GreenCheckmark";
import { BsThreeDotsVertical } from "react-icons/bs"

export default function Modules() {
  const { cid } = useParams(); // 从 URL 获取课程 ID
  const modules = db.modules;

  return (
    <ListGroup id="wd-modules" className="rounded-0">
      <ModulesControls /><br />

      {modules
        .filter((module: any) => module.course === cid)
        .map((module: any) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            {/* 只保留一个 wd-title div */}
            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
              <div>
                <BsGripVertical className="me-2 fs-3" /> {module.name}{" "}
              </div>
              {/* 这个 div 包含了右侧的所有图标和加号 */}
              <div className="d-flex align-items-center">
                <GreenCheckmark />
                <span className="ms-2">+</span> {/* ms-2 为 + 号提供左边距 */}
                <BsThreeDotsVertical className="ms-2 fs-4" /> {/* 添加竖着的三个点图标，并提供左边距和大小 */}
              </div>
            </div>

            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any, index: number) => (
                  <ListGroup.Item
                    key={index}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                    <LessonControlButtons />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}
    </ListGroup>
  );
}