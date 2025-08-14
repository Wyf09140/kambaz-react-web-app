import { createSlice } from "@reduxjs/toolkit";

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
    setModules: (state, { payload: modules }) => {
      state.modules = modules;
    },
    addModule: (state, action) => {
      state.modules.push(action.payload);
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
  editModule
} = modulesSlice.actions;

export default modulesSlice.reducer;
