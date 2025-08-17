import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import axiosClient from "../../lib/axiosClient";

type Course = {
  _id: string;
  name: string;
  subjectcode: string;
  year: number;
  isLab?: boolean;
  department?: { name: string; year: number }[];
};

type Attendance = {
  courseId: string;
  courseName: string;
  totalStudents: number;
  lastAttendance: { date: string; presentCount: number } | null;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const { data: courseData } = await axiosClient.get("/faculty/mycourses");
        setCourses(courseData.courses || []);

        // Fetch attendance (change endpoint if needed)
        const { data: attendanceData } = await axiosClient.get("/faculty/last_attendance_report");
        setAttendance(attendanceData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lectures = courses.filter((c) => !c.isLab);
  const labs = courses.filter((c) => c.isLab);

   

  if (loading) {
    return <p className="p-6 text-gray-500">Loading courses...</p>;
  }

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">📚 My Courses</h1>

    <Tabs defaultValue="lectures" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
        <TabsTrigger value="lectures">Lectures</TabsTrigger>
        <TabsTrigger value="labs">Labs</TabsTrigger>
      </TabsList>

      {/* Lectures */}
      <TabsContent value="lectures" className="space-y-6">
        {lectures.map((course) => {
          const att = attendance.find((a) => a.courseId === course._id);

          return (
            <Card key={course._id} className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-yellow-300 to-indigo-300 px-4 py-3 rounded-2xl text-white">
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>
                  {course.subjectcode} • Year {course.year}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {course.department?.length && (
                  <Badge variant="secondary">{course.department[0].name}</Badge>
                )}

                {att?.lastAttendance ? (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{att.courseName}</span>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        {att.lastAttendance.presentCount} present
                        out of {att.totalStudents}
                      </Badge>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{
                          width: att.totalStudents
                            ? `${(att.lastAttendance.presentCount / att.totalStudents) * 100}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Last Recorded: {new Date(att.lastAttendance.date).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attendance recorded yet.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </TabsContent>

      {/* Labs */}
      <TabsContent value="labs" className="space-y-6">
        {labs.map((course) => {
          const att = attendance.find((a) => a.courseId === course._id);

          return (
            <Card key={course._id} className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-200 to-pink-400 px-4 py-3 rounded-2xl text-white">
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>
                  {course.subjectcode} • Year {course.year}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {course.department?.length && (
                  <Badge variant="secondary">{course.department[0].name}</Badge>
                )}

                {att?.lastAttendance ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{att.courseName}</span>
                      <Badge className="bg-green-100 text-green-700">
                        {att.lastAttendance.presentCount} present
                      </Badge>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: att.totalStudents
                            ? `${(att.lastAttendance.presentCount / att.totalStudents) * 100}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Last Recorded: {new Date(att.lastAttendance.date).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attendance recorded yet.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </TabsContent>
    </Tabs>
  </div>
);

}
