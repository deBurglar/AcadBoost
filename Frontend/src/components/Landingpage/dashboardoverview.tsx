import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Shield,Download,Settings,TrendingUp ,User,GraduationCap} from "lucide-react"

interface DasboardProps{
    setReportsModalOpen:React.Dispatch<React.SetStateAction<boolean>>
    setAttendanceModalOpen:React.Dispatch<React.SetStateAction<boolean>>
    setTimetableModalOpen:React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashboardOverview({setTimetableModalOpen,setReportsModalOpen,setAttendanceModalOpen}:DasboardProps)
{
    const [activeTab, setActiveTab] = useState("overview")
    return(
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
              <Card className="border-0 shadow-xl p-2">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-800 px-4 py-3 rounded-2xl text-white">
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
              <Card className="border-0 shadow-xl p-2">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 rounded-2xl text-white">
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
              <Card className="border-0 shadow-xl p-2">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 rounded-2xl text-white">
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
    )
}