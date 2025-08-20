import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {QRCodeCanvas} from "qrcode.react";
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
  present?: boolean;
}

interface CourseResponse {
  course: string;
  students: Student[];
}

export default function AttendancePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [courseName, setCourseName] = useState<string>("");
  const [qrSession, setQrSession] = useState<string | null>(null); //  hold QR

  // Fetch students for this course
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

  // Toggle present/absent
  const toggleAttendance = (idx: number) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, present: !s.present } : s))
    );
  };

  // Submit attendance (manual)
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

  // Start QR attendance
  const handleStartQR = async () => {
    try {
      const { data } = await axiosClient.post("/faculty/startattendance", {
        courseId,
      });
      // backend should return: { qrPayload: "..." }
      setQrSession(data.qrPayload);
    } catch (err) {
      console.error("Error starting QR session", err);
      alert("Failed to start QR session ❌");
    }
  };

return (
  <div className="p-6 max-w-6xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-center">
      Attendance for {courseName}
    </h2>

    <div className="flex flex-col md:flex-row gap-6">
      {/* 🔹 Manual Attendance Section */}
      <div className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Manual Attendance</h3>

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
          Submit Manual Attendance
        </button>
      </div>

      {/* 🔹 QR Attendance Section */}
      <div className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">QR Attendance</h3>

        <button
          onClick={handleStartQR}
          className="py-3 px-6 rounded-xl font-medium bg-green-600 text-white"
        >
          Start QR Attendance
        </button>

        {qrSession && (
          <div className="mt-6 flex flex-col items-center">
            <p className="mb-3 font-medium text-center">
              Students: Scan this QR to mark your attendance
            </p>
            <QRCodeCanvas value={qrSession} size={200} />
          </div>
        )}
      </div>
    </div>
  </div>
);
}