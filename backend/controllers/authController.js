const db=require('../config/database')
const {Sequelize} = require('sequelize');
const {sequelize}=require('sequelize');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {body,validationResult}=require('express-validator')
const nodemailer=require('nodemailer');
const User=db.user


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



  

module.exports={signupUser,
  validationRegistration}