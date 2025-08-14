import { useState, useEffect } from "react";
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
import * as coursesClient from "../client";  // ✅ 课程相关（按课取模块、创建模块）
import * as modulesClient from "./client";   // ✅ 模块资源自身（更新、删除）

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");
  const modules = useSelector((state: any) => state.modulesReducer.modules);
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const isFaculty = currentUser?.role === "FACULTY";

  // 拉取当前课程的模块
  const loadModules = async () => {
    if (!cid) return;
    const list = await coursesClient.findModulesForCourse(cid);
    dispatch(setModules(list));
  };

  useEffect(() => {
    loadModules();
  }, [cid]);

  // 新建模块（走 Courses client：POST /api/courses/:cid/modules）
  const addModuleHandler = async () => {
    if (!cid || !moduleName.trim()) return;
    const created = await coursesClient.createModuleForCourse(cid, {
      name: moduleName.trim(),
      course: cid,
    });
    dispatch(addModule(created));
    setModuleName("");
  };

  // 删除模块（走 Modules client：DELETE /api/modules/:id）
  const deleteModuleHandler = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId); // ✅ 只传 id
    dispatch(deleteModule(moduleId));
  };

  // 更新模块（走 Modules client：PUT /api/modules/:id）
  const updateModuleHandler = async (module: any) => {
    await modulesClient.updateModule(module); // ✅ 只传整个 module
    dispatch(updateModule(module));
  };

  return (
    <div className="wd-modules">
      {isFaculty && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={addModuleHandler}
        />
      )}

      <ListGroup id="wd-modules" className="rounded-0">
        {Array.isArray(modules) &&
          modules.map((module: any) => (
            <ListGroup.Item
              key={module._id}
              className="wd-module p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                <div>
                  <BsGripVertical className="me-2 fs-3" />
                  {!module.editing && module.name}
                  {module.editing && (
                    <FormControl
                      className="w-50 d-inline-block"
                      defaultValue={module.name}
                      onChange={(e) =>
                        updateModuleHandler({ ...module, name: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateModuleHandler({ ...module, editing: false });
                        }
                      }}
                    />
                  )}
                </div>

                {isFaculty && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                  />
                )}
              </div>

              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any, index: number) => (
                    <ListGroup.Item key={index} className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name}
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
