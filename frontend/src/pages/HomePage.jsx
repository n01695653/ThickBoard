import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard';
import axios from "axios"
import toast from "react-hot-toast";

export const HomePage = () => {
  const [notes,setNotes] = useState([]);
  const [loading,setLoading] = useState(true);

useEffect(() => {
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/notes")
      console.log(res.data);
      // Updating the notes state
      setNotes(res.data.notes)
    } catch (error) {
      console.error("Error Fetching notes", error);
      toast.error("Failed to Load notes");
    } finally {
      setLoading(false)
    };
  };
  fetchNotes();
  },[]);
  return (
    <div className='min-h-screen'>
      <Navbar/>
      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}
        {notes && notes.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notes.map(note => (
              <NoteCard key={note._id}
              note = {note}/>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}
