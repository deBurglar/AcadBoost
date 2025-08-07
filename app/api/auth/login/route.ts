import { NextRequest, NextResponse } from 'next/server'
import { mockUsers } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email)
    
    if (!user || password !== 'demo123') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Return user data (in real app, you'd return a JWT token)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: `mock-jwt-token-${user.id}`
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
