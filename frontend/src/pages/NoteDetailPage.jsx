import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Clock, 
  Shield, 
  Eye,
  Save,
  X,
  CheckCircle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export const NoteDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', content: '' })
  const [editLoading, setEditLoading] = useState(false)

  // Check authentication and fetch note
  useEffect(() => {
    const checkAuthAndFetchNote = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (!token || !userData) {
        toast.error('Please login to view note details')
        navigate('/login')
        return
      }
      
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        // Fetch note with authentication
        const response = await axios.get(`http://localhost:5001/api/notes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        setNote(response.data)
        setEditForm({
          title: response.data.title,
          content: response.data.content
        })
      } catch (error) {
        console.error('Error fetching note:', error)
        
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
        } else if (error.response?.status === 404) {
          toast.error('Note not found')
          navigate('/')
        } else {
          toast.error('Failed to load note')
          navigate('/')
        }
      } finally {
        setLoading(false)
      }
    }
    
    checkAuthAndFetchNote()
  }, [id, navigate])

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setEditLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `http://localhost:5001/api/notes/${id}`,
        {
          title: editForm.title.trim(),
          content: editForm.content.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      setNote(response.data)
      setIsEditing(false)
      toast.success('Note updated successfully!')
    } catch (error) {
      console.error('Error updating note:', error)
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        navigate('/login')
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to edit this note')
      } else if (error.response?.status === 404) {
        toast.error('Note not found')
        navigate('/')
      } else {
        toast.error('Failed to update note')
      }
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5001/api/notes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      toast.success('Note deleted successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error deleting note:', error)
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        navigate('/login')
      } else if (error.response?.status === 403) {
        toast.error('Only administrators can delete notes')
      } else if (error.response?.status === 404) {
        toast.error('Note not found')
        navigate('/')
      } else {
        toast.error('Failed to delete note')
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#00FF9D]"></span>
          <p className="mt-4 text-white">Loading note...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
            <Eye className="w-12 h-12 text-base-content/50" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Note Not Found</h3>
          <p className="text-base-content/70 mb-6">The note you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Link>
        </div>
      </div>
    )
  }

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
                  <p className="text-sm font-medium">Viewing as: {user.email}</p>
                  <p className="text-xs text-base-content/60">
                    {user.role === 'admin' ? 'Administrator permissions' : 'Read-only access'}
                  </p>
                </div>
              </div>
              <div className={`text-xs badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                {user.role === 'admin' ? (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </>
                ) : 'User'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className='btn btn-ghost'>
              <ArrowLeft className='size-5'/>Back to Notes
            </Link>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button 
                  onClick={() => {
                    setIsEditing(false)
                    setEditForm({
                      title: note.title,
                      content: note.content
                    })
                  }}
                  className="btn btn-ghost btn-sm"
                  disabled={editLoading}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary btn-sm gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              
              <button 
                onClick={handleDelete}
                className="btn btn-error btn-sm gap-2"
                disabled={user?.role !== 'admin'}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Note Card */}
          <div className='card bg-base-100 shadow-xl border border-base-300'>
            <div className='card-body p-8'>
              {/* Header with Timestamps */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-base-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00FF9D]" />
                    <span className="text-sm text-base-content/60">Created: {formatDate(note.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00FF9D]" />
                    <span className="text-sm text-base-content/60">
                      Updated: {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
                
                <div className="badge badge-outline">
                  {isEditing ? 'Editing Mode' : 'View Mode'}
                </div>
              </div>

              {/* Note Content */}
              {isEditing ? (
                <form onSubmit={handleEdit} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Title</span>
                      <span className="label-text-alt text-error">{editForm.title.length}/100</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full focus:border-[#00FF9D] focus:ring-2 focus:ring-[#00FF9D]/20 text-2xl font-bold"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value.slice(0, 100)})}
                      maxLength={100}
                      disabled={editLoading}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Content</span>
                      <span className="label-text-alt text-error">{editForm.content.length}/5000</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full h-96 focus:border-[#00FF9D] focus:ring-2 focus:ring-[#00FF9D]/20 resize-none"
                      value={editForm.content}
                      onChange={(e) => setEditForm({...editForm, content: e.target.value.slice(0, 5000)})}
                      maxLength={5000}
                      disabled={editLoading}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-base-300">
                    <button
                      type="submit"
                      className="btn btn-primary flex-1 gap-2 bg-gradient-to-r from-[#00FF9D] to-primary border-0"
                      disabled={editLoading}
                    >
                      {editLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setEditForm({
                          title: note.title,
                          content: note.content
                        })
                      }}
                      className="btn btn-ghost"
                      disabled={editLoading}
                    >
                      Discard
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FF9D] to-primary bg-clip-text text-transparent">
                    {note.title}
                  </h1>
                  
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap p-4 bg-base-200 rounded-lg border border-base-300">
                      {note.content}
                    </div>
                  </div>

                  {/* Read-Only Notice */}
                  {user?.role !== 'admin' && (
                    <div className="alert bg-base-200 border-base-300">
                      <CheckCircle className="w-5 h-5 text-[#00FF9D]" />
                      <div>
                        <span className="font-medium">Read-only view</span>
                        <div className="text-sm">
                          You can view this note but only administrators can edit or delete it.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Stats */}
              <div className="mt-8 pt-6 border-t border-base-300">
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-base-content/60">
                  <div>
                    <span className="font-medium">Characters:</span> {note.content.length}
                  </div>
                  <div>
                    <span className="font-medium">Words:</span> {note.content.split(/\s+/).filter(Boolean).length}
                  </div>
                  <div>
                    <span className="font-medium">Last viewed:</span> Just now
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Info */}
          <div className="mt-8 bg-base-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#00FF9D] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Permissions:</p>
                <ul className="space-y-1 text-base-content/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>All users can view notes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {user?.role === 'admin' ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-error" />
                    )}
                    <span>Edit notes: {user?.role === 'admin' ? 'Allowed' : 'Not allowed'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {user?.role === 'admin' ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-error" />
                    )}
                    <span>Delete notes: {user?.role === 'admin' ? 'Allowed' : 'Not allowed'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}