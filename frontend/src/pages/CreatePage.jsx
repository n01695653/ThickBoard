import { ArrowLeft, Save, AlertCircle, User } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      toast.error("Please login to create notes");
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
        return;
      }

      const response = await axios.post("http://localhost:5001/api/notes", 
        {
          title: title.trim(),
          content: content.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        toast.success("Note created successfully!");
        
        // Reset form
        setTitle("");
        setContent("");
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating note:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to create notes");
      } else {
        toast.error(error.response?.data?.message || "Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-base-200 to-base-300'>
      {/* User Info Banner */}
      {user && (
        <div className="bg-base-100/90 backdrop-blur-sm border-b border-base-300">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00FF9D] to-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Creating note as: {user.email}</p>
                  <p className="text-xs text-base-content/60">Your note will be saved to your account</p>
                </div>
              </div>
              <div className="text-xs badge badge-outline">
                {user.role === 'admin' ? 'Administrator' : 'User'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          {/* Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className='btn btn-ghost'>
              <ArrowLeft className='size-5'/>Back to Notes
            </Link>
            
            {user && (
              <div className="text-sm text-base-content/60">
                Draft will auto-save
              </div>
            )}
          </div>

          {/* Create Note Card */}
          <div className='card bg-base-100 shadow-xl border border-base-300'>
            <div className='card-body p-6'>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className='card-title text-2xl bg-gradient-to-r from-[#00FF9D] to-primary bg-clip-text text-transparent'>
                  Create New Note
                </h2>
                <div className="text-xs badge badge-primary">
                  {loading ? 'Saving...' : 'Ready'}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-semibold'>Title</span>
                    <span className="label-text-alt text-error">{title.length}/100</span>
                  </label>
                  <input 
                    type='text'
                    placeholder='Enter a descriptive title...'
                    className='input input-bordered w-full focus:border-[#00FF9D] focus:ring-2 focus:ring-[#00FF9D]/20'
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                    maxLength={100}
                    disabled={loading}
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Be specific to help organize your notes
                    </span>
                  </label>
                </div>

                {/* Content Field */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-semibold'>Content</span>
                    <span className="label-text-alt text-error">{content.length}/5000</span>
                  </label>
                  <textarea 
                    placeholder='Start typing your thoughts, ideas, or notes here...'
                    className='textarea textarea-bordered h-64 focus:border-[#00FF9D] focus:ring-2 focus:ring-[#00FF9D]/20 resize-none'
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 5000))}
                    maxLength={5000}
                    disabled={loading}
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Markdown is supported. You can add links, lists, and more.
                    </span>
                  </label>
                </div>

                {/* Character Count & Tips */}
                <div className="bg-base-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#00FF9D] flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Writing Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-base-content/70">
                        <li>Keep titles under 100 characters</li>
                        <li>Use clear, concise language</li>
                        <li>Add relevant tags for better organization</li>
                        <li>Save frequently to avoid losing work</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className='form-control mt-8'>
                  <button 
                    type='submit' 
                    className='btn btn-primary w-full bg-gradient-to-r from-[#00FF9D] to-primary border-0 hover:shadow-lg transition-all'
                    disabled={loading || !title.trim() || !content.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating Note...
                      </>
                    ) : (
                      <>
                        <Save className='size-5' />
                        Create Note
                      </>
                    )}
                  </button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-base-content/60">
                      Your note will be saved securely to your account
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-base-content/60">
            <p>
              Need help? Check out our{' '}
              <Link to="/guide" className="link link-primary">
                writing guide
              </Link>
              {' '}or{' '}
              <Link to="/examples" className="link link-primary">
                view examples
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}