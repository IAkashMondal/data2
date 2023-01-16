const monggose =require("mongoose");
require("dotenv").config();
const connection=monggose.connect(process.env.mongourl)
module.exports={
    connection
}