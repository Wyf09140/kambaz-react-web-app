import React, { useState } from "react";
import { useParams } from "react-router";
import { ListGroup, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import {
  addModule,
  editModule,
  updateModule,
  deleteModule,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const modules = useSelector((state: any) => state.modulesReducer.modules);
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const isFaculty = currentUser?.role === "FACULTY";
  const dispatch = useDispatch();

  const handleAddModule = () => {
    if (!moduleName.trim()) return;
    dispatch(addModule({ name: moduleName, course: cid }));
    setModuleName("");
  };

  const handleDeleteModule = (moduleId: string) => {
    dispatch(deleteModule(moduleId));
  };

  const handleEditModule = (moduleId: string) => {
    dispatch(editModule(moduleId));
  };

  const handleUpdateModule = (module: any) => {
    dispatch(updateModule(module));
  };

  return (
    <div className="wd-modules">
      {/* ✅ 只有 FACULTY 可见 */}
      {isFaculty && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={handleAddModule}
        />
      )}

      <ListGroup id="wd-modules" className="rounded-0">
        {Array.isArray(modules) &&
          modules
            .filter((module: any) => module.course === cid)
            .map((module: any) => (
              <ListGroup.Item
                key={module._id}
                className="wd-module p-0 mb-5 fs-5 border-gray"
              >
                <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                  <div>
                    <BsGripVertical className="me-2 fs-3" />{" "}
                    {!module.editing && module.name}
                    {module.editing && (
                      <FormControl
                        className="w-50 d-inline-block"
                        defaultValue={module.name}
                        onChange={(e) =>
                          handleUpdateModule({
                            ...module,
                            name: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateModule({
                              ...module,
                              editing: false,
                            });
                          }
                        }}
                      />
                    )}
                  </div>

                  {/* ✅ 只有 FACULTY 可见按钮 */}
                  {isFaculty && (
                    <ModuleControlButtons
                      moduleId={module._id}
                      deleteModule={() => handleDeleteModule(module._id)}
                      editModule={() => handleEditModule(module._id)}
                    />
                  )}
                </div>

                {module.lessons && (
                  <ListGroup className="wd-lessons rounded-0">
                    {module.lessons.map((lesson: any, index: number) => (
                      <ListGroup.Item key={index} className="wd-lesson p-3 ps-1">
                        <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                        {/* ✅ 只有 FACULTY 可见按钮 */}
                        {isFaculty && <LessonControlButtons />}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            ))}
      </ListGroup>
    </div>
  );
}
