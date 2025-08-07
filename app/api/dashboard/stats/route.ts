import { NextResponse } from 'next/server'
import { mockDashboardStats } from '@/lib/mock-data'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Add some randomization to make it feel more real
    const stats = {
      ...mockDashboardStats,
      averageAttendance: Math.round((mockDashboardStats.averageAttendance + Math.random() * 4 - 2) * 10) / 10,
      activeClasses: mockDashboardStats.activeClasses + Math.floor(Math.random() * 3),
      lowAttendanceAlerts: mockDashboardStats.lowAttendanceAlerts + Math.floor(Math.random() * 5)
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
