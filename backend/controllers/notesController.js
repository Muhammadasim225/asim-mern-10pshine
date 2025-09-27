const db=require('../config/database')
const Note=db.notes


const createNotes = async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id; 
  
      const newNote = await Note.create({ title, content, userId });
  
      res.status(201).json({
        success: true,
        message: "Note created successfully",
        note: newNote,
      });
    } catch (err) {
        console.error("Create note error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  

module.exports={createNotes}
  