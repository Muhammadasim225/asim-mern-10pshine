const express=require('express');
const dotenv=require('dotenv').config();
const bodyParser=require('body-parser');
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session=require('express-session')
const app=express();
app.use(bodyParser.json())
const authRouter=require('./routes/authRoutes')
const logger = require('./logs/logging');
app.get('/',(req,res)=>{
    logger.info('Hello World')
})
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))


app.use("/user",authRouter)



const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Port is listening on ${port} and url is http://localhost:${port}`)
})