const Attendance = require("../models/attendance");

const User =require( "../models/user.js");
const Department = require ("../models/department.js");

// ---------------core objectives--------------

// see his routine

const getStudentRoutine = async (req, res) => {
  try {
    const studentId = req.result._id;
    const student = await User.findById(studentId)
      .populate("studentProfile.department", "name code year")
      .lean();

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const { department, year } = student.studentProfile;

    if (!department) {
      return res.status(400).json({ message: "Student is not assigned to a department" });
    }

    // Fetch department routine
    const dept = await Department.findById(department._id)
      .populate("routine.course", "name subjectcode")
      .populate("routine.faculty", "name")
      .populate("routine.room", "name")
      .lean();

    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Filter routine by student's year
    const studentRoutine = dept.routine.filter(r => {
      return dept.year === year; 
    });

    return res.json({
      student: { name: student.name, rollNumber: student.studentProfile.rollNumber },
      department: dept.name,
      year,
      routine: studentRoutine
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching student routine" });
  }
};


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
module.exports={markattendancebyQR,getStudentRoutine}

