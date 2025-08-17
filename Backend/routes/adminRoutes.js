const express = require('express')
const adminRouter = express.Router()
const {createCourse, createDepartment, createRoom, createDepartmentTimetable,publishRoutine} = require('../controller/admincreatecontrol')
const {getFacultyAssignmentsbyCourse,getAssignmentsByFaculty, getFaculties, getDepartments} = require("../controller/adminanalysiscontrol")
const authmidware = require('../middleware/authmidware')


adminRouter.post('/createcourse',authmidware,createCourse)
adminRouter.post('/createdepartment',authmidware,createDepartment)
adminRouter.get('/createtimetable/:deptId',authmidware,createDepartmentTimetable)
adminRouter.put("/publish/:deptId",authmidware,publishRoutine)
adminRouter.post('/createroom',authmidware,createRoom)

adminRouter.get('/getdepartments',authmidware,getDepartments)
adminRouter.get('/getfaculties',authmidware,getFaculties)
// analusis

adminRouter.post("/course_analyse",authmidware,getFacultyAssignmentsbyCourse)
adminRouter.post("/faculty_analyse",authmidware,getAssignmentsByFaculty)

module.exports = adminRouter