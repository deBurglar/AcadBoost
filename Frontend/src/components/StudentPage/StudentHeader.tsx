import { GraduationCap } from "lucide-react"
import { Button } from "../ui/button"
import { logoutUser } from "../../authSlice"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../../store/store'

// interface HeaderProps {
//   setLoginModalOpen:React.Dispatch<React.SetStateAction<boolean>>
// }


export default function StudentHeader()
{

    const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
    const handleLogout = () =>{
            dispatch(logoutUser())
        }

    return(
<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduSchedule Pro</h1>
                <p className="text-sm text-gray-500">Smart Academic Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">
                { ` ${user.name}` }
              </Button>
              <Button className="bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>)
}