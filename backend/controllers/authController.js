const db=require('../config/database')
const {Sequelize} = require('sequelize');
const {sequelize}=require('sequelize');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {body,validationResult}=require('express-validator')
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
      


            

module.exports={signupUser,loginUser,validationRegistration,validationLogin}