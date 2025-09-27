const express=require('express');
const { signupUser,validationRegistration,} = require('../controllers/authController');
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


module.exports = router;
