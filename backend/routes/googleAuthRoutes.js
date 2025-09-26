const express=require('express');
const passport=require('passport');
const router=express.Router();
const jwt=require('jsonwebtoken');
const { protectedRoutes } = require('../middlewares/protectedRoutes');
router.get('/google',passport.authenticate("google",{scope:["profile","email"]}))

router.get("/google/callback",
    passport.authenticate("google",{session:false}),(req,res)=>{
        try{
            const token=jwt.sign({id:req.user.id,email_address:req.user.email},process.env.JWT_SECRET_KEY,{expiresIn:'1h'})
            res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`)

        }
        catch(err){
            console.error("Google login error",err);
            return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)
          
        }
    }
)

router.get('/me',protectedRoutes,(req,res)=>{
    res.json({success:true,user:req.user})
})

module.exports=router;

