import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ClipboardList, FileText } from "lucide-react";
import { useNavigate } from "react-router";

export default function Attendance() {
     const navigate = useNavigate();
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Take Attendance Card */}
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardList className="w-6 h-6" /> Take Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Record and manage student attendance quickly.
          </p>
          <Button className="w-full">Start Now</Button>
        </CardContent>
      </Card>

      {/* View Reports Card */}
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6" /> View Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Check attendance reports and analytics anytime.
          </p>
          <Button className="w-full" variant="secondary" onClick={() => navigate("/attendance/reports")}> 
            View Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
