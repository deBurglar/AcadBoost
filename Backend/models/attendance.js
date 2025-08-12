const mongoose = require('mongoose')
const {Schema} = mongoose

const attendanceSchema = Schema({
    student:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:'course',
        required:true,
    },
},{
    timestamps:true
})

const Attendance = mongoose.model('attendance',attendanceSchema)
module.exports=Attendance