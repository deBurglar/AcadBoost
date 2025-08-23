const Attendance = require("../models/attendance");
const Course = require("../models/courses.js")
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


 const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.result._id;

    const threshold = 40; // attendance % threshold

    // Get all courses student has attended at least once
    const attendedCourses = await Attendance.find({ student: studentId }).distinct("course");

    let results = [];

    for (const courseId of attendedCourses) {
      // Total sessions held for this course
      const totalSessions = await Attendance.find({ course: courseId }).distinct("sessionKey");
      const total = totalSessions.length;

      // Sessions attended by this student
      const attendedSessions = await Attendance.find({ student: studentId, course: courseId }).distinct("sessionKey");
      const attended = attendedSessions.length;

      const percentage = total > 0 ? (attended / total) * 100 : 0;

      // Get course info
      const course = await Course.findById(courseId).select("name subjectcode");

      results.push({
        course: {
          _id: course._id,
          name: course.name,
          subjectcode: course.subjectcode
        },
        attended,
        total,
        percentage: percentage.toFixed(2),
        warning: percentage < threshold
      });
    }

    return res.json({
      student: studentId,
      courses: results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
module.exports={markattendancebyQR,getStudentRoutine,getMyAttendance}

