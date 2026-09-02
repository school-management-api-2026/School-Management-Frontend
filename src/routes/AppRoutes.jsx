import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import Loading from '../components/common/Loading'

const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const UsersPage = lazy(() => import('../pages/Users'))
const RolesPage = lazy(() => import('../pages/Roles'))
const StudentsPage = lazy(() => import('../pages/Students'))
const ParentsPage = lazy(() => import('../pages/Parents'))
const TeachersPage = lazy(() => import('../pages/Teachers'))
const PayrollsPage = lazy(() => import('../pages/Payrolls'))
const SubjectsPage = lazy(() => import('../pages/Subjects'))
const CoursesPage = lazy(() => import('../pages/Courses'))
const BuildingsPage = lazy(() => import('../pages/Buildings'))
const FloorsPage = lazy(() => import('../pages/Floors'))
const RoomsPage = lazy(() => import('../pages/Rooms'))
const SchedulesPage = lazy(() => import('../pages/Schedules'))
const EnrollmentsPage = lazy(() => import('../pages/Enrollments'))
const ExamsPage = lazy(() => import('../pages/Exams'))
const ResultsPage = lazy(() => import('../pages/Results'))
const InvoicesPage = lazy(() => import('../pages/Invoices'))
const PaymentsPage = lazy(() => import('../pages/Payments'))
const AuthorsPage = lazy(() => import('../pages/Authors'))
const BooksPage = lazy(() => import('../pages/Books'))
const BookCopiesPage = lazy(() => import('../pages/BookCopies'))
const BookLoansPage = lazy(() => import('../pages/BookLoans'))
const FinesPage = lazy(() => import('../pages/Fines'))
const AttendancePage = lazy(() => import('../pages/Attendance'))
const ReportsPage = lazy(() => import('../pages/Reports'))
const SettingsPage = lazy(() => import('../pages/Settings'))

const LogoutRoute = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  return <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading fullPage />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="parents" element={<ParentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="payrolls" element={<PayrollsPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="buildings" element={<BuildingsPage />} />
          <Route path="floors" element={<FloorsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="authors" element={<AuthorsPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="book-copies" element={<BookCopiesPage />} />
          <Route path="book-loans" element={<BookLoansPage />} />
          <Route path="fines" element={<FinesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="logout" element={<LogoutRoute />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
