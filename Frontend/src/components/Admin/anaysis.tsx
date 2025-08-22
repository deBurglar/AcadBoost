import { useNavigate } from "react-router";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { Users, BookOpen, BarChart3, UserCheck } from "lucide-react";

const DashboardCards = () => {
  const navigate = useNavigate();

  const cards = [
    { title: "Student vs Department", path: "/admin/student-vs-dept", icon: <Users className="w-10 h-10 text-blue-500" /> },
    { title: "Attendance vs Department", path: "/admin/attendance-vs-dept", icon: <UserCheck className="w-10 h-10 text-green-500" /> },
    { title: "Course vs Department", path: "/admin/course-vs-dept", icon: <BookOpen className="w-10 h-10 text-purple-500" /> },
    { title: "Faculty vs Department", path: "/admin/faculty-vs-dept", icon: <BarChart3 className="w-10 h-10 text-pink-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            onClick={() => navigate(card.path)}
            className="cursor-pointer shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 hover:border-blue-400"
          >
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {card.icon}
              </motion.div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{card.title}</h2>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
