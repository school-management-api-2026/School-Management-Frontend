import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Intercept requests to attach the token if available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercept responses for global error handling (like 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // If the token is invalid or expired, clear it and force a login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if not already on the login page to avoid infinite loops
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login'
      }
    }
    throw error
  }
)

export default axiosClient
