const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser");
require("dotenv").config()
const authRouter = require('./routes/authRoutes')
const main = require("./database/maindb")
const redisClient = require("./database/redis")
const adminRouter = require('./routes/adminRoutes');
const facultyRouter = require('./routes/facultyroutes');


app.use(cors({
    origin:[
        "http://localhost:5173"],
    credentials:true
}))

app.use(express.json())
app.use(cookieParser());
app.use("/auth",authRouter);
app.use('/admin',adminRouter)
app.use('/faculty',facultyRouter)

const InitializeConnection = async()=>{
    try {
        await Promise.all([redisClient.connect(),main()])
        console.log("DB connected: ")
        app.listen(process.env.PORT,()=>{
            console.log("Port Activated: ")
        })
    } catch (error) {
        console.log("Error: "+error.message)
    }
}

InitializeConnection()

