const redisClient = require("../database/redis")
const User = require("../models/user")
const validate = require('../utils/validate')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const register = async(req,res)=>{
    try{
        validate(req.body)
        const {password} = req.body
        req.body.password = await bcrypt.hash(password,10)
        const user = await User.create(req.body)
        if(!user){
            throw new Error("Unable to create the user")
        }
        const reply = {
        name: user.name,
        emailId: user.emailId,
        _id: user._id,
        role:user.role,
    }
        const token = jwt.sign({_id:user._id,emailId:user.emailId,role:user.role},process.env.JWTKEY,{expiresIn:60*60})
        res.cookie('token',token,{maxAge:60*60*1000})
        res.status(201).json({
            user:reply,
            message:"Registered Successfully"
        })
    }catch(err){
        res.send("Error: "+err.message)
        console.log(err.message)
    }
}

const login = async(req,res)=>{
    try{
        const {emailId,password} = req.body
        // console.log(emailId,password)
        if(!emailId || !password)
            throw new Error("Incomplete Credentials")

        const user = await User.findOne({emailId})
        console.log(user.password)
        const match = await bcrypt.compare(password,user.password)

        if(!match)
            throw new Error("Invalid Credentials")

        const reply = {
            name: user.name,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        const token = jwt.sign({_id:user._id,emailId:user.emailId,role:user.role},process.env.JWTKEY,{expiresIn:60*60})
        res.cookie('token',token,{maxAge:60*60*1000})
        res.status(201).json({
            user:reply,
            message:"Logged In successfully"
        })   
        console.log("logged in") 
}catch(err)
{
    res.send("error"+err.message)
    console.log("error"+err.message)

}
}

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
