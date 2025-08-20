import { useParams } from "react-router";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../ui/select";
import axiosClient from "../../lib/axiosClient";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];

const EditTimeTable = () => {
  const { deptId } = useParams<{ deptId: string }>();

  const [timetable, setTimetable] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deptId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [ttRes, roomRes, facRes] = await Promise.all([
          axiosClient.get(`/admin/presenttimetable/${deptId}`),
          axiosClient.get("/admin/getrooms"),
          axiosClient.get("/admin/getfaculties")
        ]);

        setTimetable(ttRes.data.department.timetable);
        setRooms(roomRes.data.data);
        setFaculties(facRes.data.data);
      } catch (err) {
        console.error("Failed to fetch timetable data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deptId]);

  const updateSlot = (slotId: string, field: "room" | "faculty", value: string) => {
    setTimetable(prev =>
      prev.map(slot =>
        slot._id === slotId
          ? {
              ...slot,
              [field]: field === "room"
                ? rooms.find(r => r._id === value)
                : faculties.find(f => f._id === value)
            }
          : slot
      )
    );
  };

  const removeSlot = (slotId: string) => {
    setTimetable(prev => prev.map(s => (s._id === slotId ? { ...s, course: null, room: null, faculty: null } : s)));
  };


  const formatForBackend = (slots: any[]) => {
  const formatted: any = {};

  slots.forEach(slot => {
    if (!slot.day || !slot.time) return;

    if (!formatted[slot.day]) {
      formatted[slot.day] = {};
    }

    formatted[slot.day][slot.time] = {
      subject: slot.course ? slot.course.name : "TBA",
      faculty: slot.faculty ? slot.faculty.name : "TBA",
      room: slot.room ? slot.room.name : "TBA"
    };
  });

  return formatted;
};

const saveChanges = async () => {
  try {
    const payload = formatForBackend(timetable);
    console.log("Sending to backend:", payload);

    await axiosClient.put(`/admin/publish/${deptId}`, payload);
    alert("✅ Timetable saved successfully!");
  } catch (err) {
    console.error("Save failed", err);
    alert("❌ Failed to save timetable");
  }
};
const checkconflict = async () => {
  try {
    const payload = formatForBackend(timetable);
    const res = await axiosClient.post(`/admin/conflict/${deptId}`, payload);
    console.log(res)
    console.log(payload)

    if (res.data.ok) {
      alert("✅ No conflicts! Timetable is valid.");
    } else {
      alert(`❌ Conflict: ${res.data.message}`);
    }
  } catch (err) {
    console.error("Conflict check failed", err);
    alert("⚠️ Error checking conflicts. Please try again.");
  }
};

//edited code
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200">
        <div className="relative">
          <div className="w-20 h-20 border-8 border-t-8 border-gray-200 rounded-full animate-spin border-t-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold text-purple-700 animate-pulse">⏳</span>
          </div>
        </div>
        <p className="mt-6 text-2xl font-bold text-purple-700 animate-bounce">
          Loading Timetable...
        </p>
        <p className="mt-2 text-sm text-gray-600">Please wait while we fetch your data 🚀</p>
      </div>
    );
  }



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Timetable – {deptId}</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border w-full">
          <thead>
            <tr>
              <th className="border p-2">Time</th>
              {days.map(day => (
                <th key={day} className="border p-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="border p-2 font-semibold">{time}</td>
                {days.map(day => {
                  const slot = timetable.find(s => s.day === day && s.time === time);

                  return (
                    <td key={day + time} className="border p-2 align-top">
                      {slot && slot.course ? (
                        <div className="space-y-2">
                          <div className="font-bold text-sm">{slot.course.name}</div>
                          <div className="text-xs text-gray-500">{slot.course.subjectcode}</div>

                          {/* Faculty dropdown */}
                          <Select
                            value={slot.faculty?._id || ""}
                            onValueChange={(val) => updateSlot(slot._id, "faculty", val)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Faculty" />
                            </SelectTrigger>
                            <SelectContent>
                              {faculties.map(f => (
                                <SelectItem key={f._id} value={f._id}>
                                  {f.facultyProfile.shortName} – {f.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Room dropdown */}
                          <Select
                            value={slot.room?._id || ""}
                            onValueChange={(val) => updateSlot(slot._id, "room", val)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Room" />
                            </SelectTrigger>
                            <SelectContent>
                              {rooms.map(r => (
                                <SelectItem key={r._id} value={r._id}>
                                  {r.name} ({r.building})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Remove slot */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSlot(slot._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Free</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Button onClick={checkconflict}>Check Conflict</Button>
        <Button onClick={saveChanges} >Save Changes</Button>
        
      </div>
    </div>
  );
};

export default EditTimeTable;
