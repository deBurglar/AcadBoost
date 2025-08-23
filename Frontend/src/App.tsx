import './App.css'

import {BrowserRouter,Routes,Route,Navigate} from "react-router"
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { checkAuth } from "./authSlice";

import AcademicManagementSystem from './pages/Home'
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
import StudentRoutine from './pages/Student';
import { addNotification } from "./notificationslice";
import { registerServiceWorker, subscribeUser } from "./lib/pushManager";
import axiosClient from './lib/axiosClient';
import StudentDeptAnalytics from './components/Admin/Analysis/studentvsDept';
import DepartmentAttendanceDashboard from './components/Admin/Analysis/departmentvsattendance';
import ViewAttendance from './components/FacultyPage/viewAttendance';
import StudentAttendance from './components/StudentPage/AttendanceReport';
function App() {

const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

 useEffect(() => {
    let mounted = true;

    async function initPush() {
      try {
        if (!("serviceWorker" in navigator)) return;

        // Register SW
        const reg = await registerServiceWorker();
        console.log("Service worker registered", reg);

        // Get public VAPID key from backend (matches your notifRouter.get("/publicKey"))
        const { data } = await axiosClient.get(`/notifications/publicKey`);
        const publicKey = data?.publicKey;
        if (!publicKey) {
          console.warn("No public key returned from backend");
          return;
        }

        // If already subscribed, we may get an existing subscription
        const existing = await reg.pushManager.getSubscription();
        if (existing) {
          // Send existing to backend to ensure it's saved
          await axiosClient.post(`/notifications/subscribe`, existing.toJSON());
          console.log("Existing subscription sent to backend");
        } else {
          // subscribe and send to backend
          const subscriptionJSON = await subscribeUser(reg, publicKey);
          await axiosClient.post(`/notifications/subscribe`, subscriptionJSON);
          console.log("New subscription saved on backend");
        }
      } catch (err) {
        console.error("Push init error:", err);
      }
    }

    initPush();

    // Listen for messages forwarded from service worker
    if ("serviceWorker" in navigator) {
      const onMessage = (event: MessageEvent) => {
        if (event?.data?.type === "PUSH_NOTIFICATION") {
          const payload = event.data.payload;
          // payload assumed: { title, body, url, ... }
          const id = Date.now().toString();
          dispatch(
            addNotification({
              id,
              title: payload.title || "Notification",
              message: payload.body || payload.message || "",
              read: false,
              url: payload.url || "/",
            })
          );
        }
      };
      navigator.serviceWorker.addEventListener("message", onMessage);
      return () => {
        mounted = false;
        navigator.serviceWorker.removeEventListener("message", onMessage);
      };
    }
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
        <Route index element={<StudentRoutine />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="attendance/analysis" element={<StudentAttendance/>} />
        
        <Route path="attendance/courses" element={<Courses />} />
      </Route>
      <Route path="attendance/take/:courseId" element={<TakeAttendance />} />
      
      </>
    ) : (
      <Route path="/student/*" element={<Navigate to="/" />} />
    )}

        {/* Faculty page */}
        {isAuthenticated && user?.role === 'faculty' ? (
          <>
      <Route path="/faculty" element={<FacultyLayout/>}>
        <Route index element={<Faculty />} />
        <Route path="attendance" element={<Attendance />} />
        
        <Route path="attendance/courses" element={<Courses />} />
        <Route path='attendance/courses/view_attendance/:courseId' element={<ViewAttendance/>}/>
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
        <Route path="student-vs-dept" element={<StudentDeptAnalytics />} />
        <Route path="attendance-vs-dept" element={<DepartmentAttendanceDashboard />} />
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
