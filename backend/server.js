const express=require('express');
const dotenv=require('dotenv').config();
const bodyParser=require('body-parser');
const authRouter=require('./routes/authRoutes')
const notesRouter=require('./routes/notesRoutes');

const app=express();
app.use(bodyParser.json())

app.use("/user",authRouter)
app.use("/user",notesRouter)



const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Port is listening on ${port} and url is http://localhost:${port}`)
})