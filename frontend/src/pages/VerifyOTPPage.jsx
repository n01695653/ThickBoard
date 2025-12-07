import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Mail, ArrowLeft, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const navigate = useNavigate()
  const inputsRef = useRef([])

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingEmail')
    if (!pendingEmail) {
      toast.error('No pending login session')
      navigate('/login')
    } else {
      setEmail(pendingEmail)
    }
  }, [navigate])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  useEffect(() => {
    if (countdown <= 240) { // Can resend after 1 minute
      setCanResend(true)
    }
  }, [countdown])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    if (value.length > 1) value = value.slice(0, 1)

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('')
      setOtp(newOtp.concat(Array(6 - newOtp.length).fill('')))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('/auth/verify-otp', {
        email,
        otp: otpString
      })

      if (response.data.success) {
        // Save token and user data
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        localStorage.removeItem('pendingEmail')
        
        toast.success('Login successful!')
        navigate('/')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    try {
      const response = await axios.post('/auth/login', { email })
      if (response.data.success) {
        setCountdown(300)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        inputsRef.current[0]?.focus()
        toast.success('New OTP sent to your email!')
      }
    } catch (error) {
      toast.error('Failed to resend OTP',error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00FF9D]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="card bg-base-100/90 backdrop-blur-sm border border-base-300 shadow-2xl w-full max-w-md relative z-10">
        <div className="card-body p-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/login')}
            className="btn btn-ghost btn-sm mb-2 -ml-3 self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00FF9D] to-primary rounded-2xl mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FF9D] to-primary bg-clip-text text-transparent">
              Verify Identity
            </h1>
            <p className="text-base-content/70 mt-2">
              Enter the 6-digit code sent to
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-[#00FF9D]" />
              <span className="font-medium text-base-content">{email}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-lg mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Timer */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-base-200 rounded-full">
              <div className="radial-progress text-[#00FF9D]" 
                   style={{"--value": (countdown/300)*100, "--size": "2.5rem"}}>
                <span className="text-xs font-bold">{formatTime(countdown)}</span>
              </div>
              <span className="text-sm">OTP expires in</span>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="space-y-8" onPaste={handlePaste}>
            <div className="space-y-4">
              <label className="label justify-center">
                <span className="label-text font-semibold">Enter Verification Code</span>
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    className="input input-bordered w-14 h-14 text-center text-2xl font-bold 
                             focus:border-[#00FF9D] focus:ring-2 focus:ring-[#00FF9D]/20 
                             transition-all duration-200"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputsRef.current[index] = el)}
                    maxLength={1}
                    required
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <button
                type="submit"
                className="btn btn-primary w-full bg-gradient-to-r from-[#00FF9D] to-primary border-0 
                         hover:shadow-lg hover:scale-[1.02] transition-all"
                disabled={loading || countdown === 0}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                className={`btn btn-outline w-full gap-2 ${!canResend ? 'btn-disabled' : ''}`}
                disabled={!canResend}
              >
                <RotateCcw className="w-4 h-4" />
                Resend Code {!canResend && `(${formatTime(countdown - 240)})`}
              </button>
            </div>
          </form>

          {/* Success Tips */}
          <div className="mt-8 alert bg-base-200 border-base-300">
            <CheckCircle className="w-5 h-5 text-[#00FF9D]" />
            <div className="text-sm">
              <span className="font-medium">Tips for success:</span>
              <ul className="mt-1 space-y-1 text-base-content/70">
                <li>• Check your spam folder if you don't see the email</li>
                <li>• The code is case-sensitive</li>
                <li>• You have 5 minutes to enter the code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTPPage