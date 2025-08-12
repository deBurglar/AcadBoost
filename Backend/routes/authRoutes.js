const express = require("express")
const authRouter = express.Router()
const {register,login,logout} = require("../controller/authcontrol")
const authmidware = require("../middleware/authmidware")
// const adminmidware = require("../middleware/adminmidware")


authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",authmidware,logout)
// authRouter.post("/admin",authmidware,adminmidware,adminRegister)
// authRouter.delete("/deleteProfile",authmidware,deleteProfile)

authRouter.get('/check',authmidware,(req,res)=>{
    const reply = {
        name:req.result.name,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"valid user"
    })
})

module.exports = authRouter