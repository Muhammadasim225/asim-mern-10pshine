const express=require('express');
const dotenv=require('dotenv').config();
const bodyParser=require('body-parser');
const helmet=require('helmet');
const passport=require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app=express();

const sequelize=require('./config/database')
app.use(bodyParser.json())
const authRouter=require('./routes/authRoutes')
const notesRouter=require('./routes/notesRoutes');
const logger = require('./logs/logging');
const session=require('express-session')

app.get('/',(req,res)=>{
    logger.info('Hello World')
})
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session())

passport.use(new GoogleStrategy({
    clientId:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl:'http://localhost:3000/auth/google/callback'
},
(
    accessToken,refreshToken,profile,done

)=>{
    return done(null,profile)
}))

passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))

// app.use(helmet())
app.use("/user",authRouter)
app.use("/user",notesRouter)



const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Port is listening on ${port} and url is http://localhost:${port}`)
})