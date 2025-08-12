const validator = require("validator")

const validate = (data)=>{
    try{
    const mandatoryData = ['name',"emailId",'password']
    const IsAllowed = mandatoryData.every((k)=>Object.keys(data).includes(k))
    // console.log("enter validation")
    if(!IsAllowed)
        throw new Error("Incomplete Credentials")

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");
}catch(err)
{
    res.send("error"+err.message)
}
}

module.exports = validate