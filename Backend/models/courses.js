const mongoose = require("mongoose")
const {Schema}= mongoose

const courseSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    department:{
        type:[Schema.Types.ObjectId],
        ref:'department',
        // required:true
    },
    subjectcode:{
        type:String,
    },
    year:{
        type:Number
    },
    faculty:{
        type:[Schema.Types.ObjectId],
        ref:'user'
    },
    isLab: {
        type: Boolean,
        default: false
    },
    createdby:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
},{
    timestamps:true
})

const Course = mongoose.model('course',courseSchema)
module.exports=Course