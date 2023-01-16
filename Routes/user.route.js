const express = require('express');
const bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken");
require("dotenv").config();
const {UserModel}=require("../model/user.model")

const UserRouter =express.Router()


 UserRouter.use(express.json());

UserRouter.post("/register",async(req,res)=>{
    const {email,password,name,gender}= req.body;
    // UserModel.findOne({email: email})
    // .then(user => {
    //   if (user) {
    //     return res.send({email: "Email already exists"});
    //   }
    //   else{
        try{
            bcrypt.hash(password, 6, async(err, new_hash_pass)=> {
                if(err){
                    console.log(err);
                }
                else{
                    const user= new UserModel({email,password:new_hash_pass,name,gender});
                   await  user.save();
                    
                    res.send({"massege":`User register`});
                }
            });
            
    
        }
        catch(err){
            console.log({"massge":"register link not working",err});
            res.send(err)
        }
    //   }
    // })
})

UserRouter.post("/login",async(req,res)=>{
    const {email,password}= req.body;
    try{
        const user= await UserModel.find({email});
        if(user.length>0){

            bcrypt.compare(password, user[0].password, (err, result) =>{
               if(result){
                const token = jwt.sign({ payload_course: 'nem11' }, process.env.Secrect_key);
                console.log(user,"login user deatils");
                res.send({"massege":"User login","token":token});
               }
               else{
                res.send({"massege":"wrong credentials"});
               }
            });
        }
        else{
            res.send({"massege":"wrong credentials"});
        }
    }
    catch(err){
        console.log({"massege":"login faild",err});
        res.send(err)
    }
})
module.exports={
    UserRouter
}
