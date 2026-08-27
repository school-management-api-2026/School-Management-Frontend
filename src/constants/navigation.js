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
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'User Management',
    items: [
      { name: 'Users', path: '/users', icon: Users },
      { name: 'Roles', path: '/roles', icon: Shield },
    ],
  },
  {
    label: 'People',
    items: [
      { name: 'Students', path: '/students', icon: GraduationCap },
      { name: 'Parents', path: '/parents', icon: UserCheck },
      { name: 'Teachers', path: '/teachers', icon: BookUser },
      { name: 'Payrolls', path: '/payrolls', icon: Wallet },
    ],
  },
  {
    label: 'Academics',
    items: [
      { name: 'Subjects', path: '/subjects', icon: BookOpen },
      { name: 'Courses', path: '/courses', icon: LibraryBig },
      { name: 'Enrollments', path: '/enrollments', icon: ClipboardList },
      { name: 'Schedules', path: '/schedules', icon: CalendarDays },
      { name: 'Exams', path: '/exams', icon: FileText },
      { name: 'Results', path: '/results', icon: Award },
    ],
  },
  {
    label: 'Campus',
    items: [
      { name: 'Buildings', path: '/buildings', icon: Building2 },
      { name: 'Floors', path: '/floors', icon: Layers },
      { name: 'Rooms', path: '/rooms', icon: DoorOpen },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Invoices', path: '/invoices', icon: Receipt },
      { name: 'Payments', path: '/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Authors', path: '/authors', icon: PenTool },
      { name: 'Books', path: '/books', icon: Library },
      { name: 'Book Copies', path: '/book-copies', icon: BookCopy },
      { name: 'Book Loans', path: '/book-loans', icon: BookMarked },
      { name: 'Fines', path: '/fines', icon: HandCoins },
    ],
  },
  {
    label: 'Tracking',
    items: [
      { name: 'Attendance', path: '/attendance', icon: UserRoundCheck },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Reports', path: '/reports', icon: BarChart3 },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]

export const logoutItem = { name: 'Logout', path: '/logout', icon: LogOut }
