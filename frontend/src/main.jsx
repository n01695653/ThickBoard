import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5001/api'

// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('pendingEmail')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'oklch(var(--n))',
            color: 'oklch(var(--nc))',
            border: '1px solid oklch(var(--b3))',
          },
          success: {
            iconTheme: {
              primary: '#00FF9D',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'oklch(var(--er))',
              secondary: 'white',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)