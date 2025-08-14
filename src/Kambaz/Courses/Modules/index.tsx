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
import * as coursesClient from "../client";  // ✅ 课程相关：按课程取/创模块
import * as modulesClient from "./client";   // ✅ 模块资源：更/删模块（只要 1 个参数）

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");
  const modules = useSelector((state: any) => state.modulesReducer.modules);
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const isFaculty = currentUser?.role === "FACULTY";

  // 本地编辑名称缓存（仍保留以支持回车保存等）
  const [editNames, setEditNames] = useState<{ [key: string]: string }>({});

  // 统一拉取
  const loadModules = async () => {
    if (!cid) return;
    const list = await coursesClient.findModulesForCourse(cid);
    dispatch(setModules(list));
  };

  useEffect(() => {
    loadModules();
  }, [cid]);

  // 新建（POST /api/courses/:cid/modules）
  const addModuleHandler = async () => {
    if (!cid || !moduleName.trim()) return;
    const created = await coursesClient.createModuleForCourse(cid, {
      name: moduleName.trim(),
      course: cid,
    });
    dispatch(addModule(created));
    setModuleName("");
  };

  // 删除（DELETE /api/modules/:id）
  const deleteModuleHandler = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);        // ✅ 只传 1 个参数
    dispatch(deleteModule(moduleId));
  };

  // 更新（PUT /api/modules/:id）
  const updateModuleHandler = async (module: any) => {
    await modulesClient.updateModule(module);          // ✅ 只传 1 个参数
    dispatch(updateModule(module));
  };

  // 进入编辑态时记住当前名字
  const handleEdit = (moduleId: string, currentName: string) => {
    dispatch(editModule(moduleId));
    setEditNames((prev) => ({ ...prev, [moduleId]: currentName }));
  };

  // 输入变化：本地/全局都更新名字，按回车即保存
  const handleChange = (module: any, value: string) => {
    setEditNames((prev) => ({ ...prev, [module._id]: value }));
    dispatch(updateModule({ ...module, name: value }));
  };

  const handleEnterSave = async (module: any) => {
    const name = editNames[module._id] ?? module.name;
    await updateModuleHandler({ ...module, name, editing: false });
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
                      value={editNames[module._id] ?? module.name ?? ""}
                      onChange={(e) => handleChange(module, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEnterSave(module);
                      }}
                    />
                  )}
                </div>

                {isFaculty && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                    editModule={(moduleId) =>
                      handleEdit(moduleId, module.name ?? "")
                    }
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
