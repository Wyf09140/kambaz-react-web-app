import { createSlice } from "@reduxjs/toolkit";
import * as db from "../../Database";

// 刷新时恢复默认数据
const initialState = JSON.parse(JSON.stringify(db.assignments));

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action) => {
      state.push(action.payload);
    },
    updateAssignment: (state, action) => {
      const index = state.findIndex((a: any) => a._id === action.payload._id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteAssignment: (state, action) => {
      const index = state.findIndex((a: any) => a._id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    }
  }
});

export const { addAssignment, updateAssignment, deleteAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
