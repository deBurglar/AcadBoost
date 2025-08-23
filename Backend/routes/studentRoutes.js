const express = require('express')
const { markattendancebyQR,getStudentRoutine, getMyAttendance } = require("../controller/studentcontroller");
const verifyDevice = require('../middleware/verifydevicemidware');
const studentRouter = express.Router()
const authmidware = require('../middleware/authmidware');
const ChatAi = require('../controller/chatbot');

studentRouter.get('/routine',authmidware,getStudentRoutine)
studentRouter.post("/markattendance", verifyDevice,markattendancebyQR);

studentRouter.get("/myattendance",authmidware,getMyAttendance)
studentRouter.post("/chat",ChatAi)

module.exports={studentRouter}