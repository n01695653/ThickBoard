import express from "express";
import { getAllNotes,createNotes,updateNotes,deleteNotes,getNoteByID } from "../controllers/notesControllers.js";

const router = express.Router();

//creating theimple route.
router.get("/",getAllNotes)

//getting note by id 
router.get("/:id",getNoteByID)
// creating the post request
router.post("/",createNotes)
// creating the put request 
router.put("/:id",updateNotes)
// creating the delete request
router.delete("/:id",deleteNotes)

export default router;