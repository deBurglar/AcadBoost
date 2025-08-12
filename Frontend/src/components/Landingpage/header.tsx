import { GraduationCap } from "lucide-react"
import { Button } from "../ui/button"


interface HeaderProps {
  user: { name: string }
  setLoginModalOpen:React.Dispatch<React.SetStateAction<boolean>>
}


export default function Header({ user,setLoginModalOpen }: HeaderProps)
{
    return(
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
      </header>)
}