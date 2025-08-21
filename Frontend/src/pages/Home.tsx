
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
import { motion } from "framer-motion";


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
<div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-x-hidden">
  <div className="relative w-full max-w-[100vw] mx-auto overflow-hidden">
    {/* Floating gradient blobs (mesmerizing but subtle) */}
    <motion.div
      className="pointer-events-none absolute -top-36 -left-36 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-indigo-200 to-blue-100 blur-3xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.45, scale: 1 }}
      transition={{ duration: 1.5 }}
    />
    <motion.div
      className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-fuchsia-200 to-purple-100 blur-3xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.35, scale: 1 }}
      transition={{ duration: 1.4 }}
    />

    {/* Header */}
    <Header user={user} setLoginModalOpen={setLoginModalOpen} />

    {/* Hero Section */}
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <HeroSection
        setAttendanceModalOpen={setAttendanceModalOpen}
        setTimetableModalOpen={setTimetableModalOpen}
      />
    </motion.div>

    {/* Key Features Overview */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <KeyFeatures />
    </motion.div>

    {/* Dashboard Previews */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <DashboardOverview
        setTimetableModalOpen={setTimetableModalOpen}
        setAttendanceModalOpen={setAttendanceModalOpen}
        setReportsModalOpen={setReportsModalOpen}
      />
    </motion.div>

    {/* Features Deep Dive */}
    <section className="relative py-16 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-transparent pointer-events-none" />
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            An API-First, Event-Driven Architecture
          </h2>
          <p className="text-lg text-gray-600">
            Built for scalability, reliability, and seamless integration.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Feature bullets with animated/mesmerizing hover */}
          <div className="space-y-8">
            {/* 1 */}
            <motion.div
              className="space-y-4 group"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold transition-colors group-hover:text-indigo-600">
                  Constraint Propagation Engine
                </h3>
              </div>
              <p className="text-gray-600 ml-12">
                Our engine models scheduling as a high-dimensional Constraint Satisfaction Problem (CSP), utilizing heuristic-based search to resolve resource conflicts asynchronously.
              </p>
            </motion.div>

            {/* 2 */}
            <motion.div
              className="space-y-4 group"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:-rotate-6">
                  <Smartphone className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold transition-colors group-hover:text-indigo-600">
                  Real-Time Data Sync
                </h3>
              </div>
              <p className="text-gray-600 ml-12">
                A centralized Postgres database with real-time subscriptions ensures data consistency across our web platform and mobile PWA, providing instant updates for all users.
              </p>
            </motion.div>

            {/* 3 */}
            <motion.div
              className="space-y-4 group"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold transition-colors group-hover:text-indigo-600">
                  Predictive Analytics Hub
                </h3>
              </div>
              <p className="text-gray-600 ml-12">
                Our ETL pipeline processes attendance data to train ML models, identifying at-risk students and forecasting attendance trends before issues arise.
              </p>
            </motion.div>
          </div>

          {/* Right: Metrics card with hover lift + animated progress */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Metrics</h3>
                <p className="text-gray-600">Real-time stats from our global edge network</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "99.9%", label: "High-Availability", color: "text-blue-600" },
                  { value: "98%", label: "Scheduling Success", color: "text-green-600" },
                  { value: "1M+", label: "Events Processed", color: "text-purple-600" },
                  { value: "<100ms", label: "API Latency (p95)", color: "text-orange-600" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="relative isolate overflow-hidden bg-white rounded-lg p-4 text-center ring-1 ring-gray-100 shadow-sm hover:shadow-xl"
                  >
                    {/* subtle shimmering gradient on hover */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                    <div className="text-sm text-gray-600">{m.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-3">Feature Adoption</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Automated Scheduling</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <TechStackSection />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Testimonials />
    </motion.div>

    {/* CTA Section */}
    <section className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
      {/* soft radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="container mx-auto text-center relative z-10">
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to Transform Your Institution?
        </motion.h2>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join thousands of educational institutions already using EduSchedule Pro to streamline their operations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-xl shadow-lg"
              onClick={() => setLoginModalOpen(true)}
            >
              Start Free Trial
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-blue-600 hover:bg-white hover:text-blue-600 text-lg px-8 py-3 rounded-xl shadow-lg"
              onClick={() => setTimetableModalOpen(true)}
            >
              Schedule Demo
            </Button>
          </motion.div>
        </div>
        <p className="text-sm text-blue-200 mt-4">
          No credit card required • 30-day free trial • Setup in minutes
        </p>
      </div>
    </section>

    {/* Footer */}
    <Footer />

    {/* Modals (unchanged) */}
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
  </div>
);

}
