const express = require('express')
const adminRouter = express.Router()
const {createCourse, createDepartment, createRoom, createDepartmentTimetable,publishRoutine, conflict} = require('../controller/admincreatecontrol')
const {getFacultyAssignmentsbyCourse,getAssignmentsByFaculty, getFaculties, getDepartments, getDepartmentTimetable, getRooms, 
    getStudentCountByDepartment, getStudentCountPerYear, getStudentCountPerYearPerDepartment,
    getAttendanceGroupedByDepartment,
    getCourseAttendanceStatsByDepartment,
    getStudentCountForAllDepartments,
} = require("../controller/adminanalysiscontrol")
const authmidware = require('../middleware/authmidware')


adminRouter.post('/createcourse',authmidware,createCourse)
adminRouter.post('/createdepartment',authmidware,createDepartment)
adminRouter.get('/createtimetable/:deptId',authmidware,createDepartmentTimetable)
adminRouter.post('/conflict/:deptId',authmidware,conflict)
adminRouter.put("/publish/:deptId",authmidware,publishRoutine)
adminRouter.post('/createroom',authmidware,createRoom)

adminRouter.get('/getdepartments',authmidware,getDepartments)
adminRouter.get('/getfaculties',authmidware,getFaculties)
adminRouter.get('/getrooms',authmidware,getRooms)
adminRouter.get("/presenttimetable/:deptId",authmidware,getDepartmentTimetable)
// analusis
// studentcount v/s dept
adminRouter.get('/studentcountbydept/all',authmidware,getStudentCountForAllDepartments)
adminRouter.get('/studentcountbydept/:deptId',authmidware,getStudentCountByDepartment)
adminRouter.get('/studentcountbyyear',authmidware,getStudentCountPerYear)
adminRouter.get('/studentcountperyearperdept',authmidware,getStudentCountPerYearPerDepartment)

// year and departmentwise student attendance
adminRouter.get('/student_attendance_year_dept',authmidware,getAttendanceGroupedByDepartment)
adminRouter.get('/student_attendance_per_course',authmidware,getCourseAttendanceStatsByDepartment)

adminRouter.post("/course_analyse",authmidware,getFacultyAssignmentsbyCourse)
adminRouter.post("/faculty_analyse",authmidware,getAssignmentsByFaculty)

module.exports = adminRouter