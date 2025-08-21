import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  PlusIcon,
  CalendarDays,

  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
const Sidebar = () => {
const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Create", path: "/admin/create", icon: PlusIcon },
    { name: "Analysis", path: "/admin/analysis", icon: CalendarDays },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className="w-64 h-screen shadow-xl border-r p-5 fixed top-20 left-0 z-50 bg-gradient-to-b from-blue-50 to-indigo-100"
    >
      <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-indigo-700">
        <LayoutDashboard className="w-6 h-6" />
        Admin Panel
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
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-100 hover:text-indigo-600"
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
export default Sidebar;