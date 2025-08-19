


// ---------------core objectives--------------

// see his routine

// check attendance


// mark attendance 
const markattendancebyQR =  async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId, sessionToken } = req.body;

    // Check session token validity (stored in Redis/DB when faculty generated QR)
    const isValid = await redisClient.get(`attendance:${courseId}:${sessionToken}`);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired QR" });
    }

    // Save attendance
    await Attendance.create({
      student: studentId,
      course: courseId,
    });

    res.json({ message: "Attendance marked successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports={markattendancebyQR}

