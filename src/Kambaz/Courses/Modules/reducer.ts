import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; // 类型专用导入
import { v4 as uuidv4 } from "uuid";

// 定义 Module 类型
export interface Module {
  _id: string;
  name: string;
  course: string;
  lessons: any[];
  editing?: boolean;
}

// 定义模块状态类型
interface ModulesState {
  modules: Module[];
}

// 初始状态
const initialState: ModulesState = {
  modules: [],
};

// 创建 Slice
const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<Module[]>) => {
      state.modules = action.payload;
    },

    addModule: (
      state,
      action: PayloadAction<{ name: string; course: string }>
    ) => {
      const newModule: Module = {
        _id: uuidv4(),
        name: action.payload.name,
        course: action.payload.course,
        lessons: [],
      };
      state.modules.push(newModule);
    },

    deleteModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter(
        (module) => module._id !== action.payload
      );
    },

    updateModule: (state, action: PayloadAction<Partial<Module> & { _id: string }>) => {
      state.modules = state.modules.map((module) =>
        module._id === action.payload._id
          ? { ...module, ...action.payload }
          : module
      );
    },

    editModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.map((module) =>
        module._id === action.payload
          ? { ...module, editing: true }
          : module
      );
    },
  },
});

// 导出 actions 和 reducer
export const {
  setModules,
  addModule,
  deleteModule,
  updateModule,
  editModule,
} = modulesSlice.actions;

export default modulesSlice.reducer;
