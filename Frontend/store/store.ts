import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../src/authSlice";
// import notificationReducer from "../src/notificationslice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // notifications: notificationReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;