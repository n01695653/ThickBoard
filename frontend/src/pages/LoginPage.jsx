import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/auth/login', formData)
      
      if (response.data.success) {
        // Save email for OTP verification
        localStorage.setItem('pendingEmail', formData.email)
        toast.success('OTP sent to your email!')
        navigate('/verify-otp')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00FF9D]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="card bg-base-100/90 backdrop-blur-sm border border-base-300 shadow-2xl w-full max-w-md relative z-10">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00FF9D] to-primary rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FF9D] to-primary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-base-content/70 mt-2">Sign in to access your notes</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-lg mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full focus:border-[#00FF9D] focus:ring-2 focus:ring-[#00FF9D]/20 transition-all"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full focus:border-[#00FF9D] focus:ring-2 focus:ring-[#00FF9D]/20 transition-all"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4 bg-gradient-to-r from-[#00FF9D] to-primary border-0 hover:shadow-lg hover:scale-[1.02] transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Simple Footer */}
          <div className="mt-8 text-center text-sm text-base-content/60">
            <p>Enter your credentials to access the notes application</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage