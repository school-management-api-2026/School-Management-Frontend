export const roles = [
  { id: 1, name: 'Admin', description: 'Full system access', usersCount: 2 },
  { id: 2, name: 'Teacher', description: 'Teaching staff access', usersCount: 8 },
  { id: 3, name: 'Student', description: 'Student portal access', usersCount: 45 },
  { id: 4, name: 'Parent', description: 'Parent portal access', usersCount: 30 },
  { id: 5, name: 'Librarian', description: 'Library management access', usersCount: 3 },
]

export const users = [
  { id: 1, name: 'John Admin', username: 'john_admin', email: 'john@school.com', phone: '012-555-0101', gender: 'Male', dob: '1985-03-15', image: null, roleId: 1, roleName: 'Admin', status: 'Active' },
  { id: 2, name: 'Sarah Manager', username: 'sarah_mgr', email: 'sarah@school.com', phone: '012-555-0102', gender: 'Female', dob: '1988-07-22', image: null, roleId: 1, roleName: 'Admin', status: 'Active' },
  { id: 3, name: 'Michael Chen', username: 'mchen', email: 'mchen@school.com', phone: '012-555-0201', gender: 'Male', dob: '1990-01-10', image: null, roleId: 2, roleName: 'Teacher', status: 'Active' },
  { id: 4, name: 'Emily Watson', username: 'ewatson', email: 'ewatson@school.com', phone: '012-555-0202', gender: 'Female', dob: '1987-11-05', image: null, roleId: 2, roleName: 'Teacher', status: 'Active' },
  { id: 5, name: 'Robert Kim', username: 'rkim', email: 'rkim@school.com', phone: '012-555-0203', gender: 'Male', dob: '1992-06-18', image: null, roleId: 2, roleName: 'Teacher', status: 'Active' },
  { id: 6, name: 'Lisa Park', username: 'lpark', email: 'lpark@school.com', phone: '012-555-0204', gender: 'Female', dob: '1991-09-30', image: null, roleId: 2, roleName: 'Teacher', status: 'Active' },
  { id: 7, name: 'David Brown', username: 'dbrown', email: 'dbrown@school.com', phone: '012-555-0205', gender: 'Male', dob: '1989-04-12', image: null, roleId: 2, roleName: 'Teacher', status: 'Inactive' },
  { id: 8, name: 'Jennifer Lee', username: 'jlee', email: 'jlee@school.com', phone: '012-555-0206', gender: 'Female', dob: '1993-12-25', image: null, roleId: 2, roleName: 'Teacher', status: 'Active' },
  { id: 9, name: 'Alex Rivera', username: 'arivera', email: 'arivera@school.com', phone: '012-555-0301', gender: 'Male', dob: '2008-02-14', image: null, roleId: 3, roleName: 'Student', status: 'Active' },
  { id: 10, name: 'Sophia Martinez', username: 'smartinez', email: 'smartinez@school.com', phone: '012-555-0302', gender: 'Female', dob: '2007-08-20', image: null, roleId: 3, roleName: 'Student', status: 'Active' },
  { id: 11, name: 'James Wilson', username: 'jwilson', email: 'jwilson@school.com', phone: '012-555-0303', gender: 'Male', dob: '2008-05-03', image: null, roleId: 3, roleName: 'Student', status: 'Active' },
  { id: 12, name: 'Olivia Taylor', username: 'otaylor', email: 'otaylor@school.com', phone: '012-555-0304', gender: 'Female', dob: '2007-10-11', image: null, roleId: 3, roleName: 'Student', status: 'Active' },
  { id: 13, name: 'Daniel Nguyen', username: 'dnguyen', email: 'dnguyen@school.com', phone: '012-555-0305', gender: 'Male', dob: '2008-01-28', image: null, roleId: 3, roleName: 'Student', status: 'Active' },
  { id: 14, name: 'Maria Garcia', username: 'mgarcia', email: 'mgarcia@school.com', phone: '012-555-0401', gender: 'Female', dob: '1975-06-15', image: null, roleId: 4, roleName: 'Parent', status: 'Active' },
  { id: 15, name: 'Thomas Rivera', username: 'trivera', email: 'trivera@school.com', phone: '012-555-0402', gender: 'Male', dob: '1972-11-20', image: null, roleId: 4, roleName: 'Parent', status: 'Active' },
  { id: 16, name: 'Susan Wilson', username: 'swilson', email: 'swilson@school.com', phone: '012-555-0403', gender: 'Female', dob: '1978-03-08', image: null, roleId: 4, roleName: 'Parent', status: 'Active' },
  { id: 17, name: 'Mark Taylor', username: 'mtaylor', email: 'mtaylor@school.com', phone: '012-555-0404', gender: 'Male', dob: '1976-09-14', image: null, roleId: 4, roleName: 'Parent', status: 'Active' },
  { id: 18, name: 'Anna Librarian', username: 'anna_lib', email: 'anna@school.com', phone: '012-555-0501', gender: 'Female', dob: '1990-05-20', image: null, roleId: 5, roleName: 'Librarian', status: 'Active' },
]

