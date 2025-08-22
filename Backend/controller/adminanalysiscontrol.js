const Department = require('../models/department');
const Attendance = require('../models/attendance');
const User = require('../models/user');
const Room = require('../models/room');

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getDepartmentTimetable = async (req, res) => {
  try {
    const { deptId } = req.params;

    // Validate deptId
    if (!deptId) {
      return res.status(400).json({ message: "Department ID is required" });
    }

    // Fetch department with populated timetable
    const department = await Department.findById(deptId)
      .populate({
        path: "routine.course", // populate course
        model: "course",
        select: "name subjectcode isLab"
      })
      .populate({
        path: "routine.room", // populate room
        model: "room",
        select: "name capacity type"
      })
      .populate({
        path: "routine.faculty", // populate faculty
        model: "user",
        select: "name"
      });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      success: "Timetable fetched successfully",
      department: {
        name: department.name,
        year: department.year,
        code: department.code,
        timetable: department.routine
      }
    });

  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getFaculties = async (req, res) => {
  try {
    // only users with role = faculty
    const faculties = await User.find({ role: "faculty" })
      .select("_id name emailId facultyProfile");

    return res.status(200).json({
      success: true,
      data: faculties,
    });
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const room = await Room.find({});
    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Controller to get faculty-course assignments
const getFacultyAssignmentsbyCourse = async (req, res) => {
  try {
    // Fetch all departments and populate the routine with course and faculty info
    const departments = await Department.find()
      .populate({
        path: 'routine.course',
        select: 'name subjectcode', // only pick the fields you want
      })
      .populate({
        path: 'routine.faculty',
        select: 'name emailId facultyProfile.shortName role', // only pick faculty info
      });

    // Format the response
    const assignments = departments.map(dept => ({
      departmentName: dept.name,
      year: dept.year,
      code: dept.code,
      courses: dept.routine.map(slot => ({
        courseName: slot.course.name,
        courseCode: slot.course.subjectcode,
        facultyName: slot.faculty.name,
        facultyShortName: slot.faculty.facultyProfile?.shortName || '',
        facultyEmail: slot.faculty.emailId,
        day: slot.day,
        time: slot.time,
      }))
    }));

    res.status(200).json(assignments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

// Get the report faculty wise..
const getAssignmentsByFaculty = async (req, res) => {
  try {
    // Fetch all departments with routine populated
    const departments = await Department.find()
      .populate({
        path: 'routine.course',
        select: 'name subjectcode',
      })
      .populate({
        path: 'routine.faculty',
        select: 'name emailId facultyProfile.shortName role',
      });

    // Map to faculty-based structure
    const facultyMap = {};

    departments.forEach(dept => {
      dept.routine.forEach(slot => {
        if (slot.faculty) {
          const facultyId = slot.faculty._id.toString();
          if (!facultyMap[facultyId]) {
            facultyMap[facultyId] = {
              facultyName: slot.faculty.name,
              facultyShortName: slot.faculty.facultyProfile?.shortName || '',
              facultyEmail: slot.faculty.emailId,
              courses: []
            };
          }

          facultyMap[facultyId].courses.push({
            courseName: slot.course.name,
            courseCode: slot.course.subjectcode,
            departmentName: dept.name,
            departmentCode: dept.code,
            year: dept.year,
            day: slot.day,
            time: slot.time
          });
        }
      });
    });

    // Convert the map to an array
    const result = Object.values(facultyMap);

    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch faculty assignments" });
  }
};


// Get student attendance department wise
const getAttendanceByDepartment = async (req, res) => {
  try {
    // Populate student, their department, and course info
    const records = await Attendance.find()
      .populate({
        path: 'student',
        select: 'name emailId studentProfile',
        populate: {
          path: 'studentProfile.department',
          select: 'name code year'
        }
      })
      .populate({
        path: 'course',
        select: 'name subjectcode'
      });

    // Group by department
    const departmentMap = {};

    records.forEach(record => {
      const dept = record.student?.studentProfile?.department;
      if (!dept) return; // Skip if no department assigned

      const deptId = dept._id.toString();

      if (!departmentMap[deptId]) {
        departmentMap[deptId] = {
          departmentName: dept.name,
          departmentCode: dept.code,
          year: dept.year,
          students: {}
        };
      }

      const studentId = record.student._id.toString();
      if (!departmentMap[deptId].students[studentId]) {
        departmentMap[deptId].students[studentId] = {
          studentName: record.student.name,
          studentEmail: record.student.emailId,
          rollNumber: record.student.studentProfile.rollNumber,
          attendance: []
        };
      }

      // Push attendance record
      departmentMap[deptId].students[studentId].attendance.push({
        courseName: record.course.name,
        courseCode: record.course.subjectcode,
        date: record.createdAt // From timestamps
      });
    });

    // Convert map to array & students object to array
    const result = Object.values(departmentMap).map(dept => ({
      ...dept,
      students: Object.values(dept.students)
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

const getStudentCountByDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;

    if (!deptId) {
      return res.status(400).json({ message: "Department ID is required" });
    }

    // Get department name
    const department = await Department.findById(deptId).select("name");
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Count students
    const totalStudents = await User.countDocuments({
      role: "student",
      "studentProfile.department": deptId,
    });

    return res.status(200).json({
      department: department.name,
      totalStudents,
    });
  } catch (error) {
    console.error("Error fetching student count by department:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// 
// controller: getStudentCountForAllDepartments
const getStudentCountForAllDepartments = async (req, res) => {
  try {
    // Fetch all departments
    const departments = await Department.find().select("name _id");

    // For each department, count students
    const results = await Promise.all(
      departments.map(async (dept) => {
        const totalStudents = await User.countDocuments({
          role: "student",
          "studentProfile.department": dept._id,
        });

        return {
          department: dept.name,
          totalStudents,
        };
      })
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching student counts by department:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get number of students per year (across all departments)
const getStudentCountPerYear = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: "$studentProfile.year",   // group by year
          totalStudents: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // sort by year ascending
    ]);

    // Format result
    const formatted = result.map((item) => ({
      year: item._id,
      totalStudents: item.totalStudents,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching student count per year:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStudentCountPerYearPerDepartment = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: {
            department: "$studentProfile.department",
            year: "$studentProfile.year",
          },
          totalStudents: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",          // collection name in MongoDB
          localField: "_id.department",
          foreignField: "_id",
          as: "departmentInfo",
        },
      },
      { $unwind: "$departmentInfo" },
      { $sort: { "_id.department": 1, "_id.year": 1 } },
    ]);

    // Format response
    const formatted = result.map((item) => ({
      departmentId: item._id.department,
      departmentName: item.departmentInfo.name,
      year: item._id.year,
      totalStudents: item.totalStudents,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching students per year per department:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Attendance per dept
const getAttendanceGroupedByDepartment = async (req, res) => {
  try {
    const result = await Attendance.aggregate([
      // Join with student (User)
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },

      // Join with course
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },

      // Join with department (from student's profile)
      {
        $lookup: {
          from: "departments",
          localField: "studentInfo.studentProfile.department",
          foreignField: "_id",
          as: "departmentInfo",
        },
      },
      { $unwind: "$departmentInfo" },

      // Group by student + course → attendance count
      {
        $group: {
          _id: {
            departmentId: "$departmentInfo._id",
            departmentName: "$departmentInfo.name",
            departmentYear: "$departmentInfo.year",
            studentId: "$studentInfo._id",
            studentName: "$studentInfo.name",
            courseId: "$courseInfo._id",
            courseName: "$courseInfo.name",
          },
          attendedSessions: { $sum: 1 },
        },
      },

      // Lookup total sessions held for that course
      {
        $lookup: {
          from: "attendances",
          let: { courseId: "$_id.courseId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$course", "$$courseId"] } } },
            { $group: { _id: "$sessionKey" } }, // unique sessions
            { $count: "totalSessions" },
          ],
          as: "courseSessions",
        },
      },
      {
        $addFields: {
          totalSessions: {
            $ifNull: [{ $arrayElemAt: ["$courseSessions.totalSessions", 0] }, 0],
          },
        },
      },

      // Calculate %
      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              { $eq: ["$totalSessions", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$attendedSessions", "$totalSessions"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },

      // Group courses under each student
      {
        $group: {
          _id: {
            departmentId: "$_id.departmentId",
            departmentName: "$_id.departmentName",
            departmentYear: "$_id.departmentYear",
            studentId: "$_id.studentId",
            studentName: "$_id.studentName",
          },
          courses: {
            $push: {
              courseId: "$_id.courseId",
              courseName: "$_id.courseName",
              attendedSessions: "$attendedSessions",
              totalSessions: "$totalSessions",
              attendancePercentage: "$attendancePercentage",
            },
          },
        },
      },

      // Group students under department
      {
        $group: {
          _id: {
            departmentId: "$_id.departmentId",
            departmentName: "$_id.departmentName",
            departmentYear: "$_id.departmentYear",
          },
          students: {
            $push: {
              studentId: "$_id.studentId",
              studentName: "$_id.studentName",
              courses: "$courses",
            },
          },
        },
      },

      { $sort: { "_id.departmentName": 1, "students.studentName": 1 } },
    ]);

    const formatted = result.map((dept) => ({
      departmentId: dept._id.departmentId,
      departmentName: dept._id.departmentName,
      departmentYear: dept._id.departmentYear,
      students: dept.students,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// controllers/attendanceStats.controller.ts

const getCourseAttendanceStatsByDepartment = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $lookup: {
          from: "departments",
          localField: "course.department",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: "$department" },
      {
        $group: {
          _id: {
            deptId: "$department._id",
            deptName: "$department.name",
            deptYear: "$department.year",
            courseId: "$course._id",
            courseName: "$course.name",
          },
          totalSessions: { $addToSet: "$sessionKey" }, // unique sessions
          totalAttendance: { $sum: 1 }, // total student attendance records
        },
      },
      {
        $project: {
          _id: 0,
          departmentId: "$_id.deptId",
          departmentName: "$_id.deptName",
          departmentYear: "$_id.deptYear",
          courseId: "$_id.courseId",
          courseName: "$_id.courseName",
          totalSessions: { $size: "$totalSessions" },
          totalAttendance: 1,
        },
      },
      {
        $group: {
          _id: {
            departmentId: "$departmentId",
            departmentName: "$departmentName",
            departmentYear: "$departmentYear",
          },
          courses: {
            $push: {
              courseId: "$courseId",
              courseName: "$courseName",
              totalSessions: "$totalSessions",
              totalAttendance: "$totalAttendance",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          departmentId: "$_id.departmentId",
          departmentName: "$_id.departmentName",
          departmentYear: "$_id.departmentYear",
          courses: 1,
        },
      },
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getFacultyAssignmentsbyCourse ,getAssignmentsByFaculty,getAttendanceByDepartment,getFaculties,getDepartments,getDepartmentTimetable,getRooms,
  getStudentCountByDepartment,getStudentCountPerYear,getStudentCountPerYearPerDepartment,
  getAttendanceGroupedByDepartment,getCourseAttendanceStatsByDepartment,getStudentCountForAllDepartments
};