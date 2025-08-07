import { NextResponse } from 'next/server'
import { mockNotifications } from '@/lib/mock-data'

export async function GET() {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter(n => !n.read).length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
