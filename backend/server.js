const express=require('express');
const dotenv=require('dotenv').config();
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.json())
const authRouter=require('./routes/authRoutes')


app.use("/user",authRouter)



const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Port is listening on ${port} and url is http://localhost:${port}`)
})