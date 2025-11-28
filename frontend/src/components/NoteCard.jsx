import { Link } from 'lucide-react'; 
import { PenSquare, Trash2 } from 'lucide-react'; 
import React from 'react';

const NoteCard = ({ note }) => {
 
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

  return (
    <div className='card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00ff9D]'>
      <div className='card-body'>
        <h3 className='card-title text-base-content'>{note.title || 'Untitled Note'}</h3>
        <p className='text-base-content/70 line-clamp-3'>{note.content || 'No content available'}</p>
        <div className='card-actions justify-between items-center mt-4'>
          <span className='text-sm text-base-content/60'>{formatDate(note.createdAt)}</span>
          <div className='flex items-center gap-2'>
            <button className='btn btn-ghost btn-xs text-info'>
              <PenSquare className='size-4' />
            </button>
            <button className='btn btn-ghost btn-xs text-error'>
              <Trash2 className='size-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;