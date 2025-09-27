const express=require('express');
const {  signupUser,validationRegistration,resetPassword,forgetPassword,validationLogin, loginUser} = require('../controllers/authController');
const rateLimit=require('express-rate-limit')

const router=express.Router();

const limiter=rateLimit({
    windowMs: 15 * 60 * 1000, 
  max: 5,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
});

router.post("/create-account",limiter,validationRegistration,signupUser)
router.post("/login-account",limiter,validationLogin,loginUser)
router.post('/forget-password',forgetPassword)
router.get("/reset-password",resetPassword)



module.exports = router;
