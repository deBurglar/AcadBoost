import './App.css'

import {BrowserRouter,Routes,Route,Navigate} from "react-router"
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { checkAuth } from "./authSlice";

import AcademicManagementSystem from './pages/Home'
import Student from './pages/Student'
import Faculty from './pages/Faculty'
import Admin from './pages/Admin'
function App() {

const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={
    isAuthenticated ? (
      user?.role === "student" ? (
        <Navigate to="/student" />
      ) : user?.role === "faculty" ? (
        <Navigate to="/faculty" />
      ) : user?.role === "admin" ? (
        <Navigate to="/admin" />
      ) : (
        <AcademicManagementSystem />
      )
    ) : (
     <AcademicManagementSystem/>
    )
  }
/>


        {/* Student page */}
        <Route
          path="/student"
          element={
            isAuthenticated && user?.role === "student" ? (
              <Student />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Faculty page */}
        <Route
          path="/faculty"
          element={
            isAuthenticated && user?.role === "faculty" ? (
              <Faculty />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/"
          element={
            isAuthenticated ? <Navigate to="/" /> : <AcademicManagementSystem />
          }
        />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
