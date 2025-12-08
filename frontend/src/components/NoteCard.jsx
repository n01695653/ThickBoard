import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!note) {
    return (
      <div className='card bg-base-200 border-t-4 border-solid border-gray-400'>
        <div className='card-body'>
          <h3 className='card-title text-gray-500'>Invalid Note</h3>
          <p className='text-gray-400'>This note could not be loaded.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Handle Edit Button Click
  const handleEdit = () => {
    console.log('Edit note:', note._id);
    navigate(`/note/${note._id}`);
  };

  // Handle Delete Button Click
  const handleDelete = async () => {
  setIsDeleting(true);
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    console.log('Deleting note as:', user?.role);
    
    const response = await axios.delete(
      `http://localhost:5001/api/notes/${note._id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Delete response:', response.data);
    
   
    if (typeof response.data === 'string') {
      // Handle string response (
      toast.success(response.data);
      if (onDelete) {
        onDelete(note._id);
      }
    } else if (response.data.success) {
      // Handle object response 
      toast.success(response.data.message || 'Note deleted successfully!');
      if (onDelete) {
        onDelete(note._id);
      }
    } else {
      toast.error(response.data.message || 'Failed to delete note');
    }
    
  } catch (error) {
    console.error('Delete error:', error);
    
    if (error.response?.status === 403) {
      toast.error('Only administrators can delete notes');
    } else if (error.response?.status === 401) {
      toast.error('Please login again');
      navigate('/login');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to delete note');
    }
  } finally {
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  }
};

  // Show delete confirmation dialog
  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <div className='card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00ff9D]'>
      <div className='card-body'>
        <h3 className='card-title text-base-content'>{note.title || 'Untitled Note'}</h3>
        <p className='text-base-content/70 line-clamp-3'>{note.content || 'No content available'}</p>
        
        <div className='card-actions justify-between items-center mt-4'>
          <span className='text-sm text-base-content/60'>{formatDate(note.createdAt)}</span>
          
          <div className='flex items-center gap-2'>
            {/* Edit Button */}
            <button 
              onClick={handleEdit}
              className='btn btn-ghost btn-xs text-info hover:bg-info/20'
              title="Edit Note"
            >
              <PenSquare className='size-4' />
            </button>
            
            {/* Delete Button with Confirmation */}
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1 bg-base-200 p-1 rounded-lg">
                <span className="text-xs px-2">Delete?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn btn-xs btn-error"
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : 'Yes'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-xs btn-ghost"
                >
                  No
                </button>
              </div>
            ) : (
              <button 
                onClick={confirmDelete}
                className='btn btn-ghost btn-xs text-error hover:bg-error/20'
                title="Delete Note"
              >
                <Trash2 className='size-4' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;