const Course = require("../models/courses")
const Department = require("../models/department")
const Room = require("../models/room")
const User = require('../models/user')
const mongoose = require("mongoose")
const PushSubscription = require("../models/PushSubscription");
const webPush = require("../utils/pushService");


const createCourse = async (req,res) => {
    try{
        req.body.createdby=req.result._id
        const course = await Course.create(req.body)
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        });
    }catch(error){
        console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
    }
}


const createRoom = async (req,res) => {
    try{
        req.body.createdby=req.result._id
        const room = await Room.create(req.body)
        res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: room
        });
    }catch(error){
        console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function createDepartmentTimetable(req, res) {
  try {
    const deptIdObj = new mongoose.Types.ObjectId(req.params.deptId);

    // 1) Fetch courses & faculty
    const courses = await Course.find({ department: { $in: [deptIdObj] } })
      .populate("faculty");

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found for this department" });
    }

    // Helper to format timetable cell
    const makeCell = (course) => ({
      subject: course.name,
      faculty: (course.faculty && course.faculty.length > 0)
        ? (course.faculty[0].name || "TBA")
        : "TBA",
      room: "TBA" // filled later by allocation step
    });

    // 2) Config — exclude 12:00 entirely so lunch can't be used
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const HOURS = [9, 10, 11, 13, 14, 15, 16]; // no 12:00
    const HOUR_TO_KEY = h => `${h}:00`;

    // Build timetable map: day -> "HH:00" -> null | {subject, faculty, room}
    const timetable = {};
    const dayLoad = {}; // for balancing
    for (const day of DAYS) {
      timetable[day] = {};
      dayLoad[day] = 0;
      for (const h of HOURS) timetable[day][HOUR_TO_KEY(h)] = null;
    }

    // 3) Expand courses to enforce frequency = 3 for lectures, 1 for labs
    let expanded = [];
    for (const c of courses) {
      const freq = c.isLab ? 1 : 3;
      for (let i = 0; i < freq; i++) expanded.push(c);
    }
    // Shuffle for fairness
    expanded.sort(() => Math.random() - 0.5);

    // 4) Faculty-bookings PER SLOT (so they can teach multiple periods on same day, just not same time)
    // facultyBooked[day][slotKey] = Set(facultyId)
    const facultyBooked = {};
    for (const d of DAYS) facultyBooked[d] = {};

    function areFacultyFree(day, slotKeys, facultyArr) {
      if (!facultyArr || facultyArr.length === 0) return true;
      const ids = facultyArr.map(f => f._id.toString());
      for (const key of slotKeys) {
        const bookedSet = facultyBooked[day][key];
        if (!bookedSet) continue;
        for (const id of ids) {
          if (bookedSet.has(id)) return false;
        }
      }
      return true;
    }

    function reserveFaculty(day, slotKeys, facultyArr) {
      if (!facultyArr || facultyArr.length === 0) return;
      const ids = facultyArr.map(f => f._id.toString());
      for (const key of slotKeys) {
        if (!facultyBooked[day][key]) facultyBooked[day][key] = new Set();
        for (const id of ids) facultyBooked[day][key].add(id);
      }
    }

    // 5) Only one lab per day (department-wide)
    const labTakenDay = new Set();

    // Helper: does a day already contain this course?
    function dayHasCourse(day, courseName) {
      return Object.values(timetable[day]).some(
        cell => cell && cell.subject === courseName
      );
    }

    // 6) Place each requested session (expanded list)
    for (const course of expanded) {
      const isLab = !!course.isLab;
      let placed = false;

      // Balance across days by trying lower-load days first
      const candidateDays = [...DAYS].sort((a, b) => dayLoad[a] - dayLoad[b]);

      for (const day of candidateDays) {
        // Avoid duplicate same-course same-day (for nicer spread)
        if (!isLab && dayHasCourse(day, course.name)) continue;

        if (isLab) {
          // Only one lab per day in the department
          if (labTakenDay.has(day)) continue;

          // Find true *consecutive-hour* triplets: (h, h+1, h+2) present in HOURS
          for (let i = 0; i <= HOURS.length - 3; i++) {
            const h1 = HOURS[i], h2 = HOURS[i + 1], h3 = HOURS[i + 2];
            // Ensure numeric consecutiveness (prevents 11 → 13 jump over lunch)
            if (!(h2 === h1 + 1 && h3 === h2 + 1)) continue;

            const slots = [HOUR_TO_KEY(h1), HOUR_TO_KEY(h2), HOUR_TO_KEY(h3)];
            // all three empty?
            if (slots.every(s => timetable[day][s] === null) &&
                areFacultyFree(day, slots, course.faculty)) {

              // Reserve
              for (const s of slots) timetable[day][s] = makeCell(course);
              reserveFaculty(day, slots, course.faculty);
              labTakenDay.add(day);
              dayLoad[day] += 3;
              placed = true;
              break;
            }
          }
        } else {
          // Lecture: place in any free single slot
          const slotOrder = Object.keys(timetable[day]); // already excludes lunch
          for (const slotKey of slotOrder) {
            if (timetable[day][slotKey] === null &&
                areFacultyFree(day, [slotKey], course.faculty)) {

              timetable[day][slotKey] = makeCell(course);
              reserveFaculty(day, [slotKey], course.faculty);
              dayLoad[day] += 1;
              placed = true;
              break;
            }
          }
        }

        if (placed) break;
      }
      // If not placed, we silently skip (week may be too full or conflicts too tight)
    }

    // ===== 7) ROOM ALLOCATION (new) =====
    // Build quick metadata by course name to know isLab flag during allocation
    const courseMeta = new Map(courses.map(c => [c.name, { isLab: !!c.isLab }]));

    // Preload rooms and existing routines (to avoid cross-dept double booking)
    const [rooms, allDeptRoutines] = await Promise.all([
      Room.find({}).lean(),
      Department.find({}, "routine").lean()
    ]);

    // Normalize existing bookings across departments: occupied[day][time] -> Set(roomId)
    const occupied = {};
    for (const day of DAYS) occupied[day] = {};
    const addOcc = (day, time, roomId) => {
      if (!roomId) return;
      if (!occupied[day]) occupied[day] = {};   
      if (!occupied[day][time]) occupied[day][time] = new Set();
      occupied[day][time].add(roomId.toString());
    };

    for (const d of allDeptRoutines) {
      const routine = d.routine || [];
      for (const r of routine) {
        if (!DAYS.includes(r.day)) continue;
        const times = (r.time || "").split(",").map(t => t.trim()).filter(Boolean);
        if (!r.room) continue;
        for (const t of times) {
          addOcc(r.day, t, r.room);
        }
      }
    }

    // Also avoid double booking within THIS generated timetable
    // (mark as we allocate)
    const canUseRoom = (room, day, time) => {
      const set = occupied[day][time];
      return !(set && set.has(room._id.toString()));
    };
    const markRoom = (room, day, time) => addOcc(day, time, room._id);

    // Helper: consider room eligible for lab vs lecture
    const isEligibleRoom = (room, isLab) => {
      const type = (room.type || "").toLowerCase();
      if (isLab) return type === "lab";
      // For lectures, accept anything that is NOT an explicit lab
      return type !== "lab";
    };

    // Allocate rooms
    for (const day of DAYS) {
      for (const time of Object.keys(timetable[day])) {
        let cell = timetable[day][time];

        // Fill missing or null cells safely to avoid .subject errors
        if (!cell || typeof cell !== "object") {
          timetable[day][time] = { subject: "TBA", faculty: "TBA", room: "TBA" };
          continue;
        }

        // If there's no real class, ensure room = TBA and continue
        if (!cell.subject || cell.subject === "TBA") {
          cell.room = "TBA";
          continue;
        }

        // Determine if this is a lab from course meta
        const isLab = !!(courseMeta.get(cell.subject)?.isLab);

        // Try to find first eligible & free room
        const candidate = rooms.find(r => isEligibleRoom(r, isLab) && canUseRoom(r, day, time));

        if (candidate) {
          cell.room = candidate.name;
          markRoom(candidate, day, time);
        } else {
          cell.room = "TBA";
        }
      }
    }

    return res.json({ departmentId: deptIdObj, timetable });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error " +error.message });
  }
}


