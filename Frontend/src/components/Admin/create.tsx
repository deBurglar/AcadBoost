import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import axiosClient from "../../lib/axiosClient";
// import { useNavigate } from "react-router";

// Types for safety
type Slot = { subject: string; faculty: string; room: string};
type DaySlots = Record<string, Slot>;
type Timetable = Record<string, DaySlots>;


export default function CreatePage() {

  // const navigate = useNavigate();
  // ---------------- ROOM ----------------
  const [roomData, setRoomData] = useState({ name: "", type: "", capacity: "", building: "" });

  // ---------------- DEPARTMENT ----------------
  const [departmentData, setDepartmentData] = useState({ name: "", year: "", code: "" });

  // ---------------- COURSE ----------------
  const [courseData, setCourseData] = useState({
    name: "",
    department: "",
    subjectcode: "",
    year: "",
    faculty: "",
    isLab: false,
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------------- Timetable ----------------
  const [selectedDept, setSelectedDept] = useState("");
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loadingTimetable, setLoadingTimetable] = useState(false);

  // ---------- helpers for time + merging ----------
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (Number.isFinite(m) ? m : 0);
  };

  const sortTimes = (times: string[]) => times.slice().sort((a, b) => toMinutes(a) - toMinutes(b));

  const mergeDaySlots = (slots: DaySlots) => {
  const times = sortTimes(Object.keys(slots));
  const merged: Array<{ start: string; end: string; subject: string; faculty: string; room: string }> = [];

  let i = 0;
  while (i < times.length) {
    const start = times[i];
    const first = slots[start];
    let end = addHours(start, 1); // default 1hr
    let j = i + 1;

    while (j < times.length) {
      const prev = times[j - 1];
      const curr = times[j];

      const isConsecutiveHour = toMinutes(curr) - toMinutes(prev) === 60;
      const sameClass =
        slots[curr].subject === first.subject &&
        slots[curr].faculty === first.faculty &&
        slots[curr].room === first.room;

      if (isConsecutiveHour && sameClass) {
        end = addHours(curr, 1); // extend by 1hr each loop
        j++;
      } else {
        break;
      }
    }

    merged.push({ start, end, subject: first.subject, faculty: first.faculty, room: first.room });
    i = j;
  }

  return merged;
};


  const addHours = (time: string, hours: number): string => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setHours(date.getHours() + hours);
  return date.toTimeString().slice(0, 5); // returns "HH:MM"
};

 const fetchTimetable = async (deptId?: string) => {
  const id = deptId ?? selectedDept;
  setSelectedDept(id);
  if (!id) {
    setTimetable(null);
    return;
  }

  setLoadingTimetable(true);
  try {
    const { data } = await axiosClient.get(`/admin/presenttimetable/${id}`);

    // ✅ timetable array comes from backend
    const arr = data?.department?.timetable ?? [];

    const tt: Timetable = {};

    arr.forEach((item: any) => {
      const day: string = item.day ?? "Unknown";
      const time: string = item.time ?? "";

      if (!time) return; // skip invalid rows

      if (!tt[day]) tt[day] = {};

      tt[day][time] = {
        subject: item.course?.name || item.course?.subjectcode || "--",
        faculty: item.faculty?.name || "--",
        room: item.room?.name || "--",
      };
    });

    console.log("✅ Transformed timetable:", tt);
    setTimetable(tt);
  } catch (error) {
    console.error("Error fetching timetable", error);
    setTimetable(null);
  } finally {
    setLoadingTimetable(false);
  }
};


  // Fetch departments & faculties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await axiosClient.get("/admin/getdepartments");
        const facRes = await axiosClient.get("/admin/getfaculties");
        setDepartments(deptRes?.data?.data || []);
        setFaculties(facRes?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formType: "room" | "department" | "course"
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    if (formType === "room") setRoomData({ ...roomData, [e.target.name]: value });
    if (formType === "department") setDepartmentData({ ...departmentData, [e.target.name]: value });
    if (formType === "course") setCourseData({ ...courseData, [e.target.name]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent,
    formType: "room" | "department" | "course"
  ) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let res;
      if (formType === "room") {
        res = await axiosClient.post("/admin/createroom", roomData);
        if (res.data.success) setRoomData({ name: "", type: "", capacity: "", building: "" });
      } else if (formType === "department") {
        res = await axiosClient.post("/admin/createdepartment", departmentData);
        if (res.data.success) setDepartmentData({ name: "", year: "", code: "" });
      } else if (formType === "course") {
        res = await axiosClient.post("/admin/createcourse", courseData);
        if (res.data.success) setCourseData({ name: "", department: "", subjectcode: "", year: "", faculty: "", isLab: false });
      }

      if (res?.data.success) setMessage("✅ Created successfully!");
    } catch (error: any) {
      setMessage("❌ Failed to create.");
    } finally {
      setLoading(false);
    }
  };

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Tabs defaultValue="room" className="w-full  mx-auto mt-10">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="room">Room</TabsTrigger>
        <TabsTrigger value="department">Department</TabsTrigger>
        <TabsTrigger value="course">Course</TabsTrigger>
        <TabsTrigger value="timetable">Timetable</TabsTrigger>
      </TabsList>

      {/* ROOM TAB */}
      <TabsContent value="room">
        <Card className="p-6 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Create Room</h2>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "room")}>
              <div>
                <Label>Name</Label>
                <Input type="text" name="name" value={roomData.name} onChange={(e) => handleChange(e, "room")} required />
              </div>
              <div>
  <Label>Type</Label>
  <select
    name="type"
    value={roomData.type}
    onChange={(e) => handleChange(e, "room")}
    className="w-full border rounded-lg p-2"
  >
    <option value="">Select Type</option>
    <option value="Lecture">Lecture</option>
    <option value="Lab">Lab</option>
  </select>
