import { useEffect, useState, useMemo } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as scheduleService from '../api/services/scheduleService'
import * as teacherCourseService from '../api/services/teacherCourseService'
import * as roomService from '../api/services/roomService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'
import { CalendarDays, List } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Schedules() {
  const toast = useToast()
  const crud = useApiCrud(scheduleService)
  const [teacherCourses, setTeacherCourses] = useState([])
  const [rooms, setRooms] = useState([])
  const [view, setView] = useState('table')

  useEffect(() => {
    teacherCourseService.getAll()
      .then(res => setTeacherCourses(res.data?.data ?? res.data ?? []))
      .catch(() => setTeacherCourses([]))
    roomService.getAll()
      .then(res => setRooms(res.data?.data ?? res.data ?? []))
      .catch(() => setRooms([]))
  }, [])

  const startTime = row => row.time_start?.slice(0, 5) || '—'
  const endTime = row => row.time_out?.slice(0, 5) || '—'

  const timeSlots = useMemo(() => {
    const times = new Set(crud.filtered.map(s => startTime(s)).filter(t => t && t !== '—'))
    return [...times].sort((a, b) => a.localeCompare(b))
  }, [crud.filtered])

  const columns = [
    { key: 'day_of_week', label: 'Day' },
    { key: 'time_start', label: 'Start', render: (_, row) => startTime(row) },
    { key: 'time_out', label: 'End', render: (_, row) => endTime(row) },
    { key: 'course', label: 'Course', render: (_, row) => row.teacher_course?.course?.subject?.name || '—' },
    { key: 'teacher', label: 'Teacher', render: (_, row) => row.teacher_course?.teacher?.user?.name || '—' },
    { key: 'room', label: 'Room', render: (_, row) => row.room ? `${row.room.name || row.room.room_number}` : '—' },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.day_of_week || !f.time_start || !f.time_out || !f.teacher_course_id || !f.room_id) {
      toast.error('Day, time, teacher course and room are required'); return
    }
    const payload = {
      day_of_week: f.day_of_week,
      time_start: f.time_start,
      time_out: f.time_out,
      teacher_course_id: Number(f.teacher_course_id),
      room_id: Number(f.room_id),
    }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Schedule updated' : 'Schedule created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Schedule deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Schedules" description="Manage class schedules" onAdd={() => crud.openAdd({})} addLabel="Add Schedule">
        <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
          <button onClick={() => setView('table')} className={`p-2 ${view === 'table' ? 'bg-primary-600 text-white' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'} transition-colors`}><List size={18} /></button>
          <button onClick={() => setView('calendar')} className={`p-2 ${view === 'calendar' ? 'bg-primary-600 text-white' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'} transition-colors`}><CalendarDays size={18} /></button>
        </div>
      </PageHeader>

      {view === 'table' && (
        <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search schedules..." /></div>
      )}

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No schedules found" action={() => crud.openAdd({})} actionLabel="Add Schedule" />
      ) : view === 'calendar' ? (
        <div className="overflow-x-auto border border-surface-200 dark:border-surface-700 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50">
                <th className="px-3 py-3 text-left font-medium text-surface-500 dark:text-surface-400 w-20">Time</th>
                {days.map(d => <th key={d} className="px-3 py-3 text-left font-medium text-surface-500 dark:text-surface-400">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {timeSlots.map(time => (
                <tr key={time} className="bg-white dark:bg-surface-900">
                  <td className="px-3 py-3 text-xs text-surface-400 font-mono">{time}</td>
                  {days.map(day => {
                    const slots = crud.filtered.filter(s => s.day_of_week === day && startTime(s) === time)
                    return (
                      <td key={day} className="px-2 py-1">
                        {slots.map(slot => (
                          <div key={slot.id} className="bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-lg p-2 mb-1">
                            <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 truncate">{slot.teacher_course?.course?.subject?.name}</p>
                            <p className="text-[10px] text-surface-500 truncate">{slot.teacher_course?.teacher?.user?.name}</p>
                            <p className="text-[10px] text-surface-400 truncate">{slot.room?.name || slot.room?.room_number} · {startTime(slot)}-{endTime(slot)}</p>
                          </div>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Schedule' : 'Add Schedule'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Day" required><Select value={crud.formData.day_of_week || ''} onChange={e => crud.updateForm('day_of_week', e.target.value)}><option value="">Select Day</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</Select></FormField>
          <FormField label="Teacher & Course" required><Select value={crud.formData.teacher_course_id || ''} onChange={e => crud.updateForm('teacher_course_id', e.target.value)}><option value="">Select Teacher — Course</option>{teacherCourses.map(tc => <option key={tc.id} value={tc.id}>{tc.teacher?.user?.name} — {tc.course?.subject?.name}</option>)}</Select></FormField>
          <FormField label="Start Time" required><Input type="time" value={crud.formData.time_start || ''} onChange={e => crud.updateForm('time_start', e.target.value)} /></FormField>
          <FormField label="End Time" required><Input type="time" value={crud.formData.time_out || ''} onChange={e => crud.updateForm('time_out', e.target.value)} /></FormField>
          <FormField label="Room" required><Select value={crud.formData.room_id || ''} onChange={e => crud.updateForm('room_id', e.target.value)}><option value="">Select Room</option>{rooms.map(r => <option key={r.id} value={r.id}>{r.name || r.room_number}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Schedule Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Day: crud.selected.day_of_week,
              'Start Time': startTime(crud.selected),
              'End Time': endTime(crud.selected),
              Course: crud.selected.teacher_course?.course?.subject?.name,
              Teacher: crud.selected.teacher_course?.teacher?.user?.name,
              Room: crud.selected.room?.name || crud.selected.room?.room_number,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Schedule" message="Delete this schedule entry?" />
    </div>
  )
}