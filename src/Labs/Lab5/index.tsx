import EnvironmentVariables from "./EnvironmentVariables";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
import PathParameters from "./PathParameters";
import QueryParameters from "./QueryParameters";
import WorkingWithObjects from "./WorkingWithObjects";
import WorkingWithArrays from "./WorkingWithArrays";
import HttpClient from "./HttpClient";
import WorkingWithObjectsAsynchronously from "./WorkingWithObjectsAsynchronously";
import WorkingWithArraysAsynchronously from "./WorkingWithArraysAsynchronously";


export default function Lab5() {
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <div className="list-group">
        <a href={`${REMOTE_SERVER}/lab5/welcome`} className="list-group-item">

          Welcome
        </a>
      </div>
      <hr />
       <EnvironmentVariables /><br />
       <PathParameters/><br />
       <QueryParameters/><br />
       <WorkingWithObjects/><br />
       <WorkingWithArrays/><br />
       <HttpClient/><br />
       <WorkingWithObjectsAsynchronously/><br />
       <WorkingWithArraysAsynchronously/><br />
    </div>
  );
}
