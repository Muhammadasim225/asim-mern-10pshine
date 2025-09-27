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

  

module.exports={createNotes,fetchAllNotes}
  