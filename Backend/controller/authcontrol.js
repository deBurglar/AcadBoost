const redisClient = require("../database/redis")
const User = require("../models/user")
const validate = require('../utils/validate')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require('node:crypto');


const register = async (req, res) => {
    try {
        validate(req.body);

        const { password, role } = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        // Assign deviceId for students
        let deviceId;
        if (role === 'student') {
            deviceId = crypto.randomBytes(16).toString('hex');
            req.body.studentProfile = {
                ...req.body.studentProfile,
                deviceId
            };
        }

        const user = await User.create(req.body);
        if (!user) {
            throw new Error("Unable to create the user");
        }

        const reply = {
            name: user.name,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };

        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWTKEY,
            { expiresIn: 60 * 60 }
        );

        // Always set token cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
            maxAge: 60 * 60 * 1000
        });

        // If student → also set deviceId cookie
        if (role === 'student') {
            res.cookie('deviceId', deviceId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
                maxAge: 365 * 24 * 60 * 60 * 1000
            });
        }

        res.status(201).json({
            user: reply,
            message: "Registered Successfully"
        });

    } catch (err) {
        res.send("Error: " + err.message);
        console.log(err.message);
    }
};


const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) throw new Error("Incomplete Credentials");

    // Select password and nested deviceId
    const user = await User.findOne({ emailId }).select("+password studentProfile.deviceId");
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Credentials");

    let deviceBound = false;
    const cookieDeviceId = req.cookies?.deviceId || null;

    if (user.role === "student") {
      const storedDeviceId = user.studentProfile?.deviceId;

      if (!storedDeviceId) {
        // First time binding this device
        const newDeviceId = crypto.randomBytes(16).toString("hex");
        user.studentProfile.deviceId = newDeviceId;
        await user.save();

        res.cookie("deviceId", newDeviceId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
          maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        });

        deviceBound = true;
      } else if (cookieDeviceId && cookieDeviceId === storedDeviceId) {
        // Same device → refresh cookie
        res.cookie("deviceId", storedDeviceId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        deviceBound = true;
      } else {
        // Different device → deny
        deviceBound = false;
      }
    }

    const reply = {
      name: user.name,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWTKEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({
      user: reply,
      message: "Logged In successfully",
      deviceBound,
    });

    console.log("logged in");
  } catch (err) {
    res.send("error" + err.message);
    console.log("error" + err.message);
  }
};



const logout = async (req,res) => {
    try {
        const {token} = req.cookies
        const payload = jwt.decode(token)
        console.log(payload)
        await redisClient.set(`token:${token}`,"Blocked")
        await redisClient.expireAt(`token:${token}`,payload.exp)

        res.cookie('token',null,{expiresIn:new Date(Date.now())})
        res.send('Logged out ')
    } catch (error) {
        res.send('error: '+error.message)
    }
}

module.exports = {register,logout,login}
