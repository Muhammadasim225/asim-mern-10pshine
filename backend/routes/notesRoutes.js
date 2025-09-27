const express=require('express');
const { protectedRoutes } = require('../middlewares/protectedRoutes');
const { createNotes} = require('../controllers/notesController');
const rateLimit=require('express-rate-limit')

const router=express.Router();

const notesLimiter=rateLimit({
    windowMs: 60 * 60 * 1000, 
  max: 50,
  message: {
    success: false,
    message: "Too many notes created, please slow down",
  },
});



router.post("/create-note",notesLimiter,protectedRoutes,createNotes)


module.exports = router;
