"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Calendar, CheckCircle, Zap, Clock, Users, Building } from 'lucide-react'

interface TimetableGeneratorProps {
  isOpen: boolean
  onClose: () => void
}

export function TimetableGenerator({ isOpen, onClose }: TimetableGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [stage, setStage] = useState("")

  const generateTimetable = async () => {
    setIsGenerating(true)
    setProgress(0)
    setResult(null)

    const stages = [
      "Analyzing constraints...",
      "Processing faculty availability...",
      "Optimizing room allocation...",
      "Resolving conflicts...",
      "Finalizing schedule..."
    ]

    // Simulate progress
    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i])
      setProgress((i + 1) * 20)
      await new Promise(resolve => setTimeout(resolve, 400))
    }

    try {
      const response = await fetch('/api/timetable/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ constraints: {} })
      })

      const data = await response.json()
      setResult(data)
      setProgress(100)
    } catch (error) {
      console.error('Failed to generate timetable:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            AI Timetable Generator
          </CardTitle>
          <CardDescription>
            Generate optimized schedules using constraint propagation algorithms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGenerating && !result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Courses</h3>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Faculty</h3>
                  <p className="text-2xl font-bold text-green-600">89</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-900">Rooms</h3>
                  <p className="text-2xl font-bold text-purple-600">45</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-orange-900">Time Slots</h3>
                  <p className="text-2xl font-bold text-orange-600">120</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={generateTimetable} className="flex-1">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Timetable
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="font-medium">{stage}</p>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Processing {progress}% complete...
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-600">
                  Timetable Generated Successfully!
                </h3>
                <p className="text-gray-600">{result.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-700">Conflicts Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{result.conflictsResolved}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-700">Optimization Score</p>
                  <p className="text-2xl font-bold text-blue-600">{result.optimizationScore}%</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Generated Schedule Preview:</h4>
                {result.schedule?.slice(0, 3).map((item: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.course.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.faculty.name} • {item.room.name}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {item.timeSlot.day} {item.timeSlot.startTime}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Schedule
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
