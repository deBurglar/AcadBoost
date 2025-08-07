"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Users, Clock, MapPin } from 'lucide-react'

interface AttendanceTrackerProps {
  isOpen: boolean
  onClose: () => void
}

export function AttendanceTracker({ isOpen, onClose }: AttendanceTrackerProps) {
  const [isMarking, setIsMarking] = useState(false)
  const [markedStudents, setMarkedStudents] = useState<string[]>([])

  const mockClass = {
    id: '1',
    course: 'Data Structures',
    time: '09:00 AM - 10:30 AM',
    room: 'CS-101',
    students: [
      { id: '1', name: 'John Smith', rollNo: 'CS2023001' },
      { id: '2', name: 'Alice Johnson', rollNo: 'CS2023002' },
      { id: '3', name: 'Bob Wilson', rollNo: 'CS2023003' },
      { id: '4', name: 'Emma Davis', rollNo: 'CS2023004' },
      { id: '5', name: 'Mike Brown', rollNo: 'CS2023005' },
    ]
  }

  const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
    setIsMarking(true)
    
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          classScheduleId: mockClass.id,
          status
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMarkedStudents(prev => [...prev, studentId])
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error)
    } finally {
      setIsMarking(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Real-Time Attendance Tracking
          </CardTitle>
          <CardDescription>
            Mark attendance for ongoing classes with instant synchronization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <h3 className="font-semibold text-lg">{mockClass.course}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {mockClass.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {mockClass.room}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Student List ({mockClass.students.length})</h4>
              <Badge variant="outline">
                {markedStudents.length}/{mockClass.students.length} marked
              </Badge>
            </div>

            {mockClass.students.map((student) => {
              const isMarked = markedStudents.includes(student.id)
              return (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.rollNo}</p>
                  </div>
                  <div className="flex gap-2">
                    {isMarked ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <Badge className="bg-green-100 text-green-700">Marked</Badge>
                      </div>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => markAttendance(student.id, 'present')}
                          disabled={isMarking}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isMarking ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Present'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAttendance(student.id, 'absent')}
                          disabled={isMarking}
                        >
                          {isMarking ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Absent'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              disabled={markedStudents.length === 0}
            >
              Save & Sync Attendance
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
