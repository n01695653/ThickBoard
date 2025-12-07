// Authentication helper functions

export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  return !!(token && user)
}

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('pendingEmail')
  window.location.href = '/login'
}

export const hasRole = (requiredRole) => {
  const user = getUser()
  return user?.role === requiredRole
}

export const isAdmin = () => {
  return hasRole('admin')
}

export const getAuthHeaders = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}