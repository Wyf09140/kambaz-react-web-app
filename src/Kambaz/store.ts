import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer.ts";
import accountReducer from "./Account/reducer.ts";
import assignmentsReducer from "./Courses/Assignments/reducer";
import courseReducer from "./Courses/reducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    courses: courseReducer  },
});
export default store;
