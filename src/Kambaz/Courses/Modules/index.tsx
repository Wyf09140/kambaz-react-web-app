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
import * as coursesClient from "../client";
import * as modulesClient from "../client";

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");
  const modules = useSelector((state: any) => state.modulesReducer.modules);
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const isFaculty = currentUser?.role === "FACULTY";

  const [editNames, setEditNames] = useState<{ [key: string]: string }>({});

  const fetchModulesForCourse = async () => {
    const modules = await coursesClient.findModulesForCourse(cid!);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModulesForCourse();
  }, [cid]);

  const fetchModules = async () => {
    if (!cid) return;
    const modules = await coursesClient.findModulesForCourse(cid);
    dispatch(setModules(modules));
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  const createModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await coursesClient.createModuleForCourse(cid, newModule);
    dispatch(addModule(module));
    setModuleName("");
  };

  const deleteModuleHandler = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
    };


  const addModuleHandler = async () => {
    const newModule = await courseClient.createModuleForCourse(cid!, {
      name: moduleName,
      course: cid,
    });
    dispatch(addModule(newModule));
    setModuleName("");
  };

  const updateModuleHandler = async (module: any) => {
      await modulesClient.updateModule(module);
      dispatch(updateModule(module));
  };

  const removeModule = async (moduleId: string) => {
    if (!cid) return;
    await modulesClient.deleteModule(cid, moduleId);
    dispatch(deleteModule(moduleId));
  };



  const handleEdit = (moduleId: string, currentName: string) => {
    dispatch(editModule(moduleId));
    setEditNames((prev) => ({ ...prev, [moduleId]: currentName }));
  };

  const handleChange = (moduleId: string, value: string) => {
    setEditNames((prev) => ({ ...prev, [moduleId]: value }));

    const oldModule = modules.find((m: any) => m._id === moduleId);
    if (!oldModule) return;

    const updatedModule = {
      ...oldModule,
      name: value,
    };

    dispatch(updateModule(updatedModule));
  };

  const handleSave = async (module: any) => {
    if (!cid) return;
    const updatedModule = {
      ...module,
      name: editNames[module._id],
      editing: false,
    };
    await modulesClient.updateModule(cid, updatedModule);
    dispatch(updateModule(updatedModule));
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
                      value={editNames[module._id] || ""}
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
