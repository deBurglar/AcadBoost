const express = require('express')
const authmidware = require('../middleware/authmidware')
const { getFacultyScheduleGrouped, studentinmycourse, takeAttendance, getMyCourses, getFacultyLastAttendance } = require('../controller/facultycontroller')
const facultyRouter = express.Router()

// get student by course
facultyRouter.get('/studentinmycourse/:courseId',authmidware,studentinmycourse)
// do attendance
facultyRouter.post('/takeattendance',authmidware,takeAttendance)
// faculty schedule
facultyRouter.get('/schedule',authmidware,getFacultyScheduleGrouped)
// faculty daily attendance counts

// faculty attendance report for a date range

// faculty last class attendance
facultyRouter.get('/last_attendance_report',authmidware,getFacultyLastAttendance)

// faculty courses
facultyRouter.get('/mycourses',authmidware,getMyCourses)
module.exports = facultyRouter