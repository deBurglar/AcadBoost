const jwt = require("jsonwebtoken")
const User = require("../models/user")
const redisClient = require("../database/redis")

const authmidware = async(req,res,next)=>{
    try {
        const {token} = req.cookies
        if(!token)
            throw new Error("No token Found!")
        const payload = jwt.verify(token,process.env.JWTKEY)
        const {_id } = payload
        if(!_id)
            throw new Error("Invalid token")

        const Isblocked = await redisClient.exists(`token:${token}`)

        if(Isblocked)
            throw new Error("Invalid token")

        const result = await User.findById(_id)
        if(!result)
            throw new Error("No user found")
        req.result = result
        next()

    } catch (error) {
        res.send("Error: "+error.message)
    }
}

module.exports = authmidware;