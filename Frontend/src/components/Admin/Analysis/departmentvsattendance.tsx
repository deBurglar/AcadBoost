import React, { useEffect, useState } from "react";
import axiosClient from "../../../lib/axiosClient";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

interface Course {
  courseId: string;
  courseName: string;
  attendedSessions: number;
  totalSessions: number;
  attendancePercentage: number;
}

interface Student {
  studentId: string;
  studentName: string;
  courses: Course[];
}

interface DepartmentData {
  departmentId: string;
  departmentName: string;
  departmentYear: number;
  students: Student[];
}

const DepartmentAttendanceDashboard: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("admin/student_attendance_year_dept");
        setDepartments(res.data); // ✅ handle full array
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (!departments.length) return <p className="text-center text-gray-600">No data available</p>;

  return (
    <div className="p-6 space-y-10 w-full">
      {departments.map((data) => {
        // ✅ Calculate Department Average Attendance
        const totalAttended = data.students.flatMap(s => s.courses).reduce((acc, c) => acc + c.attendedSessions, 0);
        const totalSessions = data.students.flatMap(s => s.courses).reduce((acc, c) => acc + c.totalSessions, 0);
        const deptAvg = totalSessions ? (totalAttended / totalSessions) * 100 : 0;

        // ✅ Course-wise Average Attendance
        const courseMap: Record<string, { courseName: string; attended: number; total: number }> = {};
        data.students.forEach(student => {
          student.courses.forEach(course => {
            if (!courseMap[course.courseId]) {
              courseMap[course.courseId] = { courseName: course.courseName, attended: 0, total: 0 };
            }
            courseMap[course.courseId].attended += course.attendedSessions;
            courseMap[course.courseId].total += course.totalSessions;
          });
        });

        const courseData = Object.values(courseMap).map(c => ({
          courseName: c.courseName,
          attendance: c.total ? (c.attended / c.total) * 100 : 0,
        }));

        return (
          <div key={data.departmentId} className="space-y-6">
            {/* Department Info */}
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>{data.departmentName} (Year {data.departmentYear})</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">Total Students: <span className="font-semibold">{data.students.length}</span></p>
                  <p className="text-lg">Average Attendance: <span className="font-semibold">{deptAvg.toFixed(2)}%</span></p>
                </CardContent>
              </Card>
            </div>

            {/* Course-wise Attendance */}
            <Card className="shadow-md rounded-2xl">
  <CardHeader>
    <CardTitle>Course-wise Attendance</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={courseData}
        margin={{ top: 20, right: 20, left: 20, bottom: 80 }} // extra bottom space
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="courseName" 
          interval={0} 
          tick={({ x, y, payload }) => {
            const words = payload.value.split(" "); // wrap words
            return (
              <g transform={`translate(${x},${y + 10})`}>
                {words.map((word: string, i: number) => (
                  <text
                    key={i}
                    x={0}
                    y={i * 14}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#374151"
                  >
                    {word}
                  </text>
                ))}
              </g>
            );
          }}
        />
        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
        <Bar dataKey="attendance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

          </div>
        );
      })}
    </div>
  );
};

export default DepartmentAttendanceDashboard;
