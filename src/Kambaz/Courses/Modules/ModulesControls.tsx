import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";


export default function ModulesControls(
  { moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <div id="wd-modules-controls" className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex gap-2">
        <Button variant="secondary" id="wd-view-progress">
          View Progress
        </Button>
        <Button variant="secondary" id="wd-collapse-all">
          Collapse All
        </Button>
      </div>

      {/* 右边按钮区域 */}
      <div className="d-flex gap-2">
        <Button variant="danger" onClick={handleShow} >
          <FaPlus className="me-2" />
          Module
        </Button>

        <Dropdown>
          <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
            <GreenCheckmark /> Publish All
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item id="wd-publish-all">
              <GreenCheckmark /> Publish All
            </Dropdown.Item>
            <Dropdown.Item id="wd-publish-all-modules-and-items">
              <GreenCheckmark /> Publish all modules and items
            </Dropdown.Item>
            <Dropdown.Item id="wd-publish-modules-only">
              <GreenCheckmark /> Publish modules only
            </Dropdown.Item>
            <Dropdown.Item id="wd-unpublish-all-modules-and-items">
              Unpublish all modules and items
            </Dropdown.Item>
            <Dropdown.Item id="wd-unpublish-modules-only">
              Unpublish modules only
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ModuleEditor show={show} handleClose={handleClose} dialogTitle="Add Module"
       moduleName={moduleName} setModuleName={setModuleName} addModule={addModule} />
    </div>

      );
    }