// timetableObj = raw object from frontend
// Returns routine[] with ObjectIds for course, faculty, room
async function flattenTimetable(timetableObj) {
  const subjectSet = new Set();
  const facultySet = new Set();
  const roomSet = new Set();

  // Collect unique names
  for (const [day, slots] of Object.entries(timetableObj)) {
    if (!slots || typeof slots !== "object") continue;
    for (const [time, { subject, faculty, room } = {}] of Object.entries(slots)) {
      if (subject && subject !== "TBA") subjectSet.add(subject.trim());
      if (faculty && faculty !== "TBA") facultySet.add(faculty.trim());
      if (room && room !== "TBA") roomSet.add(room.trim());
    }
  }

  // Bulk fetch matches
  const [courses, faculties, rooms] = await Promise.all([
    Course.find({ name: { $in: Array.from(subjectSet) } }).select("_id name"),
    User.find({ name: { $in: Array.from(facultySet) }, role: "faculty" }).select("_id name"),
    Room.find({ name: { $in: Array.from(roomSet) } }).select("_id name"),
  ]);

  // Build lookup maps (case-insensitive)
  const key = (s) => s.trim().toLowerCase();
  const courseMap = new Map(courses.map((c) => [key(c.name), c._id]));
  const facultyMap = new Map(faculties.map((f) => [key(f.name), f._id]));
  const roomMap = new Map(rooms.map((r) => [key(r.name), r._id]));

  // Flatten into routine[]
  const routine = [];
  for (const [day, slots] of Object.entries(timetableObj)) {
    if (!slots || typeof slots !== "object") continue;
    for (const [time, details] of Object.entries(slots)) {
      if (!details) continue;

      const subj = details.subject?.trim();
      const fac = details.faculty?.trim();
      const rm = details.room?.trim();

      routine.push({
        day,
        time,
        course: subj && subj !== "TBA" ? courseMap.get(key(subj)) ?? null : null,
        faculty: fac && fac !== "TBA" ? facultyMap.get(key(fac)) ?? null : null,
        room: rm && rm !== "TBA" ? roomMap.get(key(rm)) ?? null : null,
      });
    }
  }

  return routine;
}

