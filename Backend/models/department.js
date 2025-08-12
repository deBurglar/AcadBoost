const mongoose = require('mongoose')
const {Schema} = mongoose

const departmentSchema = Schema({
    name:{
        type:String,
        required:true,
    },
    year:{
        type:Number,
    },
    routine:[ 
    {
        course:{
            type: Schema.Types.ObjectId,
            ref: 'course',
            required:true
        },
        room:{
            type:Schema.Types.ObjectId,
            ref:'room',
            required:true
        },
        time:{
            type:String,
            required:true
        },
        day:{
            type:String,
            required:true
        }
    }
    ]
},{
    timestamps:true
})

const Department = mongoose.model('department',departmentSchema)
module.exports=Department