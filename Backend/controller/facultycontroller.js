
const Department = require("../models/department");
const Attendance = require("../models/attendance");
const User = require("../models/user")
const Course = require("../models/courses");
//------------- core objectives------------------

//  see his own schedules
async function getFacultyScheduleGrouped(req,res) {
    try {
        const facultyId = req.result._id
        // Find all departments with populated routine
        const departments = await Department.find({
            "routine.course": { $exists: true }
        })
        .populate({
            path: "routine.course",
            model: "course",
            match: { faculty: facultyId }, // only match courses of this faculty
            populate: {
                path: "faculty",
                select: "name email"
            }
        })
        .populate({
            path: "routine.room",
            model: "room",
            select: "name type"
        })
        .lean();

        // Grouped schedule by day
        const scheduleByDay = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: []
        };

        // Fill schedule
        departments.forEach(dept => {
            dept.routine.forEach(entry => {
                if (entry.course && entry.course.faculty) {
                    const classInfo = {
                        department: dept.name,
                        year: dept.year,
                        course: entry.course.subjectcode || entry.course.name,
                        room: entry.room?.name,
                        roomType: entry.room?.type,
                        time: entry.time
                    };

                    // Map short day to full name
                    const dayMap = {
                        Mon: "Monday",
                        Tue: "Tuesday",
                        Wed: "Wednesday",
                        Thu: "Thursday",
                        Fri: "Friday"
                    };

                    const dayName = dayMap[entry.day] || entry.day;
                    if (!scheduleByDay[dayName]) {
                        scheduleByDay[dayName] = [];
                    }
                    scheduleByDay[dayName].push(classInfo);
                }
            });
        });

        // Object.keys(scheduleByDay).forEach(day => {
        //     scheduleByDay[day].sort((a, b) => {
        //         const [aHour, aMin] = a.time.split(":").map(Number);
        //         const [bHour, bMin] = b.time.split(":").map(Number);
        //         return aHour - bHour || aMin - bMin;
        //     });
        // });

        res.send(scheduleByDay);
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching faculty schedule");
    }
}

// see his class attendance strength
async function getFacultyDailyAttendance(req,res) {
    try {

        const {facultyId,date} = req.body
        // Normalize date to start and end of the day
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        // Find courses taught by this faculty
        const courses = await Course.find({ faculty: facultyId }).select("_id subjectcode name");
        const courseIds = courses.map(c => c._id);

        if (courseIds.length === 0) {
            return [];
        }

        // Aggregate attendance for those courses on the given date
        const counts = await Attendance.aggregate([
            {
                $match: {
                    course: { $in: courseIds },
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: "$course",
                    strength: { $sum: 1 }
                }
            }
        ]);

        // Map counts to course info
        const result = courses.map(course => {
            const found = counts.find(c => String(c._id) === String(course._id));
            return {
                courseId: course._id,
                subjectcode: course.subjectcode,
                name: course.name,
                attendanceCount: found ? found.strength : 0
            };
        });

         res.send(result);
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching daily attendance");
    }
}
// sample output
// [
//   {
//     "courseId": "64ff2a...",
//     "subjectcode": "CS201",
//     "name": "Data Structures",
//     "attendanceCount": 38
//   },
//   {
//     "courseId": "64ff3b...",
//     "subjectcode": "CS202",
//     "name": "Operating Systems",
//     "attendanceCount": 35
//   }
// ]




// attendace report for a date range
async function getFacultyAttendanceReport(req,res) {
    const {facultyId,startDate,endDate} = req.body
    try {
        // Normalize start and end dates
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Get faculty's courses
        const courses = await Course.find({ faculty: facultyId }).select("_id subjectcode name");
        const courseIds = courses.map(c => c._id);

        if (courseIds.length === 0) return [];

        // Aggregate attendance grouped by course and date
        const attendanceData = await Attendance.aggregate([
            {
                $match: {
                    course: { $in: courseIds },
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        course: "$course",
                        day: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Organize data: { courseId: { date: count, ... }, ... }
        const report = {};

        attendanceData.forEach(item => {
            const courseId = item._id.course.toString();
            const day = item._id.day;
            if (!report[courseId]) report[courseId] = {};
            report[courseId][day] = item.count;
        });

        // Format output with course info
        const result = courses.map(course => ({
            courseId: course._id,
            subjectcode: course.subjectcode,
            name: course.name,
            attendanceByDay: report[course._id.toString()] || {}
        }));

        res.send(result);
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching attendance report");
    }
}

// const startDate = "2025-08-01";
// const endDate = "2025-08-10";
// const report = await getFacultyAttendanceReport("facultyIdHere", startDate, endDate);
// console.log(report);

// sample outpurt=
// [
//   {
//     "courseId": "64ff2a...",
//     "subjectcode": "CS201",
//     "name": "Data Structures",
//     "attendanceByDay": {
//       "2025-08-01": 35,
//       "2025-08-02": 36,
//       "2025-08-04": 38
//     }
//   },
//   {
//     "courseId": "64ff3b...",
//     "subjectcode": "CS202",
//     "name": "Operating Systems",
//     "attendanceByDay": {
//       "2025-08-01": 33,
//       "2025-08-03": 34,
//       "2025-08-07": 35
//     }
//   }
// ]





// take attendance

const takeAttendance = async (req, res) => {
  try {
    const facultyId = req.result._id; // from auth middleware
    const { courseId, presentStudents } = req.body; 
    // presentStudents = [ObjectId, ObjectId, ...]

    // ✅ Verify faculty teaches this course
    const course = await Course.findOne({ _id: courseId, faculty: facultyId });
    if (!course) {
      return res.status(403).json({ error: "You are not assigned to this course" });
    }

    // ✅ Remove duplicates
    const uniquePresent = [...new Set(presentStudents)];

    // ✅ Insert attendance for each student
    const attendanceDocs = uniquePresent.map(studentId => ({
      student: studentId,
      course: courseId
    }));

    await Attendance.insertMany(attendanceDocs);

    res.json({ message: "Attendance marked successfully", count: attendanceDocs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// get info of this students by course
const studentinmycourse = async (req, res) => {
  try {
    const facultyId = req.result._id
    const courseId = req.params.courseId;

    // check if faculty teaches this course
    const course = await Course.findOne({ _id: courseId, faculty: facultyId }).populate("department");
    if (!course) {
      return res.status(403).json({ error: "You are not assigned to this course" });
    }

    // fetch students from the same department & year
    const students = await User.find({
      role: "student",
      "studentProfile.department": { $in: course.department },
      "studentProfile.year": course.year
    }).select("name emailId studentProfile");

    res.json({ course: course.name, students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get the info of low attendes

module.exports = {getFacultyScheduleGrouped,getFacultyDailyAttendance,getFacultyAttendanceReport,studentinmycourse,takeAttendance}