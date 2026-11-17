import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-nu-six-89.vercel.app',
  'https://harshini-723.github.io'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({limit:'100kb'}));

app.use('/api',rateLimit({windowMs:15*60*1000,max:300}));

app.get('/api/health',(req,res)=>res.json({status:'ok',service:'Quiz API'}));

app.use('/api/auth',authRoutes);
app.use('/api/quizzes',quizRoutes);

app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json({message:'Internal server error'});
});

const port=process.env.PORT||5000;

mongoose.connect(process.env.MONGO_URI)
  .then(()=>app.listen(port,()=>console.log(`API running on http://localhost:${port}`)))
  .catch(e=>{
    console.error('MongoDB connection failed:',e.message);
    process.exit(1);
  });
