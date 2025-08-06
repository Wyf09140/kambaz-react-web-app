import { useState,useEffect } from "react";
import { useParams } from "react-router";
import { ListGroup, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import {
  setModules,
  addModule,
  editModule,
  updateModule,
  deleteModule,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as coursesClient from "../client";
import * as modulesClient from "../client";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const modules = useSelector((state: any) => state.modulesReducer.modules);
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const isFaculty = currentUser?.role === "FACULTY";
  const dispatch = useDispatch();
  const saveModule = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  const fetchModules = async () => {
    const modules = await coursesClient.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);
  

  const handleUpdateModule = (module: any) => {
    dispatch(updateModule(module));
  };

  const createModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await coursesClient.createModuleForCourse(cid, newModule);
    dispatch(addModule(module));
  };

  const removeModule = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };


  return (
    <div className="wd-modules">
      {/* ✅ 只有 FACULTY 可见 */}
      {isFaculty && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={createModuleForCourse}
        />
      )}

      <ListGroup id="wd-modules" className="rounded-0">
        {Array.isArray(modules) &&
          modules
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
                          if (e.key === "Enter")  {
                             saveModule({ ...module, editing: false });
                }

                        }}
                      />
                    )}
                  </div>

                  {/* ✅ 只有 FACULTY 可见按钮 */}
                  {isFaculty && (
                     <ModuleControlButtons moduleId={module._id}
                      deleteModule={(moduleId) => removeModule(moduleId)}
                      editModule={(moduleId) => dispatch(editModule(moduleId))} />
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
