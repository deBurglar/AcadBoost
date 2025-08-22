import { useParams } from "react-router";
import axiosClient from "../../lib/axiosClient";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";

export default function ViewAttendance() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get(
          `/faculty/facultyattendance/${courseId}`
        );
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching Attendance Data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 w-[100vw]">
        <div className="relative">
          <div className="w-16 h-16 border-8 border-t-8 border-gray-100 rounded-full animate-spin border-t-indigo-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-indigo-700 animate-pulse">
              📚
            </span>
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-indigo-800 animate-bounce">
          Loading Attendance...
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Hang tight! Your data is on the way ✨
        </p>
      </div>
    );
  }

  if (!attendanceData) {
    return <p className="text-center mt-10">No attendance data available</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        📖 Attendance for {attendanceData.course}
      </h1>

      {attendanceData.sessions.map((session: any) => {
        const presentCount = session.present.length;
        const absentCount = session.absent.length;
        const total = presentCount + absentCount;
        const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : "0";

        return (
          <Card key={session.sessionKey} className="shadow-md border">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  Session: {new Date(session.timestamp).toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">
                  ✅ {presentCount} | ❌ {absentCount} | 🎓 {percentage}% present
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">Present</h3>
              <ul className="list-disc pl-5 text-green-700">
                {session.present.map((s: any) => (
                  <li key={s._id}>
                    {s.studentProfile.rollNumber} - {s.name} (
                    {s.emailId})
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold mt-4">Absent</h3>
              <ul className="list-disc pl-5 text-red-700">
                {session.absent.map((s: any) => (
                  <li key={s._id}>
                    {s.studentProfile.rollNumber} - {s.name} (
                    {s.emailId})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
