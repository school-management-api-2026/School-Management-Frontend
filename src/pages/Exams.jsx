import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { exams as mockExams, courses, teachers } from '../data/mockData'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import FilterDropdown from '../components/common/FilterDropdown'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const examTypes = ['Quiz', 'Midterm', 'Final', 'Assignment']
const columns = [
    { key: 'examDate', label: 'Date' },
    { key: 'examType', label: 'Type' },
    { key: 'courseName', label: 'Course' },
    { key: 'teacherName', label: 'Teacher' },
]

export default function Exams() {
    const toast = useToast()
    const crud = useCrudState(mockExams)

    const save = () => {
        if (!crud.formData.courseId || !crud.formData.examType || !crud.formData.examDate) { toast.error('Course, type, and date are required'); return }
        const course = courses.find(c => c.id === Number(crud.formData.courseId))
        const teacher = teachers.find(t => t.id === Number(crud.formData.teacherId))
        crud.handleSave({ ...crud.formData, courseId: Number(crud.formData.courseId), teacherId: Number(crud.formData.teacherId), courseName: course?.name || '', teacherName: teacher?.name || '' })
        toast.success(crud.selected ? 'Exam updated' : 'Exam created')
    }

    return (
        <div className="space-y-4">
            <PageHeader title="Exams" description="Manage examinations" onAdd={() => crud.openAdd({})} addLabel="Add Exam" />
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search exams..." /></div>
                <FilterDropdown label="All Types" options={examTypes.map(t => ({ value: t, label: t }))} value={crud.filter} onChange={crud.setFilter} />
            </div>

            {crud.paginated.length === 0 ? <EmptyState title="No exams found" action={() => crud.openAdd({})} actionLabel="Add Exam" /> : (
                <>
                    <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
                    <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
                </>
            )}

            <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Exam' : 'Add Exam'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
                <div className="space-y-4">
                    <FormField label="Course" required><Select value={crud.formData.courseId || ''} onChange={e => crud.updateForm('courseId', e.target.value)}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></FormField>
                    <FormField label="Teacher"><Select value={crud.formData.teacherId || ''} onChange={e => crud.updateForm('teacherId', e.target.value)}><option value="">Select Teacher</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select></FormField>
                    <FormField label="Exam Type" required><Select value={crud.formData.examType || ''} onChange={e => crud.updateForm('examType', e.target.value)}><option value="">Select Type</option>{examTypes.map(t => <option key={t} value={t}>{t}</option>)}</Select></FormField>
                    <FormField label="Exam Date" required><Input type="date" value={crud.formData.examDate || ''} onChange={e => crud.updateForm('examDate', e.target.value)} /></FormField>
                </div>
            </Modal>

            <Modal open={crud.viewModal} onClose={crud.closeModals} title="Exam Details">
                {crud.selected && (<div className="space-y-3">{Object.entries({ Date: crud.selected.examDate, Type: crud.selected.examType, Course: crud.selected.courseName, Teacher: crud.selected.teacherName }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
            </Modal>

            <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Exam deleted') }} title="Delete Exam" message="Delete this exam?" />
        </div>
    )
}
