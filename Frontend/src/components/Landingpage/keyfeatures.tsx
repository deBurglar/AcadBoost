import { Calendar,CheckCircle,BarChart3,Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"


export default function KeyFeatures()
{
    return(
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
    )
}