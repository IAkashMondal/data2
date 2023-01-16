const mongoose=require("mongoose");
const CurdSchema= mongoose.Schema({
    title:String,
    body:String,
    device:String,
    UserId:String
    
},
{
    versionKey:false
})

const CurdModel=mongoose.model("curds",CurdSchema);
module.exports={
    CurdModel
}