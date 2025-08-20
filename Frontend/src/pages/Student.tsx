import React, { useEffect, useState } from "react";
import axiosClient from "../lib/axiosClient";
// ==== Types ====
interface Course {
  _id: string;
  name: string;
  subjectcode: string;
}

interface Room {
  _id: string;
  name: string;
}

interface Faculty {
  _id: string;
  name: string;
}

interface RoutineEntry {
  _id: string;
  course: Course | null;
  room: Room | null;
  faculty: Faculty | null;
  time: string;
  day: string;
}

interface Student {
  name: string;
  rollNumber: number;
}

interface RoutineData {
  student: Student;
  department: string;
  year: number;
  routine: RoutineEntry[];
}

// ==== Component ====
const StudentRoutine: React.FC = () => {
  const [routineData, setRoutineData] = useState<RoutineData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const {data} = await axiosClient.get("/student/routine");
        setRoutineData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, []);

  if (loading) return <p className="p-4">Loading routine...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!routineData) return <p className="p-4">No routine found</p>;

  // Group by day
  const groupedByDay: Record<string, RoutineEntry[]> = routineData.routine.reduce(
    (acc, entry) => {
      if (!acc[entry.day]) acc[entry.day] = [];
      acc[entry.day].push(entry);
      return acc;
    },
    {} as Record<string, RoutineEntry[]>
  );
  const timeToMinutes = (time: string): number => {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  return hour * 60 + minute;
};

  // Sort each day's routine by time
  Object.keys(groupedByDay).forEach((day) => {
    groupedByDay[day].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  });

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">
        {routineData.student.name} - Routine
      </h2>
      <p className="text-gray-600 mb-6">
        Department: {routineData.department} | Year: {routineData.year}
      </p>

      {/* Routine Day-wise */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.keys(groupedByDay).map((day) => (
          <div key={day} className="bg-white shadow-lg rounded-2xl p-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">{day}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-left">Faculty</th>
                  <th className="p-2 text-left">Room</th>
                </tr>
              </thead>
              <tbody>
                {groupedByDay[day].map((entry) => (
                  <tr key={entry._id} className="border-b">
                    <td className="p-2">{entry.time}</td>
                    <td className="p-2">
                      {entry.course ? (
                        <>
                          {entry.course.name}
                          <span className="text-xs text-gray-500 ml-2">
                            ({entry.course.subjectcode})
                          </span>
                        </>
                      ) : (
                        <span className="italic text-gray-400">Free Period</span>
                      )}
                    </td>
                    <td className="p-2">
                      {entry.faculty ? entry.faculty.name : "-"}
                    </td>
                    <td className="p-2">{entry.room ? entry.room.name : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentRoutine;
