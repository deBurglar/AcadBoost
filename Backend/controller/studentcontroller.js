

// ---------------core objectives--------------

const Attendance = require("../models/attendance");

// see his routine

// check attendance


// mark attendance 
const markattendancebyQR = async (req, res) => {
  try {
    const studentId = req.result._id; // from auth middleware
    const { courseId, sessionKey } = req.body;

    // check duplicate entry
    const existing = await Attendance.findOne({ student: studentId, course: courseId, sessionKey });
    if (existing) {
      return res.status(400).json({ error: "Attendance already marked" });
    }

    const attendance = new Attendance({
      student: studentId,
      course: courseId,
      sessionKey,
    });

    await attendance.save();

    res.json({ message: "Attendance marked via QR ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports={markattendancebyQR}