export const students = [
  { id: 1, userId: 9, name: 'Alex Rivera', email: 'arivera@school.com', phone: '012-555-0301', gender: 'Male', dob: '2008-02-14', enrollmentDate: '2024-09-01', status: 'Active' },
  { id: 2, userId: 10, name: 'Sophia Martinez', email: 'smartinez@school.com', phone: '012-555-0302', gender: 'Female', dob: '2007-08-20', enrollmentDate: '2024-09-01', status: 'Active' },
  { id: 3, userId: 11, name: 'James Wilson', email: 'jwilson@school.com', phone: '012-555-0303', gender: 'Male', dob: '2008-05-03', enrollmentDate: '2024-09-01', status: 'Active' },
  { id: 4, userId: 12, name: 'Olivia Taylor', email: 'otaylor@school.com', phone: '012-555-0304', gender: 'Female', dob: '2007-10-11', enrollmentDate: '2025-01-15', status: 'Active' },
  { id: 5, userId: 13, name: 'Daniel Nguyen', email: 'dnguyen@school.com', phone: '012-555-0305', gender: 'Male', dob: '2008-01-28', enrollmentDate: '2025-01-15', status: 'Active' },
]

export const parents = [
  { id: 1, userId: 14, name: 'Maria Garcia', email: 'mgarcia@school.com', phone: '012-555-0401', gender: 'Female' },
  { id: 2, userId: 15, name: 'Thomas Rivera', email: 'trivera@school.com', phone: '012-555-0402', gender: 'Male' },
  { id: 3, userId: 16, name: 'Susan Wilson', email: 'swilson@school.com', phone: '012-555-0403', gender: 'Female' },
  { id: 4, userId: 17, name: 'Mark Taylor', email: 'mtaylor@school.com', phone: '012-555-0404', gender: 'Male' },
]

export const studentParents = [
  { id: 1, studentId: 1, parentId: 2, studentName: 'Alex Rivera', parentName: 'Thomas Rivera', relation: 'Father', isPrimary: true },
  { id: 2, studentId: 2, parentId: 1, studentName: 'Sophia Martinez', parentName: 'Maria Garcia', relation: 'Mother', isPrimary: true },
  { id: 3, studentId: 3, parentId: 3, studentName: 'James Wilson', parentName: 'Susan Wilson', relation: 'Mother', isPrimary: true },
  { id: 4, studentId: 4, parentId: 4, studentName: 'Olivia Taylor', parentName: 'Mark Taylor', relation: 'Father', isPrimary: true },
  { id: 5, studentId: 3, parentId: 4, studentName: 'James Wilson', parentName: 'Mark Taylor', relation: 'Uncle', isPrimary: false },
]

