import { useState } from "react";
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import ChildStateComponent from "./ChildStateComponent";
import ReduxExamples from "./ReduxExamples";
import HelloRedux from "./ReduxExamples/HelloRedux";
import CounterRedux from "./ReduxExamples/CounterRedux";
import AddRedux from "./ReduxExamples/AddRedux";
import TodoList from "./ReduxExamples/todos/TodoList";

export default function Lab4() {
  const [counter, setCounter] = useState(0);

  function sayHello() {
    alert("Hello");
  }

  return (
    <div>
      <h2>Lab 4</h2>
      <ClickEvent /> <br />
      <PassingDataOnEvent /> <br />
      <PassingFunctions theFunction={sayHello} />
      <EventObject /><br />
      <Counter /><br />
      <BooleanStateVariables /> <br />
      <StringStateVariables /><br />
      <DateStateVariable /> <br />
      <ObjectStateVariable /><br />
      <ArrayStateVariable /><br />
      <ParentStateComponent /> <br />
      <ChildStateComponent counter={counter} setCounter={setCounter} /><br />
      <ReduxExamples /><br />
      <HelloRedux /><br />
      <CounterRedux /><br />
      <AddRedux /><br />
      <TodoList /><br />
    </div>
  );
}
