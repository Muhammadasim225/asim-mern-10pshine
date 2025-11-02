const express=require('express');
const {  signupUser,validationRegistration,deleteAccount,logoutUser,resetPassword,forgetPassword,validationLogin,updateUserProfile, loginUser} = require('../controllers/authController');
const rateLimit=require('express-rate-limit');
const { protectedRoutes, checkCurrentUser } = require('../middlewares/protectedRoutes');
const upload = require('../config/multer');

const router=express.Router();

// const limiter=rateLimit({
//     windowMs: 15 * 60 * 1000, 
//   max: 5,
//   message: {
//     success: false,
//     message: "Too many attempts, please try again later",
//   },
// });

router.post("/create-account",
  // limiter
  validationRegistration,signupUser)
router.post("/login-account",
  // limiter,
  validationLogin,loginUser)
router.post('/forget-password',forgetPassword)
router.post("/reset-password",resetPassword)
router.post('/logout', protectedRoutes,logoutUser);
router.delete('/delete-account',protectedRoutes,deleteAccount)
router.put("/update-profile",protectedRoutes,upload.single("avatar"),updateUserProfile)
router.get("/auth/me",protectedRoutes,checkCurrentUser)

module.exports = router;
