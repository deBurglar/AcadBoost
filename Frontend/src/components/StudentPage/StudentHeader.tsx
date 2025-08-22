import { Bell, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser } from "../../authSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { markAsRead } from "../../notificationslice";
import { useState } from "react";

export default function StudentHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AcadBoost Pro</h1>
              <p className="text-sm text-gray-500">Smart Academic Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            {/* Notification bell */}
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-6 h-6" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-10 w-80 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        n.read ? "text-gray-500" : "font-semibold"
                      }`}
                      onClick={() => {
                        dispatch(markAsRead(n.id));
                        if (n.url) window.location.href = n.url;
                      }}
                    >
                      <p>{n.title}</p>
                      <p className="text-xs">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            <Button variant="ghost">{user.name}</Button>
            <Button
              className="bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
