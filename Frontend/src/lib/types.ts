export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'faculty' | 'student'
  avatar?: string
}

export interface Course {
  id: string
  name: string
  code: string
  credits: number
  department: string
}

export interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
}

export interface ClassSchedule {
  id: string
  courseId: string
  facultyId: string
  roomId: string
  timeSlotId: string
  studentGroupId: string
  course: Course
  faculty: User
  room: Room
  timeSlot: TimeSlot
}

export interface Room {
  id: string
  name: string
  capacity: number
  type: 'lecture' | 'lab' | 'seminar'
  building: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  classScheduleId: string
  date: string
  status: 'present' | 'absent' | 'late'
  markedAt?: string
}

export interface StudentGroup {
  id: string
  name: string
  year: number
  department: string
  studentCount: number
}

export interface DashboardStats {
  totalStudents: number
  totalFaculty: number
  totalCourses: number
  averageAttendance: number
  activeClasses: number
  conflictsResolved: number
  lowAttendanceAlerts: number
}

export interface NotificationAlert {
  id: string
  type: 'attendance' | 'schedule' | 'system'
  title: string
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  read: boolean
}
