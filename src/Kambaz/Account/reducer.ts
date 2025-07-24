// ✅ Account/reducer.ts
import { createSlice } from "@reduxjs/toolkit";

// 尝试从 localStorage 中读取已登录用户
const savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");

const accountSlice = createSlice({
  name: "account",
  initialState: {
    currentUser: savedUser,
  },
  reducers: {
    // ✅ 设置用户
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },

    // ✅ 登出
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },

    // ✅ 加入课程
    enrollCourse: (state, action) => {
      const courseId = action.payload;
      if (
        state.currentUser &&
        !state.currentUser.enrolledCourseIds?.includes(courseId)
      ) {
        state.currentUser.enrolledCourseIds = [
          ...(state.currentUser.enrolledCourseIds || []),
          courseId,
        ];
        localStorage.setItem(
          "currentUser",
          JSON.stringify(state.currentUser)
        );
      }
    },

    // ✅ 退出课程
    unenrollCourse: (state, action) => {
      const courseId = action.payload;
      if (state.currentUser?.enrolledCourseIds?.includes(courseId)) {
        state.currentUser.enrolledCourseIds = state.currentUser.enrolledCourseIds.filter(
          (id: string) => id !== courseId
        );
        localStorage.setItem(
          "currentUser",
          JSON.stringify(state.currentUser)
        );
      }
    },
  },
});

export const {
  setCurrentUser,
  logout,
  enrollCourse,
  unenrollCourse,
} = accountSlice.actions;

export default accountSlice.reducer;
