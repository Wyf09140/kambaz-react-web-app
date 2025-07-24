import { createSlice } from "@reduxjs/toolkit";
import * as db from "../Database"; // 只在 reducer 内部使用

const courseSlice = createSlice({
  name: "courses",
  initialState: db.courses,
  reducers: {
    addCourse: (state, action) => {
      state.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteCourse: (state, action) => {
      return state.filter(c => c._id !== action.payload);
    },
  },
});

export const { addCourse, updateCourse, deleteCourse } = courseSlice.actions;
export default courseSlice.reducer;
