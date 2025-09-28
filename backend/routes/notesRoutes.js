const express=require('express');
const { protectedRoutes } = require('../middlewares/protectedRoutes');
const { createNotes,fetchAllNotes, deleteNote,updateNote} = require('../controllers/notesController');
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

const editnotesLimiter=rateLimit({
  windowMs: 15 * 60 * 1000, 
   max: 10,
   message: {
     success: false,
     message: "Too many notes edited, please slow down",
   },
 });


router.post("/create-note",notesLimiter,protectedRoutes,createNotes)
router.get("/fetch-all-notes",protectedRoutes,fetchAllNotes)
router.put("/edit-note/:id",editnotesLimiter,protectedRoutes,updateNote)
router.delete("/remove-note/:id",protectedRoutes,deleteNote)

module.exports = router;
