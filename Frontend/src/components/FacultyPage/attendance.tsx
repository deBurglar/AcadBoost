import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileText,BarChart3,BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Attendance() {
     const navigate = useNavigate();
     const [showReports, setShowReports] = useState(false);
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      
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
           <Button
            className="w-full mb-3"
            variant="secondary"
            onClick={() => setShowReports(!showReports)}
          >
            {showReports ? "Hide Options" : "View Reports"}
          </Button>

          {/* Extra Options */}
          {showReports && (
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="flex items-center gap-2 justify-start" onClick={() => navigate("/faculty/attendance/courses")}>
                <BookOpen className="w-4 h-4" /> My Courses
              </Button>
              <Button variant="outline" className="flex items-center gap-2 justify-start">
                <BarChart3 className="w-4 h-4" /> Attendance Trends
              </Button>
              </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
}
