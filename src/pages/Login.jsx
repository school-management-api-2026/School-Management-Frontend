import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowLeft, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import axiosClient from '../api/axios'
import { useToast } from '../context/ToastContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { success, error } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axiosClient.post('/login', {
                email,
                password
            })

            if (response.data?.access_token) {
                localStorage.setItem('token', response.data.access_token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                success('Logged in successfully!')
                
                const roleId = response.data.user.role_id;
                if (roleId === 1) navigate('/admin');
                else if (roleId === 2) navigate('/teacher');
                else if (roleId === 4) navigate('/student');
                else navigate('/'); 
                
            } else {
                error('Login failed. No token received.')
            }
        } catch (err) {
            console.error('Login error:', err)
            error(err.response?.data?.message || 'Failed to login. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

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
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-surface-600 dark:text-surface-400">
                    Or{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-surface-200/20 dark:shadow-black/40 sm:rounded-2xl sm:px-10 border border-surface-200/50 dark:border-surface-700/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                                Email or Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-surface-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 px-3 py-2.5 border border-surface-300 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white bg-white dark:bg-surface-950 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                                    placeholder="admin.user or admin@school.com"
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
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 px-3 py-2.5 border border-surface-300 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white bg-white dark:bg-surface-950 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 dark:border-surface-700 rounded bg-white dark:bg-surface-950 cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-surface-900 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-200 dark:border-surface-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-surface-900 text-surface-500">Demo Credentials</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400 font-mono bg-surface-100 dark:bg-surface-800 p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                            Use your registered email/username and password
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
