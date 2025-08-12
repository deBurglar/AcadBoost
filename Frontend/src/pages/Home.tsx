
import { useState } from "react"
import { Button } from "../components/ui/button"


import { BarChart3, Smartphone, Target } from 'lucide-react'

import { TechStackSection } from '../components/tech-stack-section'
import { LoginModal } from "../components/login-modal"
import { TimetableGenerator } from "../components/timetable-generator"
import { AttendanceTracker } from "../components/attendance-tracker"
import { ReportsGenerator } from "../components/reports-generator"
import { Testimonials } from "../components/Landingpage/testimonial"

import Header from "../components/Landingpage/header"
import KeyFeatures from "../components/Landingpage/keyfeatures"
import DashboardOverview from "../components/Landingpage/dashboardoverview"
import Footer from "../components/Landingpage/footer"
import HeroSection from "../components/Landingpage/hero"


export default function AcademicManagementSystem() {
  
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
      <Header user = {user} setLoginModalOpen = {setLoginModalOpen}/>

      {/* Hero Section */}
      <HeroSection 
      setAttendanceModalOpen={setAttendanceModalOpen} 
      setTimetableModalOpen={setTimetableModalOpen}/>

      {/* Key Features Overview */}
      <KeyFeatures/>

      {/* Dashboard Previews */}
      <DashboardOverview 
      setTimetableModalOpen={setTimetableModalOpen}
      setAttendanceModalOpen={setAttendanceModalOpen}
      setReportsModalOpen={setReportsModalOpen}
       />

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
      <Testimonials/>

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
            <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-gray-100 hover:text-blue-600 text-lg px-8 py-3" onClick={() => setTimetableModalOpen(true)}>
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4">No credit card required • 30-day free trial • Setup in minutes</p>
        </div>
      </section>

      {/* Footer */}
      <Footer/>

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
