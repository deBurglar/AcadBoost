const mongoose = require('mongoose')
const {Schema} = mongoose

const attendanceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true,
  },
  sessionKey: {
    type: String, // unique ID for that lecture/session
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


const Attendance = mongoose.model('attendance',attendanceSchema)
module.exports=Attendance