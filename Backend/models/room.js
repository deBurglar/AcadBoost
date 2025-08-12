const mongoose = require('mongoose')
const {Schema} = mongoose


const roomSchema = Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
    },
    capacity:{
        type:Number,
    },
    building:{
        type:String
    }
},{ 
    timestamps:true
})

const Room = mongoose.model('room',roomSchema)
module.exports=Room