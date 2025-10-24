import Note from "../models/Note.js";

export  async function getAllNotes(req,res) {
    try {
        // ====================
        // 1. GET QUERY PARAMETERS
        // ====================
        const page = parseInt(req.query.page) || 1;      // Page number (default: 1)
        const limit = parseInt(req.query.limit) || 6;   // Notes per page (default: 10)
        const search = req.query.search || '';           // Search keyword
        const sortBy = req.query.sortBy || 'createdAt';  // Sort field
        const order = req.query.order || 'desc';         // Sort order

        // 2. CALCULATE PAGINATION
        const skip = (page - 1) * limit; // Skip previous pages

        // ====================
        // 3. BUILD SEARCH FILTER
        // ====================
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },     // Search in title (case insensitive)
                    { content: { $regex: search, $options: 'i' } }    // Search in content (case insensitive)
                ]
            };
        }

        // 4. BUILD SORT OBJECT
        const sortOptions = {};
        if (sortBy === 'title') {
            sortOptions.title = order === 'asc' ? 1 : -1;
        } else if (sortBy === 'createdAt') {
            sortOptions.createdAt = order === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1; // Default sort: newest first
        }

        // 5. EXECUTE QUERY
        const notes = await Note.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        // 6. GET TOTAL COUNT FOR PAGINATION INFO
        const totalNotes = await Note.countDocuments(filter);
        const totalPages = Math.ceil(totalNotes / limit);

        
        res.status(200).json({
            
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalNotes: totalNotes,
                notesPerPage: limit
            },
            search: search,
            sortBy: sortBy,
            order: order,
            notes: notes,
        });

    } catch (error) {
        console.error("Error in getAllNotes Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
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