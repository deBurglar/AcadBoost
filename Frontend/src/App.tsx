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
import Layout from './components/Admin/Layout';
import Create from './components/Admin/create';
import Analyse from './components/Admin/anaysis';
import Attendance from './components/FacultyPage/attendance';
import FacultyLayout from "./components/FacultyPage/FacultyLayout"
import Courses from './components/FacultyPage/courses';
import EditTimeTable from './components/Admin/edittimetable';
import TakeAttendance from './components/FacultyPage/takeattendance';
import StudentLayout from './components/StudentPage/StudentLayout';
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

        {/* Landing Page */}
        <Route path="/" element={isAuthenticated ? (
      user?.role === "student" ? (<Navigate to="/student" />) : user?.role === "faculty" ? (<Navigate to="/faculty" />) : user?.role === "admin" ? (<Navigate to="/admin" />
      ) : (<AcademicManagementSystem />)
    ) : (<AcademicManagementSystem/>)}/>


        {/* Student page */}
        {isAuthenticated && user?.role === 'student' ? (
          <>
      <Route path="/student" element={<StudentLayout/>}>
        <Route index element={<Student />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="attendance/courses" element={<Courses />} />
      </Route>
      <Route path="attendance/take/:courseId" element={<TakeAttendance />} />
      </>
    ) : (
      <Route path="/faculty/*" element={<Navigate to="/" />} />
    )}

        {/* Faculty page */}
        {isAuthenticated && user?.role === 'faculty' ? (
          <>
      <Route path="/faculty" element={<FacultyLayout/>}>
        <Route index element={<Faculty />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="attendance/courses" element={<Courses />} />
      </Route>
      <Route path="attendance/take/:courseId" element={<TakeAttendance />} />
      </>
    ) : (
      <Route path="/faculty/*" element={<Navigate to="/" />} />
    )}

        {/* Admin page */}
        {isAuthenticated && user?.role === 'admin' ? (
          <>
      <Route path="/admin" element={<Layout/>}>
        <Route index element={<Admin />} />
        <Route path="create" element={<Create />} />
        
        <Route path="analysis" element={<Analyse />} />
      </Route>
      <Route path="/edit/:deptId" element={<EditTimeTable />} />
      </>
      
    ) : (
      <Route path="/admin/*" element={<Navigate to="/" />} />
      
      
    )}

  
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
