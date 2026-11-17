import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {protect} from '../middleware/auth.js';
const r=Router();
const tokenFor=u=>jwt.sign({id:u._id,role:u.role,name:u.name,email:u.email},process.env.JWT_SECRET,{expiresIn:'8h'});
r.post('/register',async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if(!name?.trim()||!/^\S+@\S+\.\S+$/.test(email||'')||!password||password.length<8)
      return res.status(400).json({message:'Enter a name, valid email and password (minimum 8 characters).'});
    if(await User.findOne({email})) return res.status(409).json({message:'Email is already registered.'});
    const user=await User.create({name,email,password:await bcrypt.hash(password,12),role:'student'});
    res.status(201).json({token:tokenFor(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(e){res.status(500).json({message:'Registration failed'});}
});
r.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  const user=await User.findOne({email:email?.toLowerCase()});
  if(!user||!await bcrypt.compare(password||'',user.password)) return res.status(401).json({message:'Invalid email or password.'});
  res.json({token:tokenFor(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}});
});
r.get('/me',protect,async(req,res)=>res.json({user:req.user}));
export default r;
