"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, BarChart3, FileText, Calendar, TrendingUp } from 'lucide-react'

interface ReportsGeneratorProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportsGenerator({ isOpen, onClose }: ReportsGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState("")

  const generateReport = async () => {
    if (!reportType || !dateRange) return

    setIsGenerating(true)
    setProgress(0)
    setResult(null)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, dateRange, filters: {} })
      })

      const data = await response.json()
      setResult(data.report)
      setProgress(100)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
      clearInterval(interval)
    }
  }

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Analysis', icon: BarChart3 },
    { value: 'defaulters', label: 'Defaulter Report', icon: TrendingUp },
    { value: 'summary', label: 'Academic Summary', icon: FileText },
    { value: 'trends', label: 'Trend Analysis', icon: Calendar }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Advanced Analytics & Reports
          </CardTitle>
          <CardDescription>
            Generate comprehensive reports with predictive insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGenerating && !result && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-semester">Last Semester</SelectItem>
                    <SelectItem value="academic-year">Academic Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-700">Data Points</p>
                  <p className="text-2xl font-bold text-blue-600">50K+</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-700">ML Models</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
              </div>

              <Button 
                onClick={generateReport} 
                disabled={!reportType || !dateRange}
                className="w-full"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="font-medium">Processing analytics pipeline...</p>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Analyzing data and generating insights...
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="text-center">
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-600">
                  Report Generated Successfully!
                </h3>
                <p className="text-gray-600">Advanced analytics completed</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-700">Records</p>
                  <p className="text-xl font-bold text-blue-600">{result.totalRecords}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-700">Avg Attendance</p>
                  <p className="text-xl font-bold text-green-600">{result.summary.averageAttendance}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-sm text-purple-700">Students</p>
                  <p className="text-xl font-bold text-purple-600">{result.summary.studentsAnalyzed}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Report Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Report ID:</span>
                    <Badge variant="outline">{result.id}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Generated:</span>
                    <span>{new Date(result.generatedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Classes:</span>
                    <span>{result.summary.totalClasses}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
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
