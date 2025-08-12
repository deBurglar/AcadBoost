const express = require('express')
const adminRouter = express.Router()
const {createCourse, createDepartment, createRoom} = require('../controller/admins')
const authmidware = require('../middleware/authmidware')


adminRouter.post('/createcourse',authmidware,createCourse)
// adminRouter.post('/createdepartment',authmidware,createDepartment)
adminRouter.post('/createroom',authmidware,createRoom)

module.exports = adminRouter