</div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" name="capacity" value={roomData.capacity} onChange={(e) => handleChange(e, "room")} />
              </div>
              <div>
  <Label>Building</Label>
  <select
    name="building"
    value={roomData.building}
    onChange={(e) => handleChange(e, "room")}
    className="w-full border rounded-lg p-2"
  >
    <option value="">Select Building</option>
    <option value="Civil Mechanical Electrical">Civil Mechanical Electrical Building</option>
    <option value="Information and Communication Technology">Information and Communication Technology Building</option>
    <option value="Central Block">Central Block Building</option>
  </select>
</div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </form>
            {message && <p className="mt-3 text-center text-sm font-medium">{message}</p>}
          </CardContent>
        </Card>
      </TabsContent>

      {/* DEPARTMENT TAB */}
      <TabsContent value="department">
        <Card className="p-6 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Create Department</h2>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "department")}>
              <div>
                <Label>Name</Label>
                <Input type="text" name="name" value={departmentData.name} onChange={(e) => handleChange(e, "department")} required />
              </div>
              <div>
                <Label>Year</Label>
                <select
                  name="year"
                  value={departmentData.year}
                  onChange={(e) => handleChange(e, "department")}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select Year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div>
                <Label>Code</Label>
                <Input type="text" name="code" value={departmentData.code} onChange={(e) => handleChange(e, "department")} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Department"}
              </Button>
            </form>
            {message && <p className="mt-3 text-center text-sm font-medium">{message}</p>}
          </CardContent>
        </Card>
      </TabsContent>

      {/* COURSE TAB */}
      <TabsContent value="course">
        <Card className="p-6 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Create Course</h2>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "course")}>
              <div>
                <Label>Name</Label>
                <Input type="text" name="name" value={courseData.name} onChange={(e) => handleChange(e, "course")} required />
              </div>
              <div>
                <Label>Department</Label>
                <select
                  name="department"
                  value={courseData.department}
                  onChange={(e) => handleChange(e, "course")}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Subject Code</Label>
                <Input type="text" name="subjectcode" value={courseData.subjectcode} onChange={(e) => handleChange(e, "course")} />
              </div>
              <div>
                <Label>Year</Label>
                <Input type="number" name="year" value={courseData.year} onChange={(e) => handleChange(e, "course")} />
              </div>
              <div>
                <Label>Faculty</Label>
                <select
                  name="faculty"
                  value={courseData.faculty}
                  onChange={(e) => handleChange(e, "course")}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((fac) => (
                    <option key={fac._id} value={fac._id}>
                      {fac.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isLab"
                  checked={courseData.isLab}
                  onChange={(e) => handleChange(e, "course")}
                />
                <Label>Is Lab?</Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Course"}
              </Button>
            </form>
            {message && <p className="mt-3 text-center text-sm font-medium">{message}</p>}
          </CardContent>
        </Card>
      </TabsContent>

      {/* TIMETABLE TAB */}
<TabsContent value="timetable">
  <Card className="p-6 shadow-lg rounded-2xl">
    <h2 className="text-2xl font-bold mb-4">Department Timetable</h2>
    <CardContent>
      <div className="space-y-4">
        {/* Select Department */}
        <div>
          <Label>Select Department</Label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fetch Button */}
        <Button
          onClick={() => fetchTimetable(selectedDept)}
          disabled={!selectedDept || loadingTimetable}
        >
          {loadingTimetable ? "Loading..." : "Fetch Timetable"}
        </Button>

        <Button className="ml-3"
          onClick={() =>window.open(`/edit/${selectedDept}`, "_blank")}
          disabled={!timetable || loadingTimetable ||!selectedDept}
        >
          {loadingTimetable ? "Loading..." : "Edit Timetable"}
        </Button>

        {/* Timetable Display */}
        {timetable && (
  <div className="overflow-x-auto">
    <table className="min-w-full border">
      <thead>
        <tr>
          <th className="border px-4 py-2">Day</th>
          <th className="border px-4 py-2">Time</th>
          <th className="border px-4 py-2">Subject</th>
          <th className="border px-4 py-2">Faculty</th>
          <th className="border px-4 py-2">Room</th>
        </tr>
      </thead>

      {dayOrder.map((day, dayIdx) => {
        const slots = timetable[day];
        if (!slots) return null;

        const mergedSlots = mergeDaySlots(slots);

        return (
          <tbody key={day}>
            {/* Thick full-width line before each day (except the first) */}
            {dayIdx > 0 && (
              <tr>
                <td colSpan={5} className="p-0">
                  <div className="h-0 border-t-4 border-gray-800" />
                </td>
              </tr>
            )}

            {mergedSlots.map((slot, i) => (
              <tr key={`${day}-${i}`}>
                {i === 0 && (
                  <td className="border px-4 py-2 font-bold align-top" rowSpan={mergedSlots.length}>
                    {day}
                  </td>
                )}
                <td className="border px-4 py-2">{slot.start} - {slot.end}</td>
                <td className="border px-4 py-2">{slot.subject}</td>
                <td className="border px-4 py-2">{slot.faculty}</td>
                <td className="border px-4 py-2">{slot.room}</td>
              </tr>
            ))}
          </tbody>
        );
      })}
    </table>
  </div>
)}

      </div>
    </CardContent>
  </Card>
</TabsContent>

    </Tabs>
  );
}
