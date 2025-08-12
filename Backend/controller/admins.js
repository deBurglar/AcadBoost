const Course = require("../models/courses")
const Department = require("../models/department")
const Room = require("../models/room")
const User = require('../models/user')

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
        
    }
}


const createTimeTable = async (req,res) =>{


const rooms = await Room.find({}).select("name type")
const courses = await Course.find({}).select("subjectcode year faculty")
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const START_HOUR = 9;
const END_HOUR = 17;
const BREAK_HOUR = 12;

function generateTimeSlots() {
    const slots = [];
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
        if (hour === BREAK_HOUR) continue; // Skip break
        slots.push(`${hour}:00`);
    }
    return slots;
}

function solveTimetable(courses, rooms) {
    const timeSlots = generateTimeSlots();
    const timetable = [];
    const teacherSchedule = {};
    const roomSchedule = {};
    const studentLabDays = {}; // year -> set of days with lab
    const yearLoad = {}; // year -> { Mon: count, Tue: count, ... }

    function isValidLecture(day, time, room, teacher) {
        return !teacherSchedule[teacher]?.[day]?.has(time) &&
               !roomSchedule[room]?.[day]?.has(time);
    }

    function isValidLab(day, startIndex, room, teacher) {
        if (startIndex + 2 >= timeSlots.length) return false; // Need 3 consecutive slots
        const labSlots = timeSlots.slice(startIndex, startIndex + 3);
        // Cannot cross break or be interrupted
        if (labSlots.length < 3) return false;
        for (let slot of labSlots) {
            if (teacherSchedule[teacher]?.[day]?.has(slot)) return false;
            if (roomSchedule[room]?.[day]?.has(slot)) return false;
        }
        return true;
    }

    function reserveSlots(course, day, slots, room, teacher) {
        timetable.push({ course: course.name, teacher, room, day, time: slots });
        teacherSchedule[teacher] = teacherSchedule[teacher] || {};
        roomSchedule[room] = roomSchedule[room] || {};
        teacherSchedule[teacher][day] = teacherSchedule[teacher][day] || new Set();
        roomSchedule[room][day] = roomSchedule[room][day] || new Set();
        for (let slot of slots) {
            teacherSchedule[teacher][day].add(slot);
            roomSchedule[room][day].add(slot);
        }
        // Update load
        yearLoad[course.year] = yearLoad[course.year] || {};
        yearLoad[course.year][day] = (yearLoad[course.year][day] || 0) + 1;
    }

    function releaseSlots(course, day, slots, room, teacher) {
        timetable.pop();
        for (let slot of slots) {
            teacherSchedule[teacher][day].delete(slot);
            roomSchedule[room][day].delete(slot);
        }
        yearLoad[course.year][day]--;
    }

    function placeCourse(index) {
        if (index === courses.length) return true;

        const course = courses[index];

        // Sort days to balance load
        const sortedDays = [...DAYS].sort((a, b) => {
            const loadA = yearLoad[course.year]?.[a] || 0;
            const loadB = yearLoad[course.year]?.[b] || 0;
            return loadA - loadB;
        });

        for (let day of sortedDays) {
            // Lab: ensure only one per day per year
            if (course.isLab && studentLabDays[course.year]?.has(day)) continue;

            for (let room of rooms) {
                if (course.isLab && room.type !== "lab") continue;
                if (!course.isLab && room.type === "lab") continue;

                for (let teacher of course.faculty) {
                    if (course.isLab) {
                        // Try placing lab in any start slot
                        for (let startIndex = 0; startIndex < timeSlots.length; startIndex++) {
                            if (isValidLab(day, startIndex, room.name, teacher)) {
                                const labSlots = timeSlots.slice(startIndex, startIndex + 3);
                                reserveSlots(course, day, labSlots, room.name, teacher);
                                studentLabDays[course.year] = studentLabDays[course.year] || new Set();
                                studentLabDays[course.year].add(day);

                                if (placeCourse(index + 1)) return true;

                                studentLabDays[course.year].delete(day);
                                releaseSlots(course, day, labSlots, room.name, teacher);
                            }
                        }
                    } else {
                        // Lecture
                        for (let time of timeSlots) {
                            if (isValidLecture(day, time, room.name, teacher)) {
                                reserveSlots(course, day, [time], room.name, teacher);
                                if (placeCourse(index + 1)) return true;
                                releaseSlots(course, day, [time], room.name, teacher);
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    if (placeCourse(0)) return timetable;
    throw new Error("No valid timetable found.");
}



console.log(solveTimetable(courses, rooms));

}

// const createDepartment = async (req,res) => {
//     try{
//         const rooms = Room.find({})
//         const course = Course.find({role:"faculty"})
//         req.body.createdby=req.result._id
//         const department = await Department.create(req.body)
//         res.status(201).json({
//             success: true,
//             message: "department created successfully",
//             data: course
//         });
//     }catch(error){
        
//     }
// }

module.exports = {createCourse,createRoom,createTimeTable}