const express=require('express');
const dotenv=require('dotenv').config();
const bodyParser=require('body-parser');
const helmet=require('helmet');
const passport=require('./config/passport')
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleAuthRouter=require('./routes/googleAuthRoutes')
const session=require('express-session')
const app=express();
const sequelize=require('./config/database')
app.use(bodyParser.json())
const authRouter=require('./routes/authRoutes')
const notesRouter=require('./routes/notesRoutes');
const logger = require('./logs/logging');
app.get('/',(req,res)=>{
    logger.info('Hello World')
})
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))


app.use('/auth',googleAuthRouter)
app.use("/user",authRouter)
app.use("/user",notesRouter)



const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Port is listening on ${port} and url is http://localhost:${port}`)
})