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
  const [isBeaconActive, setIsBeaconActive] = useState(false);

  // 🔹 Bluetooth simulation state
  const [bluetoothAllowed, setBluetoothAllowed] = useState(false);
  const [bluetoothOn, setBluetoothOn] = useState(false);

  // 🔹 Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch students for manual attendance
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

  // Toggle manual attendance
  const toggleAttendance = (idx: number) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, present: !s.present } : s))
    );
  };

  // Submit manual attendance
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

  // Start QR Attendance with Bluetooth simulation
  const startQR = async () => {
    try {
      // Step 1: Ask permission
      const allow = window.confirm(
        "This feature requires Bluetooth. Do you allow access?"
      );
      if (!allow) {
        setBluetoothAllowed(false);
        return;
      }
      setBluetoothAllowed(true);

      // Step 2: Ask to turn on Bluetooth
      const turnOn = window.confirm(
        "Please turn ON your Bluetooth to act as a beacon."
      );
      if (!turnOn) {
        setBluetoothOn(false);
        return;
      }
      setBluetoothOn(true);

      // Step 3: Start QR Session & activate beacon simulation
      const { data } = await axiosClient.post("/faculty/startattendance", {
        courseId,
      });
      setQrSession(data.sessionKey);
      setIsBeaconActive(true);
    } catch (err) {
      console.error("Error starting QR session", err);
    }
  };

  // Refresh QR every 20s
  useEffect(() => {
    if (!qrSession) return;

    setTimeLeft(20);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const qrInterval = setInterval(async () => {
      try {
        const { data } = await axiosClient.post("/faculty/startattendance", {
          courseId,
        });
        setQrSession(data.sessionKey);
        setTimeLeft(20);
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
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
    <header className="mb-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        Attendance —{" "}
        <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          {courseName}
        </span>
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Manage attendance manually or via QR
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {/* Manual Attendance */}
      <section className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Manual Attendance
        </h3>

        <ul className="space-y-2 max-h-[380px] overflow-y-auto">
          {students.map((student, idx) => (
            <li
              key={student._id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:shadow transition"
            >
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-500">{student.emailId}</p>
              </div>

              <button
                onClick={() => toggleAttendance(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  student.present
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                {student.present ? "Present" : "Mark"}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Submit Attendance
        </button>
      </section>

      {/* QR Attendance */}
      <section className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-lg p-5 text-center">
  <h3 className="text-lg font-semibold mb-4 text-gray-800">
    QR Attendance
  </h3>

  {!qrSession ? (
    <button
      onClick={startQR}
      className="py-2.5 px-6 rounded-full text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
    >
      Start QR
    </button>
  ) : (
    <div className="flex flex-col items-center space-y-3">
      <p className="text-sm text-gray-700 font-medium">
        Scan to mark attendance
      </p>

      {/* 🔹 Bigger QR */}
      <div className="p-3 bg-white/50 rounded-2xl shadow-inner">
        <QRCodeCanvas value={qrSession} size={240} />
      </div>

      <p className="text-xs text-gray-500">
        Refresh in <span className="font-semibold">{timeLeft}</span> sec
      </p>

      {bluetoothAllowed && !bluetoothOn && (
        <p className="text-xs text-yellow-600 font-medium">
          ⚠️ Turn ON Bluetooth
        </p>
      )}
    </div>
  )}
</section>

    </div>

    {/* Chatbot Panel */}
    {isChatOpen && (
      <div className="fixed inset-y-0 right-0 w-80 bg-gradient-to-br from-gray-900 to-black z-50 shadow-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">AI Chatbot</h2>
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-white text-lg hover:text-red-400"
          >
            ✕
          </button>
        </div>
        <div className="text-white text-sm space-y-2">
          <p>Hello 👋 I’m your AI helper!</p>
        </div>
      </div>
    )}

    {/* Floating Chatbot Button */}
    <button
      onClick={() => setIsChatOpen(true)}
      className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg p-4 hover:scale-105 transition z-50"
    >
      💬
    </button>
  </div>
);



}
