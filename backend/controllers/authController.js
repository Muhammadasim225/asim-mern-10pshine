const db=require('../config/database')
const {Sequelize} = require('sequelize');
const {sequelize}=require('sequelize');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {body,validationResult}=require('express-validator')
const nodemailer=require('nodemailer');
const User=db.user
const crypto=require('crypto');



const sendResetPasswordMail=async(name,email,token)=>{
  try{
    const transporter=nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetLink = `http://localhost:3000/user/reset-password?token=${token}`;


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
    console.log("Email sent: ", info.response)
  }
  catch (err) {
    console.error("Send reset password mail error:", err);

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
      .isLength({ min: 6, max: 24 })
      .withMessage("Password must be between 6 and 12 characters long"),
  ];



const signupUser=async(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
      
        try {
          const { full_name, email_address, password } = req.body;
          const hashedPassword=await bcrypt.hash(password,10)
      
          // Check if email already exists
          const existingUser = await User.findOne({ where: { email_address } });
          if (existingUser) {
            return res.status(400).json({
              success: false,
              message: "Email already registered",
            });
          }
      
          const newUser = await User.create({ full_name, email_address, password:hashedPassword });
      
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
          console.error("Signup error:", err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      };

      
      const loginUser = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        }

      
        try {
          const { email_address, password } = req.body;
      
          const existingUser = await User.findOne({
            where: { email_address }
          });
      
          if (!existingUser) {
            return res.status(404).json({
              success: false,
              message: "User not registered"
            });
          }
      
          const isMatch = await bcrypt.compare(password, existingUser.password);
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: "Invalid credentials"
            });
          }
      
          const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email_address },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );

          res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', 
            secure:true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 
          });
      
          return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
              id: existingUser.id,
              full_name: existingUser.full_name,
              email_address: existingUser.email_address,
            },
            token,
          });
      
        } catch (err) {
          console.error("Login error:", err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      };

      const forgetPassword=async(req,res)=>{
        const {email_address}=req.body;
        console.log("HAAN YEHI EMAIL HE:- ",email_address)
        try{
          const findEmail=await User.findOne({where:{
            email_address
          }})
          console.log("Haan yehi find email he:- ",findEmail)
          if(findEmail){
            const token = crypto.randomBytes(32).toString("hex");
            console.log("Haan yehi token he:- ",token)
            const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

            findEmail.resetToken=token;
            findEmail.resetTokenExpiry=expiryTime;


            await findEmail.save();
            sendResetPasswordMail(findEmail.full_name,findEmail.email_address,token)

            return res.status(200).json({
              success: true,
              message: "Reset password email sent successfully",
            });

          }
          else{
            res.status(404).json({message:"This email does not exists"})
          }

        }
        catch (err) {
          console.error("Error on froget the password:", err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      }
      const resetPassword=async(req,res)=>{
        try{
          const token=req.query.token;
          console.log("Haan yehi query he:- ",token)
          const findToken=await User.findOne({where:{resetToken:token}})
          console.log("Haan yehi find token he:- ",findToken)
          if(findToken){

            const password=req.body.password;
            console.log("The password is:- ",password);
            const hashedPassword=await bcrypt.hash(password,10)
            console.log("The hashed password is:- ",hashedPassword);

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
            console.log("Haan yehi updated user he:- ",updatedUser)
            res.status(200).json({ message: "Password has been reset", data: updatedUser });



          }
          else{
              res.status(404).json({message:"This token does not exists"})
            

          }

        }
        catch (err) {
          console.error("Error on reset the password:", err);
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
        res.status(200).json({ message: 'Logged out successfully' });
      };

      const updateUserProfile=async(req,res)=>{
        try{
          const userId = req.user.id; 
          const { full_name, email_address } = req.body;
          const user = await User.findByPk(userId);
          if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
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

      return res.status(200).json({ success: true, message: "Profile updated", user });
      
    }

        }
        catch (err) {
          console.error("Error on updating a profile:", err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
        
      }
      
      






  

module.exports={signupUser,loginUser,updateUserProfile,  forgetPassword,
  resetPassword, logoutUser,validationRegistration,validationLogin}