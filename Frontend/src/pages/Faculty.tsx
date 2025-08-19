import { useEffect, useState } from "react"
import axiosClient from "../lib/axiosClient"
import { Card, CardContent, CardTitle, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router"

function mergeSlots(slots: any[]) {
  if (!slots || slots.length === 0) return []

  const sorted = [...slots].sort(
    (a, b) => Number(a.time.split(":")[0]) - Number(b.time.split(":")[0])
  )

  const merged: any[] = []
  let current = { ...sorted[0], startTime: sorted[0].time, endTime: sorted[0].time }

  for (let i = 1; i < sorted.length; i++) {
    const prevHour = Number(current.endTime.split(":")[0])
    const currHour = Number(sorted[i].time.split(":")[0])

    if (
      sorted[i].course === current.course &&
      sorted[i].room === current.room &&
      sorted[i].roomType === current.roomType &&
      currHour === prevHour + 1
    ) {
      current.endTime = sorted[i].time
    } else {
      merged.push(current)
      current = { ...sorted[i], startTime: sorted[i].time, endTime: sorted[i].time }
    }
  }
  merged.push(current)

  // ✅ Normalize lectures to 1hr
  return merged.map((slot) => {
    const startHour = Number(slot.startTime.split(":")[0])
    const endHour = Number(slot.endTime.split(":")[0])

    if (slot.roomType === "Lecture" && startHour === endHour) {
      const nextHour = startHour + 1
      return { ...slot, endTime: `${nextHour}:00` }
    }
    return slot
  })
}

// ✅ Check if current time and day lies in slot
// function isCurrentTimeInSlot(slot: any, slotDay: string) {
//   const now = new Date()

//   // Convert JS weekday → your backend day name
//   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//   const today = days[now.getDay()]

//   if (today !== slotDay) return false // 🚫 Not today

//   const hour = now.getHours()
//   const startHour = Number(slot.startTime.split(":")[0])
//   const endHour = Number(slot.endTime.split(":")[0])

//   return hour >= startHour && hour < endHour
// }

function FacultySchedule() {
  const [schedule, setSchedule] = useState<Record<string, any[]>>({})
  const navigate = useNavigate()

  const fetchSchedule = async () => {
    try {
      const { data } = await axiosClient.get("faculty/schedule")

      const processed: Record<string, any[]> = {}
      for (const day in data) {
        processed[day] = mergeSlots(data[day])
      }

      setSchedule(processed)
    } catch (error) {
      console.log("Error while fetching Schedule: " + error)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📅 Faculty Schedule</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {Object.keys(schedule).map((day) => (
          <Card key={day} className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{day}</CardTitle>
            </CardHeader>
            <CardContent>
              {schedule[day].length > 0 ? (
                <ul className="space-y-3">
                  {schedule[day].map((item, idx) => {
  // const inSlot = isCurrentTimeInSlot(item, day)
  return (
    <li key={idx} className="p-3 border rounded-xl bg-gray-50 shadow-sm space-y-2">
      <p className="font-medium">{item.course}</p>
      <p className="text-sm text-gray-600">
        {item.roomType} • {item.department}
      </p>
      <p className="text-sm">
        {item.room} • Year {item.year}
      </p>
      <p className="text-sm font-semibold">
        ⏰ {item.startTime} - {item.endTime}
      </p>

      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          // disabled={!inSlot}
          onClick={() => navigate(`/attendance/take/${item.departmentId}`)}
        >
          Take Attendance
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/attendance/edit/${item.course}`)}
        >
          Edit Attendance
        </Button>
      </div>
    </li>
  )
})}

                </ul>
              ) : (
                <p className="text-gray-400 italic">No classes</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FacultySchedule
