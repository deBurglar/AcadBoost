import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../lib/axiosClient";

interface StudentProfile {
  rollNumber: number;
  year: number;
  department: string;
  deviceId: string;
}

interface Student {
  _id: string;
  name: string;
  emailId: string;
  studentProfile: StudentProfile;
  present?: boolean; // ✅ local field for attendance
}

interface CourseResponse {
  course: string;
  students: Student[];
}

export default function AttendancePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [courseName, setCourseName] = useState<string>("");

  // ✅ Fetch students for this course
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get<CourseResponse>(
          `/faculty/studentinmycourse/${courseId}`
        );
        setCourseName(data.course);
        setStudents(data.students.map((s) => ({ ...s, present: false })));
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };
    fetchData();
  }, [courseId]);

  // ✅ Toggle present/absent
  const toggleAttendance = (idx: number) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, present: !s.present } : s))
    );
  };

  // ✅ Submit attendance
  const handleSubmit = async () => {
    try {
      const presentStudents = students
        .filter((s) => s.present)
        .map((s) => s._id);

      await axiosClient.post("/faculty/takeattendance", {
        courseId,
        presentStudents,
      });

      alert("Attendance submitted ✅");
    } catch (err) {
      console.error("Error submitting attendance", err);
      alert("Failed to submit attendance ❌");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Attendance for {courseName}
      </h2>

      <ul className="space-y-3">
        {students.map((student, idx) => (
          <li
            key={student._id}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-600">{student.emailId}</p>
            </div>

            <button
              onClick={() => toggleAttendance(idx)}
              className={`px-4 py-2 rounded-xl transition ${
                student.present
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {student.present ? "Present" : "Mark Present"}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full py-3 rounded-xl font-medium bg-blue-600 text-white"
      >
        Submit Attendance
      </button>
    </div>
  );
}
