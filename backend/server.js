const express=require('express');
const dotenv=require('dotenv').config();
const bodyParser=require('body-parser');
const helmet=require('helmet');
const passport=require('./config/passport')
const googleAuthRouter=require('./routes/googleAuthRoutes')
const facebookAuthRouter=require('./routes/facebookAuthRoutes')
const session=require('express-session')
const sequelize=require('./config/database')
const authRouter=require('./routes/authRoutes')
const notesRouter=require('./routes/notesRoutes');
const logger = require('./logs/logging');
const requestLogger=require("./middlewares/requestLogger")
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path=require('path');
const app=express();
const cors=require('cors');
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,             
  }));
app.use("/uploads", express.static(path.join(process.cwd(), "/uploads/")));


app.use(cookieParser());
app.use(bodyParser.json())


app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))

app.use(requestLogger)
app.use('/auth',googleAuthRouter)
app.use('/auth',facebookAuthRouter)
app.use("/user",authRouter)
app.use("/user",notesRouter)



const port=process.env.PORT;
app.listen(port,()=>{
    logger.info(`Port is listening on ${port} and url is http://localhost:${port}`)
})

module.exports = app;   
