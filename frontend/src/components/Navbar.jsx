import React, { useState } from 'react'
import { Plus, LogOut, User, Shield, Menu, X } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get user data directly from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingEmail');
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className='bg-base-300/80 backdrop-blur-sm border-b border-base-content/10 sticky top-0 z-50'>
      <div className='mx-auto max-w-6xl px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link to="/" className='flex items-center gap-2'>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FF9D] to-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-[#00FF9D] to-primary bg-clip-text text-transparent font-mono tracking-tight'>
              ThinkBoard
            </h1>
            {user?.role === 'admin' && (
              <span className="badge badge-primary badge-sm ml-2">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-4'>
            {user ? (
              <>
                <div className="flex items-center gap-3 mr-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00FF9D] to-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium truncate max-w-[150px]">{user.email}</p>
                    <p className="text-xs text-base-content/60">{user.role}</p>
                  </div>
                </div>
                
                <Link to={"/create"} className='btn btn-primary btn-sm'> 
                  <Plus className='size-4'/>
                  <span>New Note</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="btn btn-error btn-sm gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden btn btn-ghost btn-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-base-content/10 pt-4">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF9D] to-primary flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-base-content/60 flex items-center gap-1">
                      {user.role === 'admin' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to={"/create"} 
                    className='btn btn-primary w-full'
                    onClick={() => setIsMenuOpen(false)}
                  > 
                    <Plus className='size-4'/>
                    <span>New Note</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="btn btn-error w-full gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  className="btn btn-primary w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar