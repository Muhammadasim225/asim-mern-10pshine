const express=require('express');
const passport=require('passport');
const router=express.Router();
const jwt=require('jsonwebtoken');
const { protectedRoutes } = require('../middlewares/protectedRoutes');
const logger = require('../logs/logging');
router.get('/google',passport.authenticate("google",{scope:["profile","email"]}))

router.get("/google/callback",
    passport.authenticate("google",{session:false}),(req,res)=>{
        try{
            const token=jwt.sign({id:req.user.id,email_address:req.user.email_address,avatar:req.user?.avatar,full_name: req.user.full_name},process.env.JWT_SECRET_KEY,{expiresIn:'1h'})

            logger.info(
              {
                action: 'google_oauth_success',
                userId: req.user.id,
                email: req.user.email_address,
              },
              'Google OAuth successful, JWT generated'
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax', 
                maxAge: 60 * 60 * 1000 
              });                

            res.redirect(`${process.env.CLIENT_URL}`)

        }
        catch(err){
            logger.error(
                {
                  action: 'google_oauth_error',
                  error: err.message,
                  stack: err.stack,
                },
                'Error during Google OAuth callback'
              );
              return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)
          
        }
    }
)

router.get('/me',protectedRoutes,(req,res)=>{
    logger.info(
        {
          action: 'fetch_authenticated_user',
          userId: req.user?.id,
          email: req.user?.email_address,
        },
        'Authenticated user data accessed'
      );
    res.json({success:true,user:req.user})
})

module.exports=router;

