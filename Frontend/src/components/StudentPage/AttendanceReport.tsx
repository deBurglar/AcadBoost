import { useEffect, useState } from "react";
import axiosClient from "../../lib/axiosClient";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axiosClient.get("/student/myattendance");
        setAttendance(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">My Attendance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {attendance.map((item) => {
          const progressColor = item.warning ? "bg-red-500" : "bg-green-500";
          return (
            <div
              key={item.course._id}
              className="p-6 bg-white rounded-2xl shadow-lg border-l-8 hover:scale-105 transition-transform duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{item.course.name}</h2>
                <span className={`px-3 py-1 rounded-full text-white text-sm ${progressColor}`}>
                  {item.percentage}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{item.course.subjectcode}</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full ${progressColor}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>{item.attended}</strong> / {item.total} classes attended
              </p>
              {item.warning && (
                <p className="mt-2 text-red-600 font-medium flex items-center">
                  ⚠️ Low Attendance! Please attend more classes.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAttendance;
