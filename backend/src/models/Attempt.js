import mongoose from 'mongoose';
const attemptSchema = new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  subject:{type:String,enum:['FSWD','CN','FLAT'],required:true},
  setNumber:{type:Number,min:1,max:5,required:true},
  answers:[{questionNumber:Number,selectedIndex:Number,correct:Boolean}],
  score:{type:Number,required:true}, total:{type:Number,default:25}, durationSeconds:{type:Number,default:0},
  percentage:{type:Number,required:true}, status:{type:String,enum:['Passed','Needs Improvement'],required:true},
  startedAt:{type:Date}, submittedAt:{type:Date,default:Date.now}
},{timestamps:true});
export default mongoose.model('Attempt',attemptSchema);
