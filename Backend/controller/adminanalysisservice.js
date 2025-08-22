const User = require("../models/user");

const fetchStudentCountPerYear = async (req, res, raw = false) => {
  try {
    const yearData = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$studentProfile.year", totalStudents: { $sum: 1 } } },
      { $project: { year: "$_id", totalStudents: 1, _id: 0 } }
    ]);

    if (raw) return yearData;
    return res.json({ success: true, data: yearData });
  } catch (err) {
    console.error("Error fetching student counts by year:", err);
    if (raw) throw err;
    return res.status(500).json({ error: "Failed to fetch student counts by year" });
  }
};

const fetchStudentCountForAllDepartments = async (req, res, raw = false) => {
  try {
    const deptData = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$studentProfile.department", totalStudents: { $sum: 1 } } },
      {
        $lookup: {
          from: "departments",  // name of your Department collection
          localField: "_id",
          foreignField: "_id",
          as: "deptInfo"
        }
      },
      { $unwind: "$deptInfo" },
      { $project: { department: "$deptInfo.name", totalStudents: 1, _id: 0 } }
    ]);

    if (raw) return deptData;
    return res.json({ success: true, data: deptData });
  } catch (err) {
    console.error("Error fetching student counts by department:", err);
    if (raw) throw err;
    return res.status(500).json({ error: "Failed to fetch student counts by department" });
  }
};


module.exports={fetchStudentCountPerYear,fetchStudentCountForAllDepartments}