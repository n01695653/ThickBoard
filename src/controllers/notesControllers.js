import Note from "../models/Note.js";

export  async function getAllNotes(req,res) {
    try {
        const notes = await Note.find().sort({createdAt:-1})//show newest one note 
        res.status(200).json(notes)
    } catch (error) {
        console.error("Error in getAllNotes Controller", error)
        res.status(500).json({message:"Internal Several Error"})
    }
}
export async function getNoteByID(req,res){
    try {
        const note = await Note.findById(req.params.id)
        if(!note) // if the user enter invalid  id  then it return status 404 that menas not found 
             return res.status(404).json({message:"Note Not Found"})
        res.status(200).json(note)
    } catch (error) {
        console.error("Error in getNoteByID Controller", error)
        res.status(500).json({message:"Internal Several Error"})
    }

}

export async function createNotes(req,res) {
    try {
        const {title,content} = req.body  // middlewares  hepl us to get the access to  the body .(title,content)
        // without the middlewares we can not access thid value 
        const note  = new Note({title,content})  // creatin the new note using model that contain title and Content
        const savedNote = await note.save();
        res.status(201).json(savedNote); // th show the note created  instaed of the message
    } catch (error) {
        console.error("Error in creatNotes Controller", error)
        res.status(500).json({message:"Internal Several Error"})
    }
}

export async function updateNotes(req,res){
     try {
        const {title,content} = req.body  // this will give some data from the  body
        const updatedNote =  await Note.findByIdAndUpdate(req.params.id,{title,content})
        if(!updatedNote) // if the user enter invalid  id  then it return status 404 that menas not found 
             return res.status(404).json({message:"Note Not Found"})

       
        res.status(200).json(updatedNote)
     } catch (error) {
        console.error("Error in updateNotes Controller ", error)
        res.status(500).json({message:"Internal Several Error"})
     }
}
export async function deleteNotes(req,res){
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id)
        if(!deletedNote) // if the user enter invalid  id  then it return status 404 that menas not found 
             return res.status(404).json({message:"Note Not Found"})
        res.status(200).json("Note Deleted Successfully")
    } catch (error) {
        console.error("Error in deleteNotes Controller", error)
        res.status(500).json({message:"Internal Several Error"})
    }
}