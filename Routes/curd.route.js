const express =require("express");
const bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken");
require("dotenv").config();
const{CurdModel}=require("../model/crud.model")
const curdRouter=express.Router();
curdRouter.use(express.json())
curdRouter.get("/",async(req,res)=>{
    res.send();
})

curdRouter.patch("/update",async(req,res)=>{
    res.send()
})
curdRouter.delete("/delete",async(req,res)=>{
    res.send()
})

module.exports={
    curdRouter
}