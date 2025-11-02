const db=require('../config/database');
const logger = require('../logs/logging');
const Note=db.notes
const User=db.user


const createNotes = async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id; 
  
      const newNote = await Note.create({ title, content, userId });
      logger.info({action:"Note created successfully",newNote:newNote},"Note created successfully")
  
      res.status(201).json({
        success: true,
        message: "Note created successfully",
        note: newNote,
      });

    } catch (err) {
        logger.error({action:"error_create_note",error:err.message,stack:err.stack},"Create note error:");
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  
  const fetchAllNotes = async (req, res) => {
    try {
      const userId = req.user.id; 
      
      const userNotes = await Note.findAll({
        where: { userId },
      });
  
      if (userNotes.length > 0) {
        logger.info({action:"notes_fetched_success",userNotes},"Notes Fetched Successfully")
        res.status(200).json({
          message: "User's Notes fetched successfully",
          data: userNotes,
        });
      } else {
        logger.warn({action:"notes_not_found_success",userNotes},"Notes not Found")
        res.status(200).json({
          success: true,
          message: "No notes found for this user",
          data: [],
        });
      }
    } catch (err) {
      logger.error({action:"error_fetch_note",error:err.message,stack:err.stack},"Fetch notes error:");
      console.error("Error fetching user notes:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  

  const updateNote = async (req, res) => {
    try {
      const { title, content } = req.body;
      const id = req.params.id;      
      const userId = req.user.id;        
      if (!title || !content) {
        logger.warn(
          { action: "missing_fields", userId, noteId: id },
          "Title or content is missing in update request"
        );
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
        logger.warn(
          { action: "note_not_found", userId, noteId: id },
          "Note not found or user not authorized"
        );
          return res.status(404).json({
          success: false,
          message: "Note not found or you're not authorized to edit this note",
        });
      }
  
      await note.update({ title, content });
      logger.info(
        { action: "note_updated", userId, noteId: id },
        "Note updated successfully"
      );  
      return res.status(200).json({
        success: true,
        message: "Note updated successfully",
        data: note,
      });
  
    } catch (err) {
      logger.error({action:"error_update_note",error:err.message,stack:err.stack},"Update notes error:");

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  const deleteNote = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id; 

    try {
      const delNote = await Note.findOne({
        where: {
          id,
          userId, 
        },
      });
  
      if (!delNote) {
        logger.warn(
          { action: "note_not_found", userId, noteId: id },
          "Note not found or user not authorized"
        );
        return res.status(404).json({ message: "Note not found or not authorized" });
      }
  
      await delNote.destroy();
      logger.info(
        { action: "note_deleted", userId, noteId: id },
        "Note deleted successfully"
      );
      res.status(200).json({ message: `Note deleted successfully of this ID-${id}` });
    } catch (err) {
      logger.error({action:"error_delete_note",error:err.message,stack:err.stack},"Delete note error:");
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

  const getSingleNote = async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.user.id;
  
      const getOneNote = await Note.findOne({
        where: {
          id,
          userId: userId, 
        },

      });
  
      if (!getOneNote) {
        logger.warn(
          { action: "note_not_found", userId, noteId: id },
          "Note not found"
        );
        return res.status(404).json({ message: "Note not available of this ID" });
      }
  
      return res.status(200).json({
        message: `Note of ID ${id} fetched successfully`,
        data: getOneNote,
      });
  
    } catch (err) {
      console.error("Fetch single note error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  


  

module.exports={createNotes,fetchAllNotes,updateNote,getSingleNote, deleteNote}
  