const express = require('express');
const{connection}=require("./configs/db")
require("dotenv").config();
const UserRouter = require('./Routes/user.route');
const{curdrouter}=require("./Routes/curd.route")

const{CurdModel}=require("./model/crud.model")
const{UserModel}=require("./model//user.model");
    
    const {authorization}=require("./middleware/authorization");
const cors = require('cors');

const app=express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send();
    })
// app.use('/users', UserRouter);
// app.use("/post",curdrouter)


// regiser and login--------------------->


app.post("/users/register",async(req,res)=>{
    const {email,password,name,gender}= req.body;
    UserModel.findOne({email: email})
    .then(user => {
      if (user) {
        return res.send({email: "Email already exists"});
      }
      else{
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
      }
    })
})

app.post("/users/login",async(req,res)=>{
    const {email,password}= req.body;
    try{
        const user= await UserModel.find({email});
        if(user.length>0){

            bcrypt.compare(password, user[0].password, (err, result) =>{
               if(result){
                const token = jwt.sign({ Userid:user[0]._id }, process.env.Secrect_key);
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

// curd link-------------------------------->
app.use(authorization)

app.get("/posts",async(req,res)=>{
    res.send();
})
app.get("/posts/create",async(req,res)=>{
    const payload=req.body;
    try{
        const post = new CurdModel(payload);
        await post.save();
     
        }
    catch(err){
        console.log({"massge":"log oin first",err});
        res.send(err)
    }
})

app.patch("/posts/update/:id",async(req,res)=>{
    const ID = req.params.id;
    const note =await CurdModel.findOne({"_id":ID})
    const noteId=note.Userid;
    const loginId=req.body.UserID
    const payload = req.body;
    try{
        if(loginId !==noteId){
            res.send("not authorised")
        }
        else{

        
        await CurdModel.findByIdAndUpdate({_id:ID},payload);
        res.send(`curd Updated. The Id is: ${ID}`);
        }
    }
    catch(err){
        res.status(403).send({"err":"something went wrong"})
    }
})
app.delete("/posts/delete/:id",async(req,res)=>{
    const ID = req.params.id;
    const note =await CurdModel.findOne({"_id":ID})
    const noteId=note.Userid;
    const loginId=req.body.UserID
    try{
        if(loginId !==noteId){
            res.send("not authorised")
        }
        else{
        await CurdModel.findByIdAndDelete({_id:ID});
        res.send(`curd Deleted. The Id is: ${ID}`);
    }
    }
    catch(err){
        res.status(703).send({"err":"something went wrong"})
    }
})

app.listen(process.env.port,async()=>{

    try{
        await connection ;
        console.log("Connected to Db");
    }
    catch(err){
        console.log(`SOMETING WENT WRONG WHILE LISTENING AT PORT ${process.env.port}`)
    }
    console.log(`lissten on ${process.env.port}`);
})