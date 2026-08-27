import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { schedules as mockSchedules, rooms, courses, teachers } from '../data/mockData'
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

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const columns = [
  { key: 'day', label: 'Day' },
  { key: 'startTime', label: 'Start' },
  { key: 'endTime', label: 'End' },
  { key: 'courseName', label: 'Course' },
  { key: 'teacherName', label: 'Teacher' },
  { key: 'roomName', label: 'Room' },
]

function CalendarView({ data }) {
  return (
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
                const slot = data.find(s => s.day === day && s.startTime === time)
                return (
                  <td key={day} className="px-2 py-1">
                    {slot ? (
                      <div className="bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-lg p-2">
                        <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 truncate">{slot.courseName}</p>
                        <p className="text-[10px] text-surface-500 truncate">{slot.teacherName}</p>
                        <p className="text-[10px] text-surface-400 truncate">{slot.roomName} · {slot.startTime}-{slot.endTime}</p>
                      </div>
                    ) : null}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Schedules() {
  const toast = useToast()
  const crud = useCrudState(mockSchedules)
  const [view, setView] = useState('calendar')

  const save = () => {
    if (!crud.formData.day || !crud.formData.startTime || !crud.formData.courseId || !crud.formData.roomId) {
      toast.error('Day, time, course, and room are required'); return
    }
    const course = courses.find(c => c.id === Number(crud.formData.courseId))
    const room = rooms.find(r => r.id === Number(crud.formData.roomId))
    const teacher = teachers.find(t => t.id === Number(crud.formData.teacherId))
    crud.handleSave({ ...crud.formData, courseId: Number(crud.formData.courseId), roomId: Number(crud.formData.roomId), teacherId: Number(crud.formData.teacherId), courseName: course?.name || '', roomName: room?.roomName || '', teacherName: teacher?.name || '' })
    toast.success(crud.selected ? 'Schedule updated' : 'Schedule created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Schedules" description="Manage class schedules" onAdd={() => crud.openAdd({})} addLabel="Add Schedule">
        <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
          <button onClick={() => setView('calendar')} className={`p-2 ${view === 'calendar' ? 'bg-primary-600 text-white' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'} transition-colors`}><CalendarDays size={18} /></button>
          <button onClick={() => setView('table')} className={`p-2 ${view === 'table' ? 'bg-primary-600 text-white' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'} transition-colors`}><List size={18} /></button>
        </div>
      </PageHeader>

      {view === 'table' && (
        <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search schedules..." /></div>
      )}

      {view === 'calendar' ? (
        <CalendarView data={crud.filtered} />
      ) : crud.paginated.length === 0 ? (
        <EmptyState title="No schedules found" action={() => crud.openAdd({})} actionLabel="Add Schedule" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Schedule' : 'Add Schedule'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Day" required><Select value={crud.formData.day || ''} onChange={e => crud.updateForm('day', e.target.value)}><option value="">Select Day</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</Select></FormField>
          <FormField label="Course" required><Select value={crud.formData.courseId || ''} onChange={e => crud.updateForm('courseId', e.target.value)}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></FormField>
          <FormField label="Start Time" required><Input type="time" value={crud.formData.startTime || ''} onChange={e => crud.updateForm('startTime', e.target.value)} /></FormField>
          <FormField label="End Time" required><Input type="time" value={crud.formData.endTime || ''} onChange={e => crud.updateForm('endTime', e.target.value)} /></FormField>
          <FormField label="Room" required><Select value={crud.formData.roomId || ''} onChange={e => crud.updateForm('roomId', e.target.value)}><option value="">Select Room</option>{rooms.map(r => <option key={r.id} value={r.id}>{r.roomName} ({r.buildingName})</option>)}</Select></FormField>
          <FormField label="Teacher"><Select value={crud.formData.teacherId || ''} onChange={e => crud.updateForm('teacherId', e.target.value)}><option value="">Select Teacher</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Schedule Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Day: crud.selected.day, 'Start Time': crud.selected.startTime, 'End Time': crud.selected.endTime, Course: crud.selected.courseName, Teacher: crud.selected.teacherName, Room: crud.selected.roomName }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Schedule deleted') }} title="Delete Schedule" message="Delete this schedule entry?" />
    </div>
  )
}
