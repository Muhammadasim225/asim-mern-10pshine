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

  const fetchAllNotes=async(req,res)=>{
    try{
        const getAll=await Note.findAll({})
        if(getAll.length>0){
            res.status(200).json({message:"All Notes Fetched successfully",data:getAll})

        }
        else{
            res.status(200).json({
                "success": true,
                "message": "No notes found",
                "data": []
              })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }

  }

  const updateNote = async (req, res) => {
    try {
      const { title, content } = req.body;
      const id = req.params.id;      
      const userId = req.user.id;        
  
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: "Title and content are required",
        });
      }
  
      const note = await Note.findOne({
        where: {
          id,
          userId: userId, 
        },
      });
  
      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found or you're not authorized to edit this note",
        });
      }
  
      await note.update({ title, content });
  
      return res.status(200).json({
        success: true,
        message: "Note updated successfully",
        data: note,
      });
  
    } catch (err) {
      console.error("Update note error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  const deleteNote=async(req,res)=>{
    const id=req.params.id;
    try{
      const delNote=await Note.findOne({
        where:{
          id
        }
      })
      if(!delNote){
        res.status(404).json({message:"Note not found of this ID"});
      }
      else{
        await delNote.destroy();
        res.status(200).json({message:`Note deleted successfully of this ID-${id}`})
      }
    }
    catch (err) {
      console.error("Delete note error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }


  

module.exports={createNotes,fetchAllNotes,updateNote, deleteNote}
  