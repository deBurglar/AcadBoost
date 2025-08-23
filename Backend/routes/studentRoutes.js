const express = require('express')
const { markattendancebyQR,getStudentRoutine, getMyAttendance } = require("../controller/studentcontroller");
const verifyDevice = require('../middleware/verifydevicemidware');
const studentRouter = express.Router()
const authmidware = require('../middleware/authmidware')

studentRouter.get('/routine',authmidware,getStudentRoutine)
studentRouter.post("/markattendance", verifyDevice,markattendancebyQR);

studentRouter.get("/myattendance",authmidware,getMyAttendance)

module.exports={studentRouter}