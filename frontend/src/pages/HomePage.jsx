import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard';
import axios from "axios"
import toast from "react-hot-toast";

export const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [limit] = useState(6);
  
  // Simple search state - ONLY ADD THIS
  const [search, setSearch] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("User data corrupted. Please login again.");
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchNotes();
  }, [navigate, currentPage, search]); // Add search as dependency

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await axios.get("http://localhost:5001/api/notes", {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: currentPage,
          limit: limit,
          search: search || undefined // Simple search param
        }
      });
      
      setNotes(res.data.notes || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalNotes(res.data.pagination?.totalNotes || 0);
      
    } catch (error) {
      console.error("Error Fetching notes", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error("Failed to Load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNoteDelete = (deletedNoteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note._id !== deletedNoteId));
    setTotalNotes(prev => prev - 1);
    toast.success('Note deleted successfully');
  };

  const refreshNotes = () => {
    setLoading(true);
    fetchNotes();
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className='min-h-screen'>
      <Navbar/>
      
      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {/* Welcome Message */}
        {user && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FF9D] to-primary bg-clip-text text-transparent">
              Welcome to ThinkBoard
            </h1>
            <p className="text-base-content/70 mt-2">
              {totalNotes > 0 
                ? `You have ${totalNotes} note${totalNotes !== 1 ? 's' : ''}`
                : 'Start by creating your first note!'}
            </p>
            {user.role === 'admin' && (
              <div className="badge badge-primary mt-2">
                Administrator Mode
              </div>
            )}
            <button 
              onClick={refreshNotes}
              className="btn btn-sm btn-ghost mt-2"
            >
              Refresh Notes
            </button>
          </div>
        )}

        {/* SIMPLE SEARCH BAR - ONLY ADD THIS */}
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to page 1 when searching
            }}
            placeholder="Search notes..."
            className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:border-[#00FF9D]"
          />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="loading loading-spinner loading-lg text-[#00FF9D]"></span>
            <p className="mt-4 text-white">Loading your notes...</p>
          </div>
        ) : notes && notes.length > 0 ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
              {notes.map(note => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  onDelete={handleNoteDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        setLoading(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#00FF9D] text-black font-semibold'
                          : 'bg-base-200 hover:bg-base-300 text-base-content'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  {totalPages > getPageNumbers()[getPageNumbers().length - 1] && (
                    <>
                      <span className="px-2 text-base-content/50">...</span>
                      <button
                        onClick={() => {
                          setCurrentPage(totalPages);
                          setLoading(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                          currentPage === totalPages
                            ? 'bg-[#00FF9D] text-black font-semibold'
                            : 'bg-base-200 hover:bg-base-300 text-base-content'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
              <p className="text-base-content/70 mb-6">
                {search ? `No notes matching "${search}"` : 'Create your first note to get started!'}
              </p>
              <button 
                onClick={() => navigate('/create')}
                className="btn btn-primary bg-gradient-to-r from-[#00FF9D] to-primary border-0"
              >
                Create Your First Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}