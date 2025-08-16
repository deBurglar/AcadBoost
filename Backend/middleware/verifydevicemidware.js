const User = require("../models/user")


const verifyDevice = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    const deviceIdCookie = req.cookies?.deviceId;

    if (!token || !deviceIdCookie) {
      return res.status(401).json({ error: 'Missing token or device ID' });
    }

    const payload = jwt.verify(token, process.env.JWTKEY);
    const user = await User.findById(payload._id).select('+studentProfile.deviceId');

    if (
      !user ||
      (user.role === 'student' && user.studentProfile.deviceId !== deviceIdCookie)
    ) {
      return res.status(403).json({ error: 'Device not recognized' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = verifyDevice;