export const teachers = [
  { id: 1, userId: 3, name: 'Michael Chen', email: 'mchen@school.com', phone: '012-555-0201', gender: 'Male', hireDate: '2020-08-15', specialization: 'Mathematics', status: 'Active' },
  { id: 2, userId: 4, name: 'Emily Watson', email: 'ewatson@school.com', phone: '012-555-0202', gender: 'Female', hireDate: '2019-09-01', specialization: 'English', status: 'Active' },
  { id: 3, userId: 5, name: 'Robert Kim', email: 'rkim@school.com', phone: '012-555-0203', gender: 'Male', hireDate: '2021-01-10', specialization: 'Science', status: 'Active' },
  { id: 4, userId: 6, name: 'Lisa Park', email: 'lpark@school.com', phone: '012-555-0204', gender: 'Female', hireDate: '2022-03-20', specialization: 'Computer Science', status: 'Active' },
  { id: 5, userId: 7, name: 'David Brown', email: 'dbrown@school.com', phone: '012-555-0205', gender: 'Male', hireDate: '2018-11-15', specialization: 'History', status: 'Inactive' },
  { id: 6, userId: 8, name: 'Jennifer Lee', email: 'jlee@school.com', phone: '012-555-0206', gender: 'Female', hireDate: '2023-06-01', specialization: 'Art', status: 'Active' },
]

export const payrolls = [
  { id: 1, teacherId: 1, teacherName: 'Michael Chen', baseSalary: 4500, bonus: 500, deduction: 200, netSalary: 4800, payDate: '2026-07-31', payPeriod: 'July 2026', status: 'Paid' },
  { id: 2, teacherId: 2, teacherName: 'Emily Watson', baseSalary: 4200, bonus: 300, deduction: 150, netSalary: 4350, payDate: '2026-07-31', payPeriod: 'July 2026', status: 'Paid' },
  { id: 3, teacherId: 3, teacherName: 'Robert Kim', baseSalary: 4000, bonus: 400, deduction: 180, netSalary: 4220, payDate: '2026-07-31', payPeriod: 'July 2026', status: 'Paid' },
  { id: 4, teacherId: 4, teacherName: 'Lisa Park', baseSalary: 4300, bonus: 600, deduction: 200, netSalary: 4700, payDate: '2026-07-31', payPeriod: 'July 2026', status: 'Paid' },
  { id: 5, teacherId: 1, teacherName: 'Michael Chen', baseSalary: 4500, bonus: 500, deduction: 200, netSalary: 4800, payDate: '2026-08-31', payPeriod: 'August 2026', status: 'Pending' },
  { id: 6, teacherId: 6, teacherName: 'Jennifer Lee', baseSalary: 3800, bonus: 200, deduction: 100, netSalary: 3900, payDate: '2026-07-31', payPeriod: 'July 2026', status: 'Paid' },
]

export const subjects = [
  { id: 1, name: 'Mathematics', code: 'MATH', description: 'Study of numbers and equations', coursesCount: 3 },
  { id: 2, name: 'English', code: 'ENG', description: 'English language and literature', coursesCount: 2 },
  { id: 3, name: 'Science', code: 'SCI', description: 'Natural sciences', coursesCount: 2 },
  { id: 4, name: 'Computer Science', code: 'CS', description: 'Programming and computing', coursesCount: 2 },
  { id: 5, name: 'History', code: 'HIST', description: 'World and national history', coursesCount: 1 },
  { id: 6, name: 'Art', code: 'ART', description: 'Visual and performing arts', coursesCount: 1 },
]

