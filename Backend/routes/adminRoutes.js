const express = require('express')
const adminRouter = express.Router()
const {createCourse, createDepartment, createRoom, createDepartmentTimetable,publishRoutine} = require('../controller/admincreatecontrol')
const {getFacultyAssignmentsbyCourse,getAssignmentsByFaculty} = require("../controller/adminanalysiscontrol")
const authmidware = require('../middleware/authmidware')


adminRouter.post('/createcourse',authmidware,createCourse)
adminRouter.post('/createdepartment',authmidware,createDepartment)
adminRouter.get('/createtimetable/:deptId',authmidware,createDepartmentTimetable)
adminRouter.put("/publish/:deptId",authmidware,publishRoutine)
adminRouter.post('/createroom',authmidware,createRoom)


// analusis

adminRouter.post("/course_analyse",authmidware,getFacultyAssignmentsbyCourse)
adminRouter.post("/faculty_analyse",authmidware,getAssignmentsByFaculty)

module.exports = adminRouter