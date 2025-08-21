import { Link, useLocation } from 'react-router';
import {CalendarDays, ArrowUpNarrowWide,LayoutDashboard, PlusIcon,LogOut} from "lucide-react"
import { motion } from "framer-motion";
const FacultySidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: 'My Schedule', path: '/faculty',icon: ArrowUpNarrowWide },
    { name: 'Attendance', path: '/faculty/attendance',icon:PlusIcon },
    { name: 'Anaysis', path: '/faculty/analysis' ,icon: CalendarDays },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className="w-64 h-screen shadow-xl border-r p-5 fixed top-20 left-0 z-50 bg-gradient-to-b from-green-50 to-green-100"
    >
      <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-green-700">
        <LayoutDashboard className="w-6 h-6" />
        Faculty Panel
      </h2>

      <ul className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <motion.li
              key={item.path}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 
                ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-green-100 hover:text-green-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Bottom actions */}
      <div className="absolute bottom-6 left-0 w-full px-5">
        <Link
          to="/logout"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-100 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </motion.div>
  );
};

export default FacultySidebar;