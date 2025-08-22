import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../lib/axiosClient";
import { QRCodeCanvas } from "qrcode.react";

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
  const [qrSession, setQrSession] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(20);

  //  Fetch students for manual attendance
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

  //  Toggle manual attendance
  const toggleAttendance = (idx: number) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, present: !s.present } : s))
    );
  };

  //  Submit manual attendance
  const handleSubmit = async () => {
    try {
      const presentStudents = students
        .filter((s) => s.present)
        .map((s) => s._id);
      await axiosClient.post("/faculty/takeattendance", {
        courseId,
        presentStudents,
        sessionKey: "manual-" + Date.now(),
      });

      alert("Manual attendance submitted ✅");
    } catch (err) {
      console.error("Error submitting attendance", err);
      alert("Failed to submit manual attendance ❌");
    }
  };

  //  Start QR auto-refresh loop
  const startQR = async () => {
    try {
      const { data } = await axiosClient.post("/faculty/startattendance", {
        courseId,
      });
      setQrSession(data.sessionKey);
    } catch (err) {
      console.error("Error starting QR session", err);
    }
  };

  //  Refresh QR every 20s (once started)
 useEffect(() => {
  if (!qrSession) return;

  // countdown timer
  setTimeLeft(20);
  const timer = setInterval(() => {
    setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);

  // QR refresh
  const qrInterval = setInterval(async () => {
    try {
      const { data } = await axiosClient.post("/faculty/startattendance", {
        courseId,
      });
      setQrSession(data.sessionKey);
      setTimeLeft(20); // reset timer after refresh
    } catch (err) {
      console.error("Error refreshing QR session", err);
    }
  }, 20000);

  return () => {
    clearInterval(timer);
    clearInterval(qrInterval);
  };
}, [qrSession, courseId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Attendance for {courseName}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* 🔹 Manual Attendance Section */}
        <div>
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
            Submit The Attendance
          </button>
        </div>

        {/* 🔹 QR Attendance Section */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">QR Attendance</h3>
          {!qrSession ? (
            <button
              onClick={startQR}
              className="py-3 px-6 rounded-xl font-medium bg-green-600 text-white"
            >
              Start QR Attendance
            </button>
          ) : (
            <div className="mt-4 flex flex-col items-center">
              <p className="mb-3 font-medium">
                Students: Scan this QR to mark attendance
              </p>
              <QRCodeCanvas value={qrSession} size={200} />
              <p className="mt-2 text-sm text-gray-500">
               Refreshing in <span className="font-bold">{timeLeft}</span> sec
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
