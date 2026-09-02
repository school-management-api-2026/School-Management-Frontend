import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, ShieldCheck, Users, BookOpen } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function Home() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 font-sans selection:bg-primary-500 selection:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <GraduationCap size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                SchoolMS
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggle} 
                className="p-2 rounded-full text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" 
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link 
                to="/login"
                className="hidden sm:block text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-[80px] -z-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 text-sm font-medium mb-8 border border-primary-100 dark:border-primary-900/50">
            <span className="flex w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-500 animate-ping"></span>
            Management System v2.0 is out
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-8 leading-tight">
            The next generation of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
              school management
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, all-in-one platform to streamline administrative tasks, enhance communication, and foster student success.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Log in to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="max-w-5xl mx-auto px-4 mt-24 mb-16 relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 dark:bg-surface-900/60 backdrop-blur-xl p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 shadow-xl shadow-surface-200/20 dark:shadow-none hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Academic Excellence</h3>
            <p className="text-surface-600 dark:text-surface-400 text-sm">Manage courses, monitor grades, and track attendance seamlessly in real-time.</p>
          </div>
          
          <div className="bg-white/60 dark:bg-surface-900/60 backdrop-blur-xl p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 shadow-xl shadow-surface-200/20 dark:shadow-none hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Connected Community</h3>
            <p className="text-surface-600 dark:text-surface-400 text-sm">Bridge the gap between teachers, students, and parents with integrated portals.</p>
          </div>
          
          <div className="bg-white/60 dark:bg-surface-900/60 backdrop-blur-xl p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 shadow-xl shadow-surface-200/20 dark:shadow-none hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Secure & Reliable</h3>
            <p className="text-surface-600 dark:text-surface-400 text-sm">Enterprise-grade security protecting sensitive academic and financial records.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
