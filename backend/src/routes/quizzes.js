import {Router} from 'express';
import questions from '../data/questions.json' with {type:'json'};
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import {protect,adminOnly} from '../middleware/auth.js';
import {transition} from '../fsm.js';
const r=Router();
const subjects=['FSWD','CN','FLAT'];
r.get('/catalog',protect,(req,res)=>{
  res.json(subjects.map(subject=>({code:subject,title:({FSWD:'Full Stack Web Development',CN:'Computer Networks',FLAT:'Formal Languages and Automata Theory'})[subject],sets:[1,2,3,4,5].map(setNumber=>({setNumber,questionCount:25}))})));
});
r.post('/submit',protect,async(req,res)=>{
  const {subject,setNumber,answers,durationSeconds}=req.body;
  if(!subjects.includes(subject)||![1,2,3,4,5].includes(Number(setNumber))||!Array.isArray(answers)||answers.length!==25)
    return res.status(400).json({message:'A complete 25-question quiz submission is required.'});
  try{
    let state='ACTIVE'; state=transition(state,'SUBMIT');
    const qs=questions.filter(q=>q.subject===subject&&q.setNumber===Number(setNumber));
    const checked=qs.map(q=>{const a=answers.find(x=>Number(x.questionNumber)===q.number);return {questionNumber:q.number,selectedIndex:Number.isInteger(a?.selectedIndex)?a.selectedIndex:-1,correct:a?.selectedIndex===q.correctIndex};});
    const score=checked.filter(x=>x.correct).length;
    state=transition(state,'EVALUATION_COMPLETE');
    const attempt=await Attempt.create({student:req.user.id,subject,setNumber:Number(setNumber),answers:checked,score,percentage:score*4,durationSeconds:Number.isFinite(Number(durationSeconds))?Math.max(0,Math.min(1200,Math.floor(Number(durationSeconds)))):0,status:score>=13?'Passed':'Needs Improvement'});
    res.status(201).json({attemptId:attempt._id,subject,setNumber,score,total:25,percentage:score*4,status:attempt.status,state});
  }catch(e){res.status(400).json({message:e.message||'Evaluation failed'});}
});
r.get('/attempts/mine',protect,async(req,res)=>{
  const attempts=await Attempt.find({student:req.user.id}).sort({submittedAt:-1}).limit(100);
  res.json(attempts);
});
r.get('/admin/overview',protect,adminOnly,async(req,res)=>{
  const [students,attempts,bySubject]=await Promise.all([
    User.countDocuments({role:'student'}),Attempt.countDocuments(),
    Attempt.aggregate([{$group:{_id:'$subject',attempts:{$sum:1},average:{$avg:'$percentage'}}}])
  ]);
  res.json({students,attempts,bySubject});
});
r.get('/admin/attempts',protect,adminOnly,async(req,res)=>{
  const attempts=await Attempt.find().populate('student','name email').sort({submittedAt:-1}).limit(200);
  res.json(attempts);
});
r.get('/admin/students',protect,adminOnly,async(req,res)=>{
  res.json(await User.find({role:'student'}).select('name email createdAt').sort({createdAt:-1}));
});
r.get('/:subject/:setNumber',protect,(req,res)=>{
  const subject=req.params.subject, setNumber=Number(req.params.setNumber);
  if(!subjects.includes(subject)||!Number.isInteger(setNumber)||setNumber<1||setNumber>5) return res.status(404).json({message:'Quiz set not found'});
  try { transition('READY','START'); } catch { return res.status(400).json({message:'Quiz could not start'}); }
  const qs=questions.filter(q=>q.subject===subject&&q.setNumber===setNumber).map(({number,question,options})=>({number,question,options}));
  res.json({subject,setNumber,durationMinutes:20,questions:qs});
});
export default r;
