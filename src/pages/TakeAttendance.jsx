import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import * as studentService from '../api/services/studentService'
import * as attendanceService from '../api/services/attendanceService'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

export default function TakeAttendance() {
  const toast = useToast()
  
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Global settings for the current bulk submit
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [timeIn, setTimeIn] = useState('08:00')
  const [timeOut, setTimeOut] = useState('16:00')

  // State to hold attendance selections per student User ID
  // Map of userId -> status
  const [attendanceMap, setAttendanceMap] = useState({})

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
        setLoading(true)
        const res = await studentService.getAll()
        const fetchedStudents = res.data?.data || []
        setStudents(fetchedStudents)
        
        // Initialize all students to "persent" (Present) by default
        const initMap = {}
        fetchedStudents.forEach(s => {
           // We need to log against the user.id, which the student object holds as user_id
           initMap[s.user_id] = 'persent'
        })
        setAttendanceMap(initMap)
    } catch (err) {
        toast.error("Failed to load students")
    } finally {
        setLoading(false)
    }
  }

  const handleStatusChange = (userId, newStatus) => {
    setAttendanceMap(prev => ({
        ...prev,
        [userId]: newStatus
    }))
  }

  const submitAll = async () => {
      if (!date || !timeIn || !timeOut) {
          toast.error("Please ensure Date, Time In, and Time Out are set.")
          return
      }

      setSaving(true)
      let successCount = 0
      let failCount = 0

      // Fire off attendance creates concurrently
      const promises = students.map(async (student) => {
          const payload = {
              user_id: student.user_id,
              attendance_date: date,
              time_in: timeIn,
              time_out: timeOut,
              status: attendanceMap[student.user_id]
          }
          try {
              await attendanceService.create(payload)
              successCount++
          } catch (e) {
              failCount++
          }
      })

      await Promise.allSettled(promises)
      setSaving(false)

      if (failCount === 0) {
          toast.success(`Successfully recorded attendance for ${successCount} students!`)
      } else {
          toast.warning(`Recorded for ${successCount}, but failed for ${failCount}. (Check if attendance already exists for today)`)
      }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Class Attendance" 
        description="Quickly log attendance for an entire class" 
      />
      
      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-5 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <FormField label="Date">
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </FormField>
            <FormField label="Time In">
                <Input type="time" value={timeIn} onChange={e => setTimeIn(e.target.value)} />
            </FormField>
            <FormField label="Time Out">
                <Input type="time" value={timeOut} onChange={e => setTimeOut(e.target.value)} />
            </FormField>
          </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-surface-500">Loading students...</div>
        ) : students.length === 0 ? (
           <div className="p-8 text-center text-surface-500">No students enrolled.</div>
        ) : (
           <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700 text-sm">
             <thead className="bg-surface-50 dark:bg-surface-800/50">
                <tr>
                    <th className="px-6 py-4 text-left font-semibold text-surface-900 dark:text-white uppercase tracking-wider">Student Name</th>
                    <th className="px-4 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Present</th>
                    <th className="px-4 py-4 text-center font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Absent</th>
                    <th className="px-4 py-4 text-center font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Late</th>
                    <th className="px-4 py-4 text-center font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Excused</th>
                    <th className="px-6 py-4 text-right font-semibold text-surface-900 dark:text-white uppercase tracking-wider">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-surface-200 dark:divide-surface-700 bg-white dark:bg-surface-800">
                {students.map(student => {
                    const status = attendanceMap[student.user_id]
                    return (
                        <tr key={student.user_id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-surface-900 dark:text-white">
                                {student.name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center text-emerald-500">
                                <input type="radio" checked={status === 'persent'} onChange={() => handleStatusChange(student.user_id, 'persent')} className="w-5 h-5 cursor-pointer accent-emerald-500" />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center text-red-500">
                                <input type="radio" checked={status === 'absent'} onChange={() => handleStatusChange(student.user_id, 'absent')} className="w-5 h-5 cursor-pointer accent-red-500" />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center text-yellow-500">
                                <input type="radio" checked={status === 'late'} onChange={() => handleStatusChange(student.user_id, 'late')} className="w-5 h-5 cursor-pointer accent-yellow-500" />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center text-blue-500">
                                <input type="radio" checked={status === 'permission'} onChange={() => handleStatusChange(student.user_id, 'permission')} className="w-5 h-5 cursor-pointer accent-blue-500" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                {/* Visual cue to show it's queued */}
                                <span className="text-xs text-surface-400 font-medium">Pending Submission</span>
                            </td>
                        </tr>
                    )
                })}
             </tbody>
           </table>
        )}
      </div>

      <div className="flex justify-end p-2">
          {!loading && students.length > 0 && (
              <Button onClick={submitAll} disabled={saving} size="lg" className="w-full sm:w-auto px-10">
                 {saving ? 'Saving...' : 'Submit Attendance For All'}
              </Button>
          )}
      </div>

    </div>
  )
}
