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
    code:{
        type:String,
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
        faculty:{
            type:Schema.Types.ObjectId,
            ref:'user',
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
    ],
    createdby:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
},{
    timestamps:true
})

const Department = mongoose.model('department',departmentSchema)
module.exports=Department