const user = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')
const authAdmin = require('../middleware/authAdmin'); 

exports.create =  async (req,res,next)=>
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg});
      }
    user.findOne({email:req.body.email}).then(result=>{
        //console.log(result)
        if(result)
        {
            //return 1;
            //return res.status(403).json({'message':"email already exist"});
            const msg = new Error("Email already exist");
            msg.statusCode = 403;
            throw msg;
        }
        return bcrypt.hash(req.body.password,12);
    }).then(hpass=>
    {
        //console.log(hpass);
        if(hpass)
        {
        const data = {"email":req.body.email,"password":hpass,"name":req.body.name,"role":req.body.role};
        const User = new user(data);
        return User.save();
        }
    }).then(result=>
        {
            //console.log(result);
            data = result;
            if(result)
            {
                res.status(201).json({"message":"user created","User":data});
              };
               
            
    
        }).catch(err=>
            {
                const code = err.statusCode || 500;
                //console.log(err.message);
                res.status(code).json({"message":err.message})
            });
}

exports.login = (req,res,next)=>
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg});
      }
  const check = user.findOne({'email':req.body.email}).then(result=>{
    if(result)
    {
        //console.log(result);
        data = result;
        user_role = result.role;
        return bcrypt.compare(req.body.password,result.password);
    }
    else
    {
      return res.status(403).json({"msg":"please enter correct email"});
    }
  }).then(check=>{
    console.log(check);
    if(check)
    {
        if(data.role == 1)
        {
            const token = jwt.sign({"email":data.email,"_id":data._id,'userType':'admin'},'secret_key',{"expiresIn":"1h"})
            res.status(200).json({"message":"loginned Successfully","token":token,"user":data });
        }
        else if(data.role == 2)
        {
            const token = jwt.sign({"email":data.email,"_id":data._id,'userType':'user'},'secret_key',{"expiresIn":"1h"})
            res.status(200).json({"message":"loginned Successfully","token":token,"user":data });
        }
      
       
    }
    else{
        res.status(403).json({"message":"your email/password is not correct"});
    }

  }).catch(error=>
    {
        console.log(error);
        res.status(500).json({"message":"login failed"});
    });
}

exports.list = async(req,res,next)=>
{
    try
    {
        const take = req.query.perPage;
        const skip = (req.query.perPage*req.query.page)-req.body.perPage;
        const total = await user.find().countDocuments();
        const data = await user.find().skip(skip).limit(take);
      if(data)
      {
        return res.status(200).json({'users':data,total:total,message:'users found'});
      }
      else
      {
        return res.status(404).json({'users':data,total:total,message:'users not found'});
      }
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
}