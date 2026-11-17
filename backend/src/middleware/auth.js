import jwt from 'jsonwebtoken';
export function protect(req,res,next){
  const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');
  if(!token) return res.status(401).json({message:'Authentication required'});
  try { req.user=jwt.verify(token,process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({message:'Invalid or expired token'}); }
}
export function adminOnly(req,res,next){
  if(req.user?.role!=='admin') return res.status(403).json({message:'Administrator access required'});
  next();
}
