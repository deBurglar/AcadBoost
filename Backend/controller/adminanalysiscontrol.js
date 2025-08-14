const Department = require('../models/department'); // your department model

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




module.exports = { getFacultyAssignmentsbyCourse ,getAssignmentsByFaculty};