export const courses = [
  { id: 1, name: 'Algebra I', subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Michael Chen', unitPrice: 250, promotion: 10, capacity: 30, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
  { id: 2, name: 'Geometry', subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Michael Chen', unitPrice: 250, promotion: 0, capacity: 28, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
  { id: 3, name: 'Calculus', subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Michael Chen', unitPrice: 300, promotion: 5, capacity: 25, startDate: '2027-02-01', endDate: '2027-06-15', status: 'Pending' },
  { id: 4, name: 'English Literature', subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Emily Watson', unitPrice: 200, promotion: 0, capacity: 35, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
  { id: 5, name: 'Creative Writing', subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Emily Watson', unitPrice: 180, promotion: 15, capacity: 20, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
  { id: 6, name: 'Physics', subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Robert Kim', unitPrice: 280, promotion: 0, capacity: 30, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
  { id: 7, name: 'Chemistry', subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Robert Kim', unitPrice: 280, promotion: 0, capacity: 30, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
  { id: 8, name: 'Web Development', subjectId: 4, subjectName: 'Computer Science', teacherId: 4, teacherName: 'Lisa Park', unitPrice: 350, promotion: 20, capacity: 25, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
  { id: 9, name: 'Data Structures', subjectId: 4, subjectName: 'Computer Science', teacherId: 4, teacherName: 'Lisa Park', unitPrice: 350, promotion: 0, capacity: 25, startDate: '2027-02-01', endDate: '2027-06-15', status: 'Pending' },
  { id: 10, name: 'World History', subjectId: 5, subjectName: 'History', teacherId: 5, teacherName: 'David Brown', unitPrice: 200, promotion: 0, capacity: 35, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Inactive' },
  { id: 11, name: 'Digital Art', subjectId: 6, subjectName: 'Art', teacherId: 6, teacherName: 'Jennifer Lee', unitPrice: 220, promotion: 10, capacity: 20, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Active' },
]

export const buildings = [
  { id: 1, name: 'Main Building', totalFloors: 4, address: '123 Education Ave' },
  { id: 2, name: 'Science Block', totalFloors: 3, address: '125 Education Ave' },
  { id: 3, name: 'Library Building', totalFloors: 2, address: '127 Education Ave' },
]

export const floors = [
  { id: 1, floorNumber: 1, buildingId: 1, buildingName: 'Main Building' },
  { id: 2, floorNumber: 2, buildingId: 1, buildingName: 'Main Building' },
  { id: 3, floorNumber: 3, buildingId: 1, buildingName: 'Main Building' },
  { id: 4, floorNumber: 4, buildingId: 1, buildingName: 'Main Building' },
  { id: 5, floorNumber: 1, buildingId: 2, buildingName: 'Science Block' },
  { id: 6, floorNumber: 2, buildingId: 2, buildingName: 'Science Block' },
  { id: 7, floorNumber: 3, buildingId: 2, buildingName: 'Science Block' },
  { id: 8, floorNumber: 1, buildingId: 3, buildingName: 'Library Building' },
  { id: 9, floorNumber: 2, buildingId: 3, buildingName: 'Library Building' },
]

export const rooms = [
  { id: 1, roomName: 'Lecture Hall A', roomNumber: '101', roomType: 'Lecture Hall', capacity: 60, floorId: 1, floorNumber: 1, buildingName: 'Main Building' },
  { id: 2, roomName: 'Room 102', roomNumber: '102', roomType: 'Classroom', capacity: 35, floorId: 1, floorNumber: 1, buildingName: 'Main Building' },
  { id: 3, roomName: 'Room 201', roomNumber: '201', roomType: 'Classroom', capacity: 30, floorId: 2, floorNumber: 2, buildingName: 'Main Building' },
  { id: 4, roomName: 'Computer Lab 1', roomNumber: '301', roomType: 'Lab', capacity: 25, floorId: 3, floorNumber: 3, buildingName: 'Main Building' },
  { id: 5, roomName: 'Physics Lab', roomNumber: '101', roomType: 'Lab', capacity: 30, floorId: 5, floorNumber: 1, buildingName: 'Science Block' },
  { id: 6, roomName: 'Chemistry Lab', roomNumber: '201', roomType: 'Lab', capacity: 30, floorId: 6, floorNumber: 2, buildingName: 'Science Block' },
  { id: 7, roomName: 'Reading Room', roomNumber: '101', roomType: 'Library', capacity: 50, floorId: 8, floorNumber: 1, buildingName: 'Library Building' },
  { id: 8, roomName: 'Art Studio', roomNumber: '401', roomType: 'Studio', capacity: 20, floorId: 4, floorNumber: 4, buildingName: 'Main Building' },
]

export const schedules = [
  { id: 1, day: 'Monday', startTime: '08:00', endTime: '09:30', roomId: 2, roomName: 'Room 102', courseId: 1, courseName: 'Algebra I', teacherId: 1, teacherName: 'Michael Chen' },
  { id: 2, day: 'Monday', startTime: '10:00', endTime: '11:30', roomId: 3, roomName: 'Room 201', courseId: 4, courseName: 'English Literature', teacherId: 2, teacherName: 'Emily Watson' },
  { id: 3, day: 'Monday', startTime: '13:00', endTime: '14:30', roomId: 5, roomName: 'Physics Lab', courseId: 6, courseName: 'Physics', teacherId: 3, teacherName: 'Robert Kim' },
  { id: 4, day: 'Tuesday', startTime: '08:00', endTime: '09:30', roomId: 4, roomName: 'Computer Lab 1', courseId: 8, courseName: 'Web Development', teacherId: 4, teacherName: 'Lisa Park' },
  { id: 5, day: 'Tuesday', startTime: '10:00', endTime: '11:30', roomId: 2, roomName: 'Room 102', courseId: 2, courseName: 'Geometry', teacherId: 1, teacherName: 'Michael Chen' },
  { id: 6, day: 'Wednesday', startTime: '08:00', endTime: '09:30', roomId: 6, roomName: 'Chemistry Lab', courseId: 7, courseName: 'Chemistry', teacherId: 3, teacherName: 'Robert Kim' },
  { id: 7, day: 'Wednesday', startTime: '10:00', endTime: '11:30', roomId: 3, roomName: 'Room 201', courseId: 5, courseName: 'Creative Writing', teacherId: 2, teacherName: 'Emily Watson' },
  { id: 8, day: 'Thursday', startTime: '08:00', endTime: '09:30', roomId: 8, roomName: 'Art Studio', courseId: 11, courseName: 'Digital Art', teacherId: 6, teacherName: 'Jennifer Lee' },
  { id: 9, day: 'Thursday', startTime: '10:00', endTime: '11:30', roomId: 2, roomName: 'Room 102', courseId: 1, courseName: 'Algebra I', teacherId: 1, teacherName: 'Michael Chen' },
  { id: 10, day: 'Friday', startTime: '08:00', endTime: '09:30', roomId: 4, roomName: 'Computer Lab 1', courseId: 8, courseName: 'Web Development', teacherId: 4, teacherName: 'Lisa Park' },
  { id: 11, day: 'Friday', startTime: '10:00', endTime: '11:30', roomId: 5, roomName: 'Physics Lab', courseId: 6, courseName: 'Physics', teacherId: 3, teacherName: 'Robert Kim' },
  { id: 12, day: 'Friday', startTime: '13:00', endTime: '14:30', roomId: 1, roomName: 'Lecture Hall A', courseId: 4, courseName: 'English Literature', teacherId: 2, teacherName: 'Emily Watson' },
]

export const enrollments = [
  { id: 1, studentId: 1, studentName: 'Alex Rivera', courseId: 1, courseName: 'Algebra I', enrollmentDate: '2026-08-20', status: 'Enrolled' },
  { id: 2, studentId: 1, studentName: 'Alex Rivera', courseId: 6, courseName: 'Physics', enrollmentDate: '2026-08-20', status: 'Enrolled' },
  { id: 3, studentId: 1, studentName: 'Alex Rivera', courseId: 8, courseName: 'Web Development', enrollmentDate: '2026-08-22', status: 'Enrolled' },
  { id: 4, studentId: 2, studentName: 'Sophia Martinez', courseId: 4, courseName: 'English Literature', enrollmentDate: '2026-08-20', status: 'Enrolled' },
  { id: 5, studentId: 2, studentName: 'Sophia Martinez', courseId: 5, courseName: 'Creative Writing', enrollmentDate: '2026-08-20', status: 'Enrolled' },
  { id: 6, studentId: 3, studentName: 'James Wilson', courseId: 1, courseName: 'Algebra I', enrollmentDate: '2026-08-21', status: 'Enrolled' },
  { id: 7, studentId: 3, studentName: 'James Wilson', courseId: 7, courseName: 'Chemistry', enrollmentDate: '2026-08-21', status: 'Enrolled' },
  { id: 8, studentId: 4, studentName: 'Olivia Taylor', courseId: 11, courseName: 'Digital Art', enrollmentDate: '2026-08-22', status: 'Enrolled' },
  { id: 9, studentId: 4, studentName: 'Olivia Taylor', courseId: 2, courseName: 'Geometry', enrollmentDate: '2026-08-22', status: 'Enrolled' },
  { id: 10, studentId: 5, studentName: 'Daniel Nguyen', courseId: 8, courseName: 'Web Development', enrollmentDate: '2026-08-23', status: 'Enrolled' },
  { id: 11, studentId: 5, studentName: 'Daniel Nguyen', courseId: 6, courseName: 'Physics', enrollmentDate: '2026-08-23', status: 'Dropped' },
]

export const exams = [
  { id: 1, examDate: '2026-10-15', examType: 'Midterm', courseId: 1, courseName: 'Algebra I', teacherId: 1, teacherName: 'Michael Chen' },
  { id: 2, examDate: '2026-10-16', examType: 'Midterm', courseId: 4, courseName: 'English Literature', teacherId: 2, teacherName: 'Emily Watson' },
  { id: 3, examDate: '2026-10-17', examType: 'Midterm', courseId: 6, courseName: 'Physics', teacherId: 3, teacherName: 'Robert Kim' },
  { id: 4, examDate: '2026-10-18', examType: 'Midterm', courseId: 8, courseName: 'Web Development', teacherId: 4, teacherName: 'Lisa Park' },
  { id: 5, examDate: '2027-01-10', examType: 'Final', courseId: 1, courseName: 'Algebra I', teacherId: 1, teacherName: 'Michael Chen' },
  { id: 6, examDate: '2026-09-20', examType: 'Quiz', courseId: 7, courseName: 'Chemistry', teacherId: 3, teacherName: 'Robert Kim' },
]

export const results = [
  { id: 1, studentId: 1, studentName: 'Alex Rivera', examId: 1, examName: 'Algebra I — Midterm', score: 92, grade: 'A' },
  { id: 2, studentId: 3, studentName: 'James Wilson', examId: 1, examName: 'Algebra I — Midterm', score: 78, grade: 'B+' },
  { id: 3, studentId: 2, studentName: 'Sophia Martinez', examId: 2, examName: 'English Literature — Midterm', score: 95, grade: 'A+' },
  { id: 4, studentId: 1, studentName: 'Alex Rivera', examId: 3, examName: 'Physics — Midterm', score: 85, grade: 'A-' },
  { id: 5, studentId: 1, studentName: 'Alex Rivera', examId: 4, examName: 'Web Development — Midterm', score: 98, grade: 'A+' },
  { id: 6, studentId: 4, studentName: 'Olivia Taylor', examId: 2, examName: 'English Literature — Midterm', score: 88, grade: 'A-' },
]

export const invoices = [
  { id: 1, studentId: 1, studentName: 'Alex Rivera', courseId: 1, courseName: 'Algebra I', totalAmount: 225, dueDate: '2026-09-15', status: 'Paid' },
  { id: 2, studentId: 1, studentName: 'Alex Rivera', courseId: 6, courseName: 'Physics', totalAmount: 280, dueDate: '2026-09-15', status: 'Paid' },
  { id: 3, studentId: 1, studentName: 'Alex Rivera', courseId: 8, courseName: 'Web Development', totalAmount: 280, dueDate: '2026-09-15', status: 'Unpaid' },
  { id: 4, studentId: 2, studentName: 'Sophia Martinez', courseId: 4, courseName: 'English Literature', totalAmount: 200, dueDate: '2026-09-15', status: 'Paid' },
  { id: 5, studentId: 2, studentName: 'Sophia Martinez', courseId: 5, courseName: 'Creative Writing', totalAmount: 153, dueDate: '2026-09-15', status: 'Partial' },
  { id: 6, studentId: 3, studentName: 'James Wilson', courseId: 1, courseName: 'Algebra I', totalAmount: 225, dueDate: '2026-09-15', status: 'Unpaid' },
  { id: 7, studentId: 4, studentName: 'Olivia Taylor', courseId: 11, courseName: 'Digital Art', totalAmount: 198, dueDate: '2026-09-15', status: 'Paid' },
  { id: 8, studentId: 5, studentName: 'Daniel Nguyen', courseId: 8, courseName: 'Web Development', totalAmount: 280, dueDate: '2026-09-15', status: 'Paid' },
]

export const payments = [
  { id: 1, invoiceId: 1, invoiceRef: 'INV-001', amount: 225, paymentDate: '2026-09-10', paymentMethod: 'Credit Card', status: 'Completed' },
  { id: 2, invoiceId: 2, invoiceRef: 'INV-002', amount: 280, paymentDate: '2026-09-12', paymentMethod: 'Bank Transfer', status: 'Completed' },
  { id: 3, invoiceId: 4, invoiceRef: 'INV-004', amount: 200, paymentDate: '2026-09-14', paymentMethod: 'Cash', status: 'Completed' },
  { id: 4, invoiceId: 5, invoiceRef: 'INV-005', amount: 100, paymentDate: '2026-09-14', paymentMethod: 'Credit Card', status: 'Completed' },
  { id: 5, invoiceId: 7, invoiceRef: 'INV-007', amount: 198, paymentDate: '2026-09-13', paymentMethod: 'Bank Transfer', status: 'Completed' },
  { id: 6, invoiceId: 8, invoiceRef: 'INV-008', amount: 280, paymentDate: '2026-09-11', paymentMethod: 'Credit Card', status: 'Completed' },
]

export const authors = [
  { id: 1, name: 'J.K. Rowling', bio: 'British author known for the Harry Potter series' },
  { id: 2, name: 'George Orwell', bio: 'English novelist known for 1984 and Animal Farm' },
  { id: 3, name: 'Mark Twain', bio: 'American humorist and author of Tom Sawyer' },
  { id: 4, name: 'Jane Austen', bio: 'English novelist known for Pride and Prejudice' },
  { id: 5, name: 'Robert C. Martin', bio: 'Software engineer and author of Clean Code' },
]

export const books = [
  { id: 1, title: 'Introduction to Algorithms', isbn: '978-0262033848', category: 'Computer Science', authorIds: [5], authorNames: ['Robert C. Martin'], copiesCount: 5 },
  { id: 2, title: 'Pride and Prejudice', isbn: '978-0141439518', category: 'Literature', authorIds: [4], authorNames: ['Jane Austen'], copiesCount: 3 },
  { id: 3, title: '1984', isbn: '978-0451524935', category: 'Literature', authorIds: [2], authorNames: ['George Orwell'], copiesCount: 4 },
  { id: 4, title: 'The Adventures of Tom Sawyer', isbn: '978-0486400778', category: 'Literature', authorIds: [3], authorNames: ['Mark Twain'], copiesCount: 2 },
  { id: 5, title: 'Clean Code', isbn: '978-0132350884', category: 'Computer Science', authorIds: [5], authorNames: ['Robert C. Martin'], copiesCount: 3 },
  { id: 6, title: 'Physics Fundamentals', isbn: '978-1118230718', category: 'Science', authorIds: [], authorNames: [], copiesCount: 4 },
]

export const bookCopies = [
  { id: 1, barcode: 'BC-0001', bookId: 1, bookTitle: 'Introduction to Algorithms', status: 'Available' },
  { id: 2, barcode: 'BC-0002', bookId: 1, bookTitle: 'Introduction to Algorithms', status: 'Borrowed' },
  { id: 3, barcode: 'BC-0003', bookId: 2, bookTitle: 'Pride and Prejudice', status: 'Available' },
  { id: 4, barcode: 'BC-0004', bookId: 3, bookTitle: '1984', status: 'Available' },
  { id: 5, barcode: 'BC-0005', bookId: 3, bookTitle: '1984', status: 'Borrowed' },
  { id: 6, barcode: 'BC-0006', bookId: 5, bookTitle: 'Clean Code', status: 'Damaged' },
  { id: 7, barcode: 'BC-0007', bookId: 6, bookTitle: 'Physics Fundamentals', status: 'Available' },
]

export const bookLoans = [
  { id: 1, borrowerId: 9, borrowerName: 'Alex Rivera', bookCopyId: 2, bookCopyBarcode: 'BC-0002', bookTitle: 'Introduction to Algorithms', loanDate: '2026-08-15', dueDate: '2026-09-15', returnDate: null, status: 'Borrowed', staffId: 18, staffName: 'Anna Librarian' },
  { id: 2, borrowerId: 10, borrowerName: 'Sophia Martinez', bookCopyId: 5, bookCopyBarcode: 'BC-0005', bookTitle: '1984', loanDate: '2026-08-10', dueDate: '2026-09-10', returnDate: null, status: 'Overdue', staffId: 18, staffName: 'Anna Librarian' },
  { id: 3, borrowerId: 11, borrowerName: 'James Wilson', bookCopyId: 3, bookCopyBarcode: 'BC-0003', bookTitle: 'Pride and Prejudice', loanDate: '2026-08-01', dueDate: '2026-09-01', returnDate: '2026-08-25', status: 'Returned', staffId: 18, staffName: 'Anna Librarian' },
]

export const fines = [
  { id: 1, bookLoanId: 2, borrowerName: 'Sophia Martinez', bookTitle: '1984', amount: 5.00, paidStatus: 'Unpaid', reason: 'Overdue return' },
  { id: 2, bookLoanId: 3, borrowerName: 'James Wilson', bookTitle: 'Pride and Prejudice', amount: 0, paidStatus: 'N/A', reason: 'No fine' },
]

export const attendance = [
  { id: 1, userId: 9, userName: 'Alex Rivera', date: '2026-08-27', timeIn: '07:55', timeOut: '15:30', status: 'Present' },
  { id: 2, userId: 10, userName: 'Sophia Martinez', date: '2026-08-27', timeIn: '08:10', timeOut: '15:30', status: 'Late' },
  { id: 3, userId: 11, userName: 'James Wilson', date: '2026-08-27', timeIn: null, timeOut: null, status: 'Absent' },
  { id: 4, userId: 12, userName: 'Olivia Taylor', date: '2026-08-27', timeIn: '07:50', timeOut: '15:30', status: 'Present' },
  { id: 5, userId: 13, userName: 'Daniel Nguyen', date: '2026-08-27', timeIn: null, timeOut: null, status: 'Excused' },
  { id: 6, userId: 3, userName: 'Michael Chen', date: '2026-08-27', timeIn: '07:30', timeOut: '16:00', status: 'Present' },
  { id: 7, userId: 4, userName: 'Emily Watson', date: '2026-08-27', timeIn: '07:45', timeOut: '16:00', status: 'Present' },
  { id: 8, userId: 5, userName: 'Robert Kim', date: '2026-08-27', timeIn: '07:35', timeOut: '16:00', status: 'Present' },
  { id: 9, userId: 9, userName: 'Alex Rivera', date: '2026-08-26', timeIn: '07:50', timeOut: '15:30', status: 'Present' },
  { id: 10, userId: 10, userName: 'Sophia Martinez', date: '2026-08-26', timeIn: '07:55', timeOut: '15:30', status: 'Present' },
  { id: 11, userId: 11, userName: 'James Wilson', date: '2026-08-26', timeIn: '08:20', timeOut: '15:30', status: 'Late' },
  { id: 12, userId: 12, userName: 'Olivia Taylor', date: '2026-08-26', timeIn: '07:48', timeOut: '15:00', status: 'Present' },
]

export const dashboardStats = {
  totalStudents: 5,
  totalTeachers: 6,
  totalParents: 4,
  totalCourses: 11,
  totalEnrollments: 11,
  attendanceToday: { present: 5, absent: 1, late: 1, excused: 1 },
  totalRevenue: 1283,
  outstandingPayments: 558,
}

export const enrollmentTrend = [
  { month: 'Mar', count: 18 },
  { month: 'Apr', count: 24 },
  { month: 'May', count: 22 },
  { month: 'Jun', count: 30 },
  { month: 'Jul', count: 28 },
  { month: 'Aug', count: 35 },
]

export const attendanceOverview = [
  { day: 'Mon', present: 42, absent: 3, late: 5 },
  { day: 'Tue', present: 40, absent: 5, late: 5 },
  { day: 'Wed', present: 44, absent: 2, late: 4 },
  { day: 'Thu', present: 38, absent: 7, late: 5 },
  { day: 'Fri', present: 41, absent: 4, late: 5 },
]

export const revenueOverview = [
  { month: 'Mar', revenue: 8500 },
  { month: 'Apr', revenue: 9200 },
  { month: 'May', revenue: 7800 },
  { month: 'Jun', revenue: 11000 },
  { month: 'Jul', revenue: 10500 },
  { month: 'Aug', revenue: 12800 },
]

export const libraryStats = [
  { name: 'Available', value: 4 },
  { name: 'Borrowed', value: 2 },
  { name: 'Damaged', value: 1 },
]
