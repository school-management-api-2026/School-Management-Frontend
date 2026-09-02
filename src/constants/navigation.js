import {
  LayoutDashboard, Users, Shield, GraduationCap, UserCheck, BookUser,
  Wallet, BookOpen, LibraryBig, Building2, Layers, DoorOpen, CalendarDays,
  ClipboardList, FileText, Award, Receipt, CreditCard, Library,
  PenTool, BookCopy, BookMarked, HandCoins, UserRoundCheck,
  BarChart3, Settings, LogOut
} from 'lucide-react'

export const navGroups = [
  {
    label: 'Main',
    allowedRoles: [1, 2, 3, 4],
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'User Management',
    allowedRoles: [1],
    items: [
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Roles', path: '/admin/roles', icon: Shield },
    ],
  },
  {
    label: 'People',
    allowedRoles: [1, 2],
    items: [
      { name: 'Students', path: '/admin/students', icon: GraduationCap },
      { name: 'Parents', path: '/admin/parents', icon: UserCheck },
      { name: 'Teachers', path: '/admin/teachers', icon: BookUser },
      { name: 'Payrolls', path: '/admin/payrolls', icon: Wallet },
    ],
  },
  {
    label: 'Academics',
    allowedRoles: [1, 2, 4],
    items: [
      { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
      { name: 'Courses', path: '/admin/courses', icon: LibraryBig },
      { name: 'Enrollments', path: '/admin/enrollments', icon: ClipboardList },
      { name: 'Schedules', path: '/admin/schedules', icon: CalendarDays },
      { name: 'Exams', path: '/admin/exams', icon: FileText },
      { name: 'Results', path: '/admin/results', icon: Award },
    ],
  },
  {
    label: 'Campus',
    allowedRoles: [1],
    items: [
      { name: 'Buildings', path: '/admin/buildings', icon: Building2 },
      { name: 'Floors', path: '/admin/floors', icon: Layers },
      { name: 'Rooms', path: '/admin/rooms', icon: DoorOpen },
    ],
  },
  {
    label: 'Finance',
    allowedRoles: [1, 4],
    items: [
      { name: 'Invoices', path: '/admin/invoices', icon: Receipt },
      { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Library',
    allowedRoles: [1, 3, 4],
    items: [
      { name: 'Authors', path: '/admin/authors', icon: PenTool },
      { name: 'Books', path: '/admin/books', icon: Library },
      { name: 'Book Copies', path: '/admin/book-copies', icon: BookCopy },
      { name: 'Book Loans', path: '/admin/book-loans', icon: BookMarked },
      { name: 'Fines', path: '/admin/fines', icon: HandCoins },
    ],
  },
  {
    label: 'Tracking',
    allowedRoles: [1, 2],
    items: [
      { name: 'Attendance', path: '/admin/attendance', icon: UserRoundCheck },
    ],
  },
  {
    label: 'System',
    allowedRoles: [1],
    items: [
      { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
]

export const logoutItem = { name: 'Logout', path: '/admin/logout', icon: LogOut }
