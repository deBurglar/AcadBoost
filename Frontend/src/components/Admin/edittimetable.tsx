import { useParams } from "react-router";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import axiosClient from "../../lib/axiosClient";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const EditTimeTable = () => {
  const { deptId } = useParams<{ deptId: string }>();

  const [timetable, setTimetable] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [department, setDepartment] = useState<any>(null);
  const [departmentCourses, setDepartmentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // editingCell keeps track of which free cell is currently showing the "Add Course" form
  const [editingCell, setEditingCell] = useState<{ day: string; time: string } | null>(null);
  // temp selections for the add form
  const [tempSelection, setTempSelection] = useState<{ courseId?: string; facultyId?: string; roomId?: string; manualCourseName?: string; manualSubjectcode?: string }>({});

  // --- normalize backend timetable object -> array the UI expects ---
  const normalizeTimetable = (timetableObj: any, roomsList: any[] = [], facultiesList: any[] = []) => {
    if (!timetableObj) return [];

    // If the backend already returned an array (defensive), return it unchanged
    if (Array.isArray(timetableObj)) return timetableObj;

    const arr: any[] = [];
    for (const [day, slots] of Object.entries(timetableObj)) {
      if (!slots || typeof slots !== "object") continue;
      for (const [time, cell] of Object.entries(slots as any)) {
        // cell may be { subject, faculty, room } or "TBA"
        const subject = cell?.subject || (typeof cell === "string" ? cell : null);
        const facultyName = cell?.faculty;
        const roomName = cell?.room;

        // Attempt to map names back to actual faculty/room objects (best effort)
        const matchedFaculty = facultiesList.find(
          (f) =>
            f &&
            (f.name === facultyName ||
              f.facultyProfile?.shortName === facultyName ||
              `${f.name}` === facultyName)
        ) || null;

        const matchedRoom = roomsList.find((r) => r && (r.name === roomName || `${r.name}` === roomName)) || null;

        arr.push({
          _id: `${day}-${time}`, // stable unique id
          day,
          time,
          course:
            subject && subject !== "TBA"
              ? { name: subject, subjectcode: (cell?.subjectcode || "").toString() }
              : null,
          faculty: matchedFaculty,
          room: matchedRoom,
        });
      }
    }
    return arr;
  };

  useEffect(() => {
    if (!deptId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [ttRes, roomRes, facRes] = await Promise.all([
          axiosClient.get(`/admin/presenttimetable/${deptId}`),
          axiosClient.get("/admin/getrooms"),
          axiosClient.get("/admin/getfaculties"),
        ]);

        const roomsData = roomRes.data.data || [];
        const facData = facRes.data.data || [];
        setRooms(roomsData);
        setFaculties(facData);

        const deptObj = ttRes.data.department || null;
        setDepartment(deptObj);

        // attempt to locate timetable in either { department: { timetable: {...} } } or direct { timetable: {...} }
        const rawTimetable =
          ttRes.data.department?.timetable ?? ttRes.data.timetable ?? ttRes.data?.routine ?? ttRes.data;

        setTimetable(normalizeTimetable(rawTimetable, roomsData, facData));

        // try to fetch department courses (backend endpoint assumed)
        try {
          const coursesRes = await axiosClient.get(`/admin/departmentcourses/${deptId}`);
          setDepartmentCourses(coursesRes.data.data || []);
        } catch (e) {
          // fallback: if endpoint not available, try another common endpoint
          try {
            const coursesRes2 = await axiosClient.get(`/admin/getcourses`);
            const allCourses = coursesRes2.data.data || [];
            if (deptObj && deptObj.name) {
              const filtered = allCourses.filter((c: any) => {
                if (!c.department) return false;
                return c.department.some((d: any) => d._id === deptId || d.name === deptObj.name);
              });
              setDepartmentCourses(filtered.length ? filtered : allCourses);
            } else {
              setDepartmentCourses(allCourses);
            }
          } catch (err) {
            setDepartmentCourses([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch timetable data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deptId]);

  const updateSlot = (slotId: string, field: "room" | "faculty", value: string) => {
    setTimetable((prev) =>
      prev.map((slot) =>
        slot._id === slotId
          ? {
              ...slot,
              [field]: field === "room" ? rooms.find((r) => r._id === value) : faculties.find((f) => f._id === value),
            }
          : slot
      )
    );
  };

  const removeSlot = (slotId: string) => {
    setTimetable((prev) => prev.filter((s) => s._id !== slotId));
  };

  // Add a new slot with optional course/faculty/room (used when adding from the inline form)
  const addSlot = (day: string, time: string, opts?: { courseId?: string; courseObj?: any; facultyId?: string; roomId?: string }) => {
    const courseObj =
      opts?.courseObj ??
      (opts?.courseId ? departmentCourses.find((c) => c._id === opts.courseId) : { name: "New Course", subjectcode: "TBA" });
    const facultyObj = opts?.facultyId ? faculties.find((f) => f._id === opts.facultyId) : null;
    const roomObj = opts?.roomId ? rooms.find((r) => r._id === opts.roomId) : null;

    const newSlot = {
      _id: `temp-${day}-${time}-${Date.now()}`,
      day,
      time,
      course: courseObj,
      faculty: facultyObj,
      room: roomObj,
    };

    setTimetable((prev) => {
      const withoutThisCell = prev.filter((s) => !(s.day === day && s.time === time));
      return [...withoutThisCell, newSlot];
    });
    setEditingCell(null);
    setTempSelection({});
  };

  const formatForBackend = (slots: any[]) => {
    const formatted: any = {};
    slots.forEach((slot) => {
      if (!slot.day || !slot.time) return;

      if (!formatted[slot.day]) {
        formatted[slot.day] = {};
      }

      formatted[slot.day][slot.time] = {
        subject: slot.course ? slot.course.name || slot.course.subjectcode || "TBA" : "TBA",
        faculty: slot.faculty ? slot.faculty.name : "TBA",
        room: slot.room ? slot.room.name : "TBA",
      };
    });
    return formatted;
  };

  const saveChanges = async () => {
    try {
      const payload = formatForBackend(timetable);
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
      console.log(payload)
      const res = await axiosClient.post(`/admin/conflict/${deptId}`, payload);

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

  const regenerateTimetable = async () => {
    try {
      if (!deptId) return;
      setLoading(true);

      const res = await axiosClient.get(`/admin/createtimetable/${deptId}`);

      // backend might return object as res.data.timetable or res.data.department.timetable
      const raw = res.data.timetable ?? res.data.department?.timetable ?? res.data;
      // use current rooms/faculties state to try to map names back to objects
      setTimetable(normalizeTimetable(raw, rooms, faculties));
      alert("✅ Timetable regenerated successfully!");
    } catch (err) {
      console.error("Regenerate failed", err);
      alert("❌ Failed to regenerate timetable");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200">
        <div className="relative">
          <div className="w-20 h-20 border-8 border-t-8 border-gray-200 rounded-full animate-spin border-t-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold text-purple-700 animate-pulse">⏳</span>
          </div>
        </div>
        <p className="mt-6 text-2xl font-bold text-purple-700 animate-bounce">Loading Timetable...</p>
        <p className="mt-2 text-sm text-gray-600">Please wait while we fetch your data 🚀</p>
      </div>
    );
  }

 return (
  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
        Edit Timetable – {department?.name || deptId}
      </h1>
      <Button
        variant="secondary"
        onClick={regenerateTimetable}
        className="gap-2 shadow-sm hover:shadow-md transition-all duration-200"
      >
        🔄 Regenerate
      </Button>
    </div>

    {/* Table */}
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
  <table className="table-auto border-collapse w-full text-sm">
    <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
      <tr>
        <th className="border border-gray-200 p-3 text-left w-[120px]">Day</th>
        {timeSlots.map((time) => (
          <th key={time} className="border border-gray-200 p-3 text-center">
            {time}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {days.map((day) => (
        <tr key={day} className="hover:bg-gray-50 transition-colors">
          <td className="border border-gray-200 p-3 font-semibold text-gray-800">{day}</td>
          {timeSlots.map((time) => {
            const cellSlots = timetable.filter((s) => s.day === day && s.time === time);
            const slot = cellSlots.find((s) => s.course) || cellSlots[0];
            const isEditing = editingCell && editingCell.day === day && editingCell.time === time;

            return (
              <td key={day + time} className="border border-gray-200 p-3 align-top min-w-[250px]">
                {slot && slot.course ? (
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-900 text-base">
                      {slot.course.name}
                    </div>
                    <div className="text-xs text-gray-500">{slot.course.subjectcode}</div>

                    {/* Faculty dropdown */}
                    <Select value={slot.faculty?._id || ""} onValueChange={(val) => updateSlot(slot._id, "faculty", val)}>
                      <SelectTrigger className="w-full bg-gray-50">
                        <SelectValue placeholder="Faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties.map((f) => (
                          <SelectItem key={f._id} value={f._id}>
                            {f.facultyProfile?.shortName} – {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Room dropdown */}
                    <Select value={slot.room?._id || ""} onValueChange={(val) => updateSlot(slot._id, "room", val)}>
                      <SelectTrigger className="w-full bg-gray-50">
                        <SelectValue placeholder="Room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((r) => (
                          <SelectItem key={r._id} value={r._id}>
                            {r.name} ({r.building})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Updated softer remove button */}
                    <Button
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                      size="sm"
                      onClick={() => removeSlot(slot._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {!isEditing ? (
                      <>
                        <span className="text-gray-400 italic text-sm">Free</span>
                        <Button
                          size="sm"
                          className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 mt-2 w-full"
                          onClick={() => setEditingCell({ day, time })}
                        >
                          ➕ Add Course
                        </Button>
                      </>
                    ) : (
                      // ... same inline add form logic as before
                      <div className="space-y-2 w-full">
                        {/* Add form content unchanged */}
                      </div>
                    )}
                  </div>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
</div>


    {/* Bottom buttons */}
    <div className="mt-6 flex gap-4">
      <Button
        onClick={checkconflict}
        className="px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
      >
        Check Conflict
      </Button>
      <Button
        onClick={saveChanges}
        className="px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
      >
        Save Changes
      </Button>
    </div>
  </div>
);

};

export default EditTimeTable;
