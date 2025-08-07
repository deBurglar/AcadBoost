import { User, Course, Room, TimeSlot, ClassSchedule, AttendanceRecord, StudentGroup, DashboardStats, NotificationAlert } from './types'

export const mockUsers: User[] = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@edu.com', role: 'admin' },
  { id: '2', name: 'Prof. Michael Chen', email: 'michael.chen@edu.com', role: 'faculty' },
  { id: '3', name: 'Dr. Emily Davis', email: 'emily.davis@edu.com', role: 'faculty' },
  { id: '4', name: 'John Smith', email: 'john.smith@student.edu.com', role: 'student' },
  { id: '5', name: 'Alice Johnson', email: 'alice.johnson@student.edu.com', role: 'student' },
]

export const mockCourses: Course[] = [
  { id: '1', name: 'Data Structures', code: 'CS201', credits: 3, department: 'Computer Science' },
  { id: '2', name: 'Algorithms', code: 'CS301', credits: 4, department: 'Computer Science' },
  { id: '3', name: 'Database Systems', code: 'CS401', credits: 3, department: 'Computer Science' },
  { id: '4', name: 'Machine Learning', code: 'CS501', credits: 4, department: 'Computer Science' },
  { id: '5', name: 'Software Engineering', code: 'CS302', credits: 3, department: 'Computer Science' },
]

export const mockRooms: Room[] = [
  { id: '1', name: 'CS-101', capacity: 50, type: 'lecture', building: 'Computer Science Building' },
  { id: '2', name: 'CS-102', capacity: 30, type: 'lab', building: 'Computer Science Building' },
  { id: '3', name: 'CS-103', capacity: 40, type: 'lecture', building: 'Computer Science Building' },
  { id: '4', name: 'Lab-301', capacity: 25, type: 'lab', building: 'Engineering Building' },
]

export const mockTimeSlots: TimeSlot[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '10:30' },
  { id: '2', day: 'Monday', startTime: '11:00', endTime: '12:30' },
  { id: '3', day: 'Tuesday', startTime: '14:00', endTime: '15:30' },
  { id: '4', day: 'Wednesday', startTime: '09:00', endTime: '10:30' },
  { id: '5', day: 'Thursday', startTime: '11:00', endTime: '12:30' },
]

export const mockStudentGroups: StudentGroup[] = [
  { id: '1', name: 'CS-2023-A', year: 2023, department: 'Computer Science', studentCount: 45 },
  { id: '2', name: 'CS-2023-B', year: 2023, department: 'Computer Science', studentCount: 42 },
  { id: '3', name: 'CS-2022-A', year: 2022, department: 'Computer Science', studentCount: 38 },
]

export const mockDashboardStats: DashboardStats = {
  totalStudents: 1247,
  totalFaculty: 89,
  totalCourses: 156,
  averageAttendance: 87.5,
  activeClasses: 8,
  conflictsResolved: 98,
  lowAttendanceAlerts: 12
}

export const mockNotifications: NotificationAlert[] = [
  {
    id: '1',
    type: 'attendance',
    title: 'Low Attendance Alert',
    message: 'CS301 - Algorithms class has 65% attendance this week',
    severity: 'high',
    timestamp: new Date().toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'schedule',
    title: 'Schedule Conflict Resolved',
    message: 'Room CS-101 conflict for Monday 9:00 AM has been automatically resolved',
    severity: 'medium',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: '3',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
    severity: 'low',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true
  }
]
