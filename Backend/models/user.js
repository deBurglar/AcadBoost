const mongoose = require("mongoose")
const {Schema}= mongoose

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','admin','faculty'],
        default: 'student'
    },
    studentProfile: {
        rollNumber: Number,
        year: Number,
        department:{ 
            type:Schema.Types.ObjectId,
            ref:'department'
        }
    },
    facultyProfile: {
        shortName:{
            type:String
        },
    },
},{
    timestamps:true
})

const User = mongoose.model("user",userSchema)
module.exports = User