"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, BookOpen, BarChart3, Bell, Shield, Smartphone, Monitor, CheckCircle, AlertTriangle, TrendingUp, Download, Settings, User, GraduationCap, Building, ChevronRight, Star, Zap, Target } from 'lucide-react'
import { TechStackSection } from "../components/tech-stack-section"
import { LoginModal } from "../components/login-modal"
import { TimetableGenerator } from "../components/timetable-generator"
import { AttendanceTracker } from "../components/attendance-tracker"
import { ReportsGenerator } from "../components/reports-generator"

export default function AcademicManagementSystem() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [timetableModalOpen, setTimetableModalOpen] = useState(false)
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const [reportsModalOpen, setReportsModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [dashboardStats, setDashboardStats] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    fetchDashboardStats()
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const stats = await response.json()
      setDashboardStats(stats)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduSchedule Pro</h1>
                <p className="text-sm text-gray-500">Smart Academic Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setLoginModalOpen(true)}>
                {user ? `Welcome, ${user.name}` : 'Login'}
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Zap className="w-4 h-4 mr-1" />
              Powered by a Serverless Architecture
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hyper-Efficient Scheduling Engine &
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Automated Attendance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Leveraging genetic algorithms and real-time data streams to build a fault-tolerant academic operating system. 
              Eliminate conflicts, automate workflows, and unlock predictive insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3" onClick={() => setTimetableModalOpen(true)}>
                Request Demo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" onClick={() => setAttendanceModalOpen(true)}>
                View Architecture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Overview */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Academic Management Solution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage schedules, track attendance, and optimize academic operations in one powerful platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: "Smart Timetabling",
                description: "AI-powered conflict-free schedule generation with complex constraint handling",
                color: "bg-blue-500"
              },
              {
                icon: CheckCircle,
                title: "Automated Attendance",
                description: "Real-time attendance tracking synced with your academic calendar",
                color: "bg-green-500"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Comprehensive reports, trends analysis, and actionable insights",
                color: "bg-purple-500"
              },
              {
                icon: Bell,
                title: "Smart Notifications",
                description: "Intelligent alerts for attendance issues and schedule changes",
                color: "bg-orange-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Previews */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Role-Based Dashboards</h2>
            <p className="text-lg text-gray-600">Tailored interfaces for every user type in your institution</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="overview">Admin</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Administrator Dashboard
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Complete oversight and control of academic operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Timetable Management</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm">Active Schedules</span>
                          <Badge variant="secondary">24</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm">Conflicts Resolved</span>
                          <Badge className="bg-green-100 text-green-700">98%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <span className="text-sm">Pending Approvals</span>
                          <Badge variant="outline">3</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Attendance Overview</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm">Overall Attendance</span>
                          <Badge className="bg-purple-100 text-purple-700">87.5%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <span className="text-sm">Low Attendance Alerts</span>
                          <Badge variant="destructive">12</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm">Active Sessions</span>
                          <Badge variant="secondary">8</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setReportsModalOpen(true)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export Reports
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setTimetableModalOpen(true)}>
                          <Settings className="w-4 h-4 mr-2" />
                          System Settings
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setAttendanceModalOpen(true)}>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faculty" className="space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Faculty Dashboard
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Manage your classes and track student attendance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                      <div className="space-y-3">
                        {[
                          { time: "09:00 AM", subject: "Data Structures", room: "CS-101", status: "completed" },
                          { time: "11:00 AM", subject: "Algorithms", room: "CS-102", status: "ongoing" },
                          { time: "02:00 PM", subject: "Database Systems", room: "CS-103", status: "upcoming" }
                        ].map((class_, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{class_.subject}</p>
                              <p className="text-sm text-gray-500">{class_.time} • {class_.room}</p>
                            </div>
                            <Badge 
                              variant={class_.status === 'completed' ? 'secondary' : 
                                      class_.status === 'ongoing' ? 'default' : 'outline'}
                            >
                              {class_.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Attendance Summary</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Data Structures</span>
                            <Badge className="bg-blue-100 text-blue-700">92%</Badge>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Algorithms</span>
                            <Badge className="bg-green-100 text-green-700">88%</Badge>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Database Systems</span>
                            <Badge className="bg-orange-100 text-orange-700">76%</Badge>
                          </div>
                          <div className="w-full bg-orange-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="student" className="space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <CardTitle className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Student Dashboard
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Track your attendance and view your schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">My Attendance</h3>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-purple-600">85.2%</div>
                          <p className="text-sm text-gray-600">Overall Attendance</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Present Days</span>
                            <span className="font-medium">142</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Absent Days</span>
                            <span className="font-medium">25</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Days</span>
                            <span className="font-medium">167</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Upcoming Classes</h3>
                      <div className="space-y-3">
                        {[
                          { time: "10:00 AM", subject: "Mathematics", room: "Room 201", instructor: "Dr. Smith" },
                          { time: "01:00 PM", subject: "Physics", room: "Lab 301", instructor: "Prof. Johnson" },
                          { time: "03:00 PM", subject: "Chemistry", room: "Lab 205", instructor: "Dr. Brown" }
                        ].map((class_, index) => (
                          <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{class_.subject}</p>
                                <p className="text-sm text-gray-500">{class_.instructor}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{class_.time}</p>
                                <p className="text-sm text-gray-500">{class_.room}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">An API-First, Event-Driven Architecture</h2>
            <p className="text-lg text-gray-600">Built for scalability, reliability, and seamless integration.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Constraint Propagation Engine</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  Our engine models scheduling as a high-dimensional Constraint Satisfaction Problem (CSP), utilizing heuristic-based search to resolve resource conflicts asynchronously.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Real-Time Data Sync</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  A centralized Postgres database with real-time subscriptions ensures data consistency across our web platform and mobile PWA, providing instant updates for all users.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Predictive Analytics Hub</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  Our ETL pipeline processes attendance data to train ML models, identifying at-risk students and forecasting attendance trends before issues arise.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Metrics</h3>
                  <p className="text-gray-600">Real-time stats from our global edge network</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-600">High-Availability</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Scheduling Success</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">1M+</div>
                    <div className="text-sm text-gray-600">Events Processed</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">&lt;100ms</div>
                    <div className="text-sm text-gray-600">API Latency (p95)</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Feature Adoption</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Automated Scheduling</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TechStackSection />

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Institutions</h2>
            <p className="text-lg text-gray-600">See what educators are saying about our platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Academic Director",
                institution: "Metropolitan University",
                content: "EduSchedule Pro transformed our scheduling process. What used to take weeks now takes hours, and conflicts are virtually eliminated.",
                rating: 5
              },
              {
                name: "Prof. Michael Chen",
                role: "Department Head",
                institution: "Tech Institute",
                content: "The automated attendance system has saved us countless hours and improved accuracy significantly. Highly recommended!",
                rating: 5
              },
              {
                name: "Lisa Rodriguez",
                role: "Administrative Manager",
                institution: "City College",
                content: "The analytics dashboard provides insights we never had before. It's helped us identify and address attendance issues proactively.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.institution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Institution?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of educational institutions already using EduSchedule Pro to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3" onClick={() => setLoginModalOpen(true)}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3" onClick={() => setTimetableModalOpen(true)}>
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4">No credit card required • 30-day free trial • Setup in minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduSchedule Pro</span>
              </div>
              <p className="text-gray-400">
                Empowering educational institutions with intelligent scheduling and attendance management solutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduSchedule Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      <TimetableGenerator 
        isOpen={timetableModalOpen} 
        onClose={() => setTimetableModalOpen(false)}
      />
      <AttendanceTracker 
        isOpen={attendanceModalOpen} 
        onClose={() => setAttendanceModalOpen(false)}
      />
      <ReportsGenerator 
        isOpen={reportsModalOpen} 
        onClose={() => setReportsModalOpen(false)}
      />
    </div>
  )
}
