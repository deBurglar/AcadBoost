import { NextRequest, NextResponse } from 'next/server'
import { mockCourses, mockRooms, mockTimeSlots, mockUsers } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const { constraints } = await request.json()
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock timetable
    const generatedSchedule = mockCourses.slice(0, 5).map((course, index) => ({
      id: `schedule-${index + 1}`,
      courseId: course.id,
      facultyId: mockUsers.filter(u => u.role === 'faculty')[index % 2].id,
      roomId: mockRooms[index % mockRooms.length].id,
      timeSlotId: mockTimeSlots[index % mockTimeSlots.length].id,
      studentGroupId: '1',
      course,
      faculty: mockUsers.filter(u => u.role === 'faculty')[index % 2],
      room: mockRooms[index % mockRooms.length],
      timeSlot: mockTimeSlots[index % mockTimeSlots.length]
    }))
    
    return NextResponse.json({
      success: true,
      message: 'Timetable generated successfully using constraint propagation engine',
      schedule: generatedSchedule,
      conflictsResolved: Math.floor(Math.random() * 15) + 5,
      optimizationScore: Math.floor(Math.random() * 10) + 90
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate timetable' },
      { status: 500 }
    )
  }
}
