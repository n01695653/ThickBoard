import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CreatePage } from './pages/CreatePage'
import { NoteDetailPage } from './pages/NoteDetailPage'
import LoginPage from './pages/LoginPage'
import VerifyOTPPage from './pages/VerifyOTPPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  
  if (!token || !user) {
    return <Navigate to="/login" />
  }
  
  return children
}

const App = () => {
  return (
    <div className='relative min-h-screen w-full'>
      <div className='absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 
     [background:radial-gradient(125%_125%_at_10%,#000_60%,#00FF9D_100%)]'/>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        } />
        
        <Route path="/note/:id" element={
          <ProtectedRoute>
            <NoteDetailPage />
          </ProtectedRoute>
        } />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App