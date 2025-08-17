import { Link, useLocation } from 'react-router';
import {CalendarDays, ArrowUpNarrowWide,LayoutDashboard, PlusIcon} from "lucide-react"
const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: 'Dashboard', path: '/admin',icon: ArrowUpNarrowWide },
    { name: 'Create', path: '/admin/create',icon:PlusIcon },
    { name: 'Anaysis', path: '/admin/analysis' ,icon: CalendarDays },
  ];

  return (
    <div className="w-64 h-screen shadow-md border-r p-4 fixed top-20    left-0 z-50">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-base-content"><LayoutDashboard/>Admin Panel</h2>
      <ul className="space-y-4">
        {menu.map((item) => {
  const Icon = item.icon;
  return (
    <li key={item.path}>
      <Link
        to={item.path}
        className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-200 ${
          pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-400'
        }`}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {item.name}
      </Link>
    </li>
  );
})}
      </ul>
    </div>
  );
};

export default Sidebar;