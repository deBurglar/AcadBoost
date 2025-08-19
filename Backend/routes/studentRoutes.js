const express = require('express')
const { markattendancebyQR } = require("../controller/studentcontroller");
const verifyDevice = require('../middleware/verifydevicemidware');
const studentRouter = express.Router()


studentRouter.post("/markattendance", verifyDevice,markattendancebyQR);

module.exports={studentRouter}