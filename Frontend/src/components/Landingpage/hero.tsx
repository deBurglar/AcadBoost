
import { ChevronRight,Zap, } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface HeroSectionProps{
  setAttendanceModalOpen:React.Dispatch<React.SetStateAction<boolean>>
  setTimetableModalOpen:React.Dispatch<React.SetStateAction<boolean>>
}

export default function HeroSection({setAttendanceModalOpen,setTimetableModalOpen}:HeroSectionProps)
{
    return (
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
    )
}