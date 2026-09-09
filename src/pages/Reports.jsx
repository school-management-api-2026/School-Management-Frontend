import { useState, useEffect, useRef } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ChartCard from '../components/common/ChartCard'
import StatCard from '../components/common/StatCard'
import Loading from '../components/common/Loading'
import { GraduationCap, BookUser, DollarSign, BookOpen } from 'lucide-react'
import { getSummary } from '../api/services/dashboardService'
import { useToast } from '../context/ToastContext'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444']

export default function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    getSummary()
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load report data.'))
      .finally(() => setLoading(false))
  }, [toast])

  if (loading || !data) {
    return <Loading fullPage={false} className="min-h-[60vh]" />
  }

  const { dashboardStats, charts } = data
  const { enrollmentTrend, attendanceOverview, revenueOverview, libraryStats } = charts

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Reports</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Summary analytics and reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={dashboardStats.totalStudents} icon={GraduationCap} color="primary" />
        <StatCard title="Total Teachers" value={dashboardStats.totalTeachers} icon={BookUser} color="info" />
        <StatCard title="Total Revenue" value={`$${dashboardStats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="success" />
        <StatCard title="Total Courses" value={dashboardStats.totalCourses} icon={BookOpen} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Enrollment by Month">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Enrollments" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Attendance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
              <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Month">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip formatter={v => `$${v.toLocaleString()}`} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Library Books Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={libraryStats} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {libraryStats.map((entry, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}