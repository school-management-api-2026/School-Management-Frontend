import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowLeft, Mail, Lock, User, AtSign } from 'lucide-react'
import { useState } from 'react'
import axiosClient from '../api/axios'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { success, error } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axiosClient.post('/register', {
        name,
        username,
        email,
        password,
        role_id: 4,
      })
      
      if (response.data?.access_token) {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data.data || {}))
        success('Account created successfully!')
        navigate('/admin')
      } else {
        success('Account created! Please log in.')
        navigate('/login')
      }
    } catch (err) {
      console.error('Registration error:', err)
      error(err.response?.data?.message || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[100px] -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <GraduationCap size={36} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-surface-600 dark:text-surface-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-surface-200/20 dark:shadow-black/40 sm:rounded-2xl sm:px-10 border border-surface-200/50 dark:border-surface-700/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 border border-surface-300 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white bg-white dark:bg-surface-950 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 border border-surface-300 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white bg-white dark:bg-surface-950 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                  placeholder="admin.user"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 border border-surface-300 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white bg-white dark:bg-surface-950 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                  placeholder="admin@school.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 border border-surface-300 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white bg-white dark:bg-surface-950 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-surface-900 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-[13px] text-surface-500">
            By creating an account, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
