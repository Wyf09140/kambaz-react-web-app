import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface Module {
  _id: string;
  name: string;
  course: string;
  lessons: any[];
  editing?: boolean;
}

interface ModulesState {
  modules: Module[];
}

const initialState: ModulesState = {
  modules: [],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, action) => {
      state.modules = action.payload;
    },

    addModule: (state, action) => {
      const newModule: Module = {
        _id: uuidv4(),
        lessons: [],
        name: action.payload.name,
        course: action.payload.course,
      };
      state.modules.push(newModule);
    },

    deleteModule: (state, action) => {
      state.modules = state.modules.filter((m) => m._id !== action.payload);
    },

    updateModule: (state, action) => {
      state.modules = state.modules.map((m) =>
        m._id === action.payload._id ? action.payload : m
      );
    },

    editModule: (state, action) => {
      state.modules = state.modules.map((m) =>
        m._id === action.payload ? { ...m, editing: true } : m
      );
    },
  },
});

export const {
  setModules,
  addModule,
  deleteModule,
  updateModule,
  editModule,
} = modulesSlice.actions;

export default modulesSlice.reducer;
