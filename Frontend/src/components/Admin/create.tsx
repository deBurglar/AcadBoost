import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import axiosClient from "../../lib/axiosClient";

export default function CreatePage() {
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

  // Fetch departments & faculties only when course tab is active
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await axiosClient.get("/admin/getdepartments");
        const facRes = await axiosClient.get("/admin/getfaculties");
        setDepartments(deptRes.data.data || []);
        setFaculties(facRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, formType: "room" | "department" | "course") => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    if (formType === "room") setRoomData({ ...roomData, [e.target.name]: value });
    if (formType === "department") setDepartmentData({ ...departmentData, [e.target.name]: value });
    if (formType === "course") setCourseData({ ...courseData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent, formType: "room" | "department" | "course") => {
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

  return (
    <Tabs defaultValue="room" className="w-full max-w-2xl mx-auto mt-10">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="room">Room</TabsTrigger>
        <TabsTrigger value="department">Department</TabsTrigger>
        <TabsTrigger value="course">Course</TabsTrigger>
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
                <Input type="text" name="type" value={roomData.type} onChange={(e) => handleChange(e, "room")} />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" name="capacity" value={roomData.capacity} onChange={(e) => handleChange(e, "room")} />
              </div>
              <div>
                <Label>Building</Label>
                <Input type="text" name="building" value={roomData.building} onChange={(e) => handleChange(e, "room")} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Room"}</Button>
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
                <Input type="number" name="year" value={departmentData.year} onChange={(e) => handleChange(e, "department")} />
              </div>
              <div>
                <Label>Code</Label>
                <Input type="text" name="code" value={departmentData.code} onChange={(e) => handleChange(e, "department")} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Department"}</Button>
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
                <select name="department" value={courseData.department} onChange={(e) => handleChange(e, "course")} className="w-full p-2 border rounded-md">
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
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
                <select name="faculty" value={courseData.faculty} onChange={(e) => handleChange(e, "course")} className="w-full p-2 border rounded-md">
                  <option value="">Select Faculty</option>
                  {faculties.map((fac) => (
                    <option key={fac._id} value={fac._id}>{fac.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isLab" checked={courseData.isLab} onChange={(e) => handleChange(e, "course")} />
                <Label>Is Lab?</Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Course"}</Button>
            </form>
            {message && <p className="mt-3 text-center text-sm font-medium">{message}</p>}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
