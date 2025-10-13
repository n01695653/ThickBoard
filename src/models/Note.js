import mongoose from "mongoose";

// creating the Note Schema

const noteSchema =  new mongoose.Schema(
   {
    title:{
        type:String,
        required: true,
    },
    content:{
        type:String,
        required:true,
    },
   },
   {timestamps:true}// createAt and UpdatedAt
);

// creating the Model
const Note = mongoose.model("Note", noteSchema)

export default Note;