import { useState, useEffect, useRef } from 'react'
import { GraduationCap, BookUser, UserCheck, LibraryBig, ClipboardList, UserRoundCheck, DollarSign, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getSummary } from '../api/services/dashboardService'
import { useToast } from '../context/ToastContext'
import StatCard from '../components/common/StatCard'
import ChartCard from '../components/common/ChartCard'
import StatusBadge from '../components/common/StatusBadge'
import Loading from '../components/common/Loading'

const PIE_COLORS = ['#22c55e', '#6366f1', '#ef4444']

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    getSummary()
      .then(res => {
        setData(res.data.data)
      })
      .catch(err => {
        toast.error("Failed to load dashboard data.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [toast])

  if (loading || !data) {
    return <Loading fullPage={false} className="min-h-[60vh]" />
  }

  const { dashboardStats, tables, charts } = data
  const { recentStudents, recentEnrollments, todayAttendance, upcomingExams, recentPayments } = tables
  const { enrollmentTrend, attendanceOverview, revenueOverview, libraryStats } = charts

  const attendanceTotal = dashboardStats.attendanceToday.present + 
                          dashboardStats.attendanceToday.absent + 
                          dashboardStats.attendanceToday.late + 
                          dashboardStats.attendanceToday.excused;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Welcome back! Here&apos;s an overview of your school.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={dashboardStats.totalStudents} icon={GraduationCap} color="primary" />
        <StatCard title="Total Teachers" value={dashboardStats.totalTeachers} icon={BookUser} color="info" />
        <StatCard title="Total Parents" value={dashboardStats.totalParents} icon={UserCheck} color="success" />
        <StatCard title="Total Courses" value={dashboardStats.totalCourses} icon={LibraryBig} color="warning" />
        <StatCard title="Total Enrollments" value={dashboardStats.totalEnrollments} icon={ClipboardList} color="primary" />
        <StatCard title="Attendance Today" value={`${dashboardStats.attendanceToday.present}/${attendanceTotal}`} icon={UserRoundCheck} color="success" />
        <StatCard title="Total Revenue" value={`$${dashboardStats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="success" />
        <StatCard title="Outstanding" value={`$${dashboardStats.outstandingPayments.toLocaleString()}`} icon={AlertTriangle} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Student Enrollment Trend">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#enrollGrad)" strokeWidth={2} name="Enrollments" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Attendance Overview">
          <ResponsiveContainer width="100%" height={260}>
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

        <ChartCard title="Revenue Overview">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueOverview}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip formatter={(val) => `$${val.toLocaleString()}`} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Library Statistics">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={libraryStats} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: '#94a3b8' }}>
                {libraryStats.map((entry, i) => <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Students</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {recentStudents.length === 0 && <p className="px-5 py-8 text-sm text-surface-400 text-center">No recent students</p>}
            {recentStudents.map(s => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-400">
                    {(s.name || 'U').split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{s.name}</p>
                    <p className="text-xs text-surface-400">{s.email}</p>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Enrollments</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {recentEnrollments.length === 0 && <p className="px-5 py-8 text-sm text-surface-400 text-center">No recent enrollments</p>}
            {recentEnrollments.map(e => (
              <div key={e.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{e.studentName}</p>
                  <p className="text-xs text-surface-400">{e.courseName}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={e.status} />
                  <p className="text-xs text-surface-400 mt-1">{e.enrollmentDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Today&apos;s Attendance</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {todayAttendance.length === 0 && <p className="px-5 py-8 text-sm text-surface-400 text-center">No attendance logged today</p>}
            {todayAttendance.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{a.userName}</p>
                  <p className="text-xs text-surface-400">{a.timeIn ? `In: ${a.timeIn}` : 'Not checked in'}{a.timeOut ? ` — Out: ${a.timeOut}` : ''}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Upcoming Exams</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {upcomingExams.length === 0 ? (
              <p className="px-5 py-8 text-sm text-surface-400 text-center">No upcoming exams</p>
            ) : upcomingExams.map(ex => (
              <div key={ex.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{ex.courseName}</p>
                  <p className="text-xs text-surface-400">{ex.teacherName}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={ex.examType} />
                  <p className="text-xs text-surface-400 mt-1">{ex.examDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50">
                <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400">Invoice</th>
                <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400">Amount</th>
                <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400">Date</th>
                <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400">Method</th>
                <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {recentPayments.length === 0 && (
                  <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-surface-400">No recent payments</td>
                  </tr>
              )}
              {recentPayments.map(p => (
                <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-5 py-3 text-surface-900 dark:text-white font-medium">{p.invoiceRef}</td>
                  <td className="px-5 py-3 text-surface-700 dark:text-surface-300">${p.amount}</td>
                  <td className="px-5 py-3 text-surface-700 dark:text-surface-300">{p.paymentDate}</td>
                  <td className="px-5 py-3 text-surface-700 dark:text-surface-300">{p.paymentMethod}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