async function conflict(req, res) {
  try {
    const { deptId } = req.params;

    // Normalize incoming timetable to routine[] with ObjectIds
    const newRoutine = await flattenTimetable(req.body);

    const deptIdObj = new mongoose.Types.ObjectId(deptId);

    // Fetch all other depts with populated routine
    const otherDepts = await Department.find({ _id: { $ne: deptIdObj } })
      .populate("routine.faculty", "name")
      .populate("routine.room", "name")
      .lean();

    // --- Conflict Check ---
    for (const entry of newRoutine) {
      const { day, time, faculty, room } = entry;

      for (const dept of otherDepts) {
        const deptRoutine = dept.routine || [];
        for (const r of deptRoutine) {
          if (r.day !== day) continue;

          const times = Array.isArray(r.time)
            ? r.time.map(t => t.trim())
            : (r.time || "").split(",").map(t => t.trim());

          if (!times.includes(time)) continue;

          // --- Room Conflict ---
          if (room && r.room && room.toString() === r.room._id.toString()) {
            return res.json({
              ok: false,
              conflictWith: dept._id,
              message: `Room conflict: ${r.room.name} is already booked by department ${dept.name} at ${day} ${time}`
            });
          }

          // --- Faculty Conflict ---
          if (faculty && r.faculty && faculty.toString() === r.faculty._id.toString()) {
            return res.json({
              ok: false,
              conflictWith: dept._id,
              message: `Faculty conflict: ${r.faculty.name} is already teaching for department ${dept.name} at ${day} ${time}`
            });
          }
        }
      }
    }

    // ✅ No conflicts
    res.json({ ok: true });

  } catch (err) {
    console.error("Conflict check failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}


// creating this function 
const publishRoutine = async (req, res) => {
  try {
    const { deptId } = req.params;

    // Accept both shapes: { timetable: {...} } or raw object
    const timetable = req.body?.timetable ?? req.body;
    if (!timetable || typeof timetable !== 'object') {
      return res.status(400).json({ message: "Invalid timetable payload" });
    }

    // Collect unique names (skip TBA)
    const subjectSet = new Set();
    const facultySet = new Set();
    const roomSet = new Set();

    for (const [day, slots] of Object.entries(timetable)) {
      if (!slots || typeof slots !== 'object') continue;
      for (const [time, { subject, faculty, room } = {}] of Object.entries(slots)) {
        if (subject && subject !== 'TBA') subjectSet.add(subject.trim());
        if (faculty && faculty !== 'TBA') facultySet.add(faculty.trim());
        if (room && room !== 'TBA') roomSet.add(room.trim());
      }
    }

    // Bulk fetch once per collection
    const [courses, faculties, rooms] = await Promise.all([
      Course.find({ name: { $in: Array.from(subjectSet) } }).select('_id name subjectcode'),
      User.find({ name: { $in: Array.from(facultySet) }, role: 'faculty' }).select('_id name'),
      Room.find({ name: { $in: Array.from(roomSet) } }).select('_id name')
    ]);

    // Build case-insensitive maps
    const key = s => s.trim().toLowerCase();
    const courseMap  = new Map(courses.map(c  => [key(c.name), c._id]));
    const facultyMap = new Map(faculties.map(f => [key(f.name), f._id]));
    const roomMap    = new Map(rooms.map(r    => [key(r.name), r._id]));

    // Transform timetable → routine[]
    const routine = [];
    const unmatched = { subjects: new Set(), faculty: new Set(), rooms: new Set() };

    for (const [day, slots] of Object.entries(timetable)) {
      for (const [time, details] of Object.entries(slots)) {
        const subj = details?.subject?.trim();
        const fac  = details?.faculty?.trim();
        const rm   = details?.room?.trim();

        const courseId  = (!subj || subj === 'TBA') ? null : (courseMap.get(key(subj)) ?? null);
        const facultyId = (!fac  || fac  === 'TBA') ? null : (facultyMap.get(key(fac)) ?? null);
        const roomId    = (!rm   || rm   === 'TBA') ? null : (roomMap.get(key(rm))   ?? null);

        if (subj && subj !== 'TBA' && !courseId)  unmatched.subjects.add(subj);
        if (fac  && fac  !== 'TBA' && !facultyId) unmatched.faculty.add(fac);
        if (rm   && rm   !== 'TBA' && !roomId)    unmatched.rooms.add(rm);

        routine.push({ course: courseId, faculty: facultyId, room: roomId, time, day });
      }
    }

    // Save (PATCH)
    const updated = await Department.findByIdAndUpdate(
      deptId,
      { $set: { routine } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Department not found" });

    //  // ------------ 🔔 Send push notifications (BEFORE response) ------------
    // // (Optional) If you have a way to target only that department's users,
    // // replace this with a filtered query.
    // const subscriptions = await PushSubscription.find();
    // console.log(subscriptions)
    // const payload = JSON.stringify({
    //   title: "New Timetable Published 📅",
    //   body: "The timetable for your department has been updated.",
    //   // Service worker can open this on click:
    //   url: `/department/${deptId}/routine`,
    //   // Optional extras your SW can use:
    //   icon: "/icons/icon-192.png",
    //   badge: "/icons/badge-72.png",
    //   tag: `dept-${deptId}-routine` // helps replace older notifications
    // });

    // const results = await Promise.allSettled(
    //   subscriptions.map(sub => webPush.sendNotification(sub, payload))
    // );

    // // Clean up gone endpoints (410/404)
    // const toDelete = [];
    // results.forEach((r, i) => {
    //   if (r.status === "rejected") {
    //     const err = r.reason;
    //     console.error("Push error:", err?.body || err);
    //     if (err?.statusCode === 410 || err?.statusCode === 404) {
    //       toDelete.push(subscriptions[i].endpoint);
    //     }
    //   }
    // });
    // if (toDelete.length) {
    //   await PushSubscription.deleteMany({ endpoint: { $in: toDelete } });
    // }
    // ------------ 🔔 Done --------------------------------------------------

    res.status(200).json({
      message: "Timetable updated successfully",
      counts: {
        totalSlots: routine.length,
        matched: {
          courses: courses.length,
          faculty: faculties.length,
          rooms: rooms.length
        }
      },
      unmatched: {
        subjects: Array.from(unmatched.subjects),
        faculty:  Array.from(unmatched.faculty),
        rooms:    Array.from(unmatched.rooms)
      },
      routine: updated.routine
    });
    
  } catch (err) {
    console.error("Error publishing timetable:", err);
    res.status(500).json({ message: "Failed to publish timetable", error: err?.message });
  }
};



const createDepartment = async (req,res) => {
    try{
        
        req.body.createdby=req.result._id
        const department = await Department.create(req.body)
        res.status(201).json({
            success: true,
            message: "department created successfully",
            department,
        });
    }catch(error){
        console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {createCourse,createRoom,createDepartmentTimetable,createDepartment,conflict,publishRoutine}