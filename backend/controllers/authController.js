const db=require('../config/database')
const {Sequelize} = require('sequelize');
const {sequelize}=require('sequelize');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {body,validationResult}=require('express-validator')
const nodemailer=require('nodemailer');
const User=db.user
const crypto=require('crypto');
const logger = require('../logs/logging');



const sendResetPasswordMail=async(name,email,token)=>{
  try{
    const transporter=nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    logger.info(
      { action: 'email_transporter_created', service: 'gmail' },
      'Email transporter created successfully'
    );
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    const mailOptions={
      from:process.env.EMAIL_USER,
      to:email,
      subject:'For Reset Password',
      html: `
      <h3>Hello ${name},</h3>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info({action:"email_sent",response:info.response})
  }
  catch (err) {
    logger.error({action:"reset_password_mail_error",errorMessage:err.message},"Send reset password mail error")
  }

}


const validationLogin = [
  body("email_address")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

const validationRegistration = [
  body("full_name")
  .trim()
  .notEmpty()
  .withMessage("Full Name is required")
  .isLength({ min: 2, max: 50 })
  .withMessage("Full Name must be between 2 and 50 characters"),
    
    body("email_address")
      .notEmpty()
      .withMessage("Email Address is required")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .trim(),
  
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 30 })
      .withMessage("Password must be between 6 and 30 characters long"),
  ];



const signupUser=async(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(
        {
          action: "validation_failed",
          validationErrors: errors.array().map(err => ({
            field: err.param,
            message: err.msg
          }))
        },
        "Request validation failed"
      );
      
        return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
      
        try {
          const { full_name, email_address, password } = req.body;
          const hashedPassword=await bcrypt.hash(password,10)
          logger.info({action:"hashed_password"},"Password hashed successfully")
          logger.info({ action: "check_existing_user", email_address }, "Checking if user already exists");
          const existingUser = await User.findOne({ where: { email_address } });
          if (existingUser) {
            logger.info({action:"yes_exist_user",user:existingUser.id},"Yes, user exist in the database")
            return res.status(400).json({
              success: false,
              message: "Email already registered",
            });
          }
          logger.warn({action:"not_exist_user"},"No, user not exist in the database")

          logger.info({action:"attempting_to_create_new_user"},"Start attmept to create new user")

          const newUser = await User.create({ full_name, email_address, password:hashedPassword });
          logger.info({action:"created_user_success",userId:newUser.id},"User created successfully")
      
          res.status(201).json({
            success: true,
            message: "Account registered successfully",
            user: {
              id: newUser.id,
              full_name: newUser.full_name,
              email_address: newUser.email_address,
            },
          });
        } catch (err) {
          logger.error({action:"signup_error",error:err.message,stack:err.stack},"Signup Error")
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      };

      
      const loginUser = async (req, res) => {
        logger.info({ userEmail: req.body.email_address }, 'User login attempt');
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.warn({
            userEmail: req.body.email_address,
            errorCount: errors.array().length,
            validationErrors: errors.array()
          }, "Login Validation Failed");
          
          return res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        }
      
        try {
          const { email_address, password } = req.body;
      
          // Email ko lowercase mein convert karo for consistency
          const normalizedEmail = email_address.toLowerCase().trim();
      
          const existingUser = await User.findOne({
            where: { email_address: normalizedEmail }
          });
      
          if (!existingUser) {
            logger.warn({ userEmail: normalizedEmail }, 'User not found during login');
            return res.status(404).json({
              success: false,
              message: "User not registered"
            });
          }
      
          const isMatch = await bcrypt.compare(password, existingUser.password);
          if (!isMatch) {
            logger.warn({ 
              userId: existingUser.id, 
              userEmail: normalizedEmail 
            }, 'Invalid password attempt');
            return res.status(401).json({
              success: false,
              message: "Invalid credentials"
            });
          }
      
          const token = jwt.sign(
            { 
              id: existingUser.id, 
              email_address: existingUser.email_address,   
              avatar: existingUser?.avatar,      
              full_name: existingUser.full_name
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
      
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Production mein true rakho
            sameSite: 'lax', 
            maxAge: 60 * 60 * 1000,
          });
      
          logger.info({ 
            userId: existingUser.id, 
            userEmail: existingUser.email_address, 
            fullName: existingUser.full_name 
          }, 'User logged in successfully');
      
          return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
              id: existingUser.id,
              full_name: existingUser.full_name,
              email_address: existingUser.email_address,
              avatar: existingUser.avatar
            },
            token, // Frontend ke liye bhi token bhej rahe hain
          });
      
        } catch (err) {
          logger.error({ 
            userEmail: req.body.email_address, 
            error: err.message, 
            stack: err.stack 
          }, 'Login process failed');
          
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      };

      const forgetPassword=async(req,res)=>{
        logger.info({userEmail:req.body.email_address},"User attempt to forget the password")
        const {email_address}=req.body;
        logger.info({userEmail:req.body.email_address},"User forget password attempt started")
        try{
          const findEmail=await User.findOne({where:{
            email_address
          }})
          logger.info({userEmail:findEmail},"Attempt to start find User Email from db")
          if(findEmail){
            const token = crypto.randomBytes(32).toString("hex");
            logger.info({tokenPrefix:token.substring(0,8)},"Token generated successfully for user")
            const expiryTime = new Date(Date.now() + 15 * 60 * 1000); 
            findEmail.resetToken=token;
            findEmail.resetTokenExpiry=expiryTime;


            await findEmail.save();
            sendResetPasswordMail(findEmail.full_name,findEmail.email_address,token)
            logger.info({userEmail:findEmail.email_address,fullName:findEmail.full_name},"Successfully forgot the password")

            return res.status(200).json({
              success: true,
              message: "Reset password email sent successfully",
            });

          }
          else{
            logger.warn({userEmail:findEmail},"User not found of this email address")
            res.status(404).json({message:"This email does not exists"})
            
          }

        }
        catch (err) {
          logger.error({userEmail:req.body.email_address,stack:err.stack,error:err.message},"Error on forget the password:");
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      }
      const resetPassword=async(req,res)=>{
        const token=req.query.token;
        if (!token) {
          logger.warn({ action: 'password_reset' }, "No token provided in query params");
          return res.status(400).json({ success: false, message: "Token is required" });
        }
        try{
          logger.info(
            { 
              tokenPrefix: token.substring(0, 8) + '...', 
              tokenLength: token.length,                 
              action: 'password_reset_attempt'            
            }, 
            "Password reset token received and processing started"
          );
          const findToken=await User.findOne({where:{resetToken:token}})
          if(findToken){
            logger.info({tokenPrefix:findToken.resetToken.substring(0,8)+"...",action: 'password_reset'},"Token we found in db")
            const password=req.body.password;
            logger.info({ action: 'password_received' }, "Password received in request body");
            const hashedPassword=await bcrypt.hash(password,10)
            logger.info({ action: 'password_hashed' }, "Password successfully hashed");

            await User.update(
              {
                password: hashedPassword,
                resetToken: "",
                resetTokenExpiry: null,
              },
              {
                where: { id: findToken.id },
              }
            );
            
            const updatedUser = await User.findByPk(findToken.id); 
            logger.info({ userId: updatedUser.id, action: 'password_reset_complete' }, "User password has been updated");
            res.status(200).json({ message: "Password has been reset", data: updatedUser });



          }
          else{
            logger.warn({ action: 'password_reset' }, "No token provided in query params");
            res.status(404).json({message:"This token does not exists"})
            

          }

        }
        catch (err) {
          logger.error({ 
            tokenPrefix: token.substring(0, 8) + '...', 
            error: err.message, 
            stack: err.stack 
          }, "Database search for reset token failed");
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }


      }

      const logoutUser = (req, res) => {
        res.clearCookie('token', {
          httpOnly: true,
          // secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        logger.info(`User logged out: ${req.user?.id || 'Unknown user'}`)
        res.status(200).json({ message: 'Logged out successfully' });
      };

      const updateUserProfile=async(req,res)=>{
        try{
          const userId = req.user.id; 
          const { full_name, email_address } = req.body;
          const user = await User.findByPk(userId);
          if (!user) {
            logger.warn({action:"not_found"},"User not found")
      return res.status(404).json(user);
    }
    else{
      if(full_name!==undefined){
        user.full_name=full_name;
      }
      if(email_address!==undefined){
      
        user.email_address=email_address;
      }
      
      if (req.file) {
        user.avatar = `/uploads/profilePics/${req.file.filename}`; 
      }

      await user.save();
      const newToken = generateToken(user);
      logger.info({action:"generated_token"},"User profile updated successfully") 
      return res
      .status(200)
      .cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })  // Update cookie
      .json({ success: true, message: "Profile updated", user });      
    }

        }
        catch (err) {
          logger.warn({action:"error_updating_profile",error:err.message,stack:err.stack},"Error on updating a user profile")
          console.error("Error on updating a profile:", err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
        
      }

      const generateToken = (user) => {
        logger.info({action:"generated_token"},"Token generated successfully")
        return jwt.sign(
          { id: user.id, full_name: user.full_name, email_address: user.email_address, avatar: user.avatar },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '7d' }  
        );
      };
      
      
      const deleteAccount=async(req,res)=>{
        const userId = req.user.id;
        if(!userId){
          logger.info({action:"user_no_loggedin"},"User not logged in")
          return res.status(401).json({ success: false, message: "Unauthorized" }); 
        }
              
 
        try{
          const delAccount=await User.findOne({where:{
            id:userId
          }});
          if(!delAccount){
            logger.warn({action:"not_found"},"User not found")
            return res.status(404).json({ success: false, message: "User not found" }); 
          }
          else{
            await delAccount.destroy();
            logger.info({action:"success",delAccount:delAccount})
            res.status(200).json({
              success: true,
              message: "Account deleted successfully"
            })
                    }
      }
        catch (err) {
          logger.warn({action:"error_delete_account",error:err.message,stack:err.stack},"Error on deleting a user ")
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      }
      
    






  

module.exports={signupUser,loginUser, deleteAccount,updateUserProfile,forgetPassword,
  resetPassword, logoutUser,validationRegistration,validationLogin}