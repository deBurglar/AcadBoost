// src/pages/StudentAnalytics.tsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../../lib/axiosClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../../ui/card";

const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#84CC16", // Lime
  "#EC4899", // Pink
];
interface YearCount {
  year: number;
  totalStudents: number;
}

interface DeptCount {
  department: string;
  totalStudents: number;
}

interface YearDeptCount {
  departmentName: string;
  year: number;
  totalStudents: number;
}

const StudentDeptAnalytics: React.FC = () => {
  const [yearData, setYearData] = useState<YearCount[]>([]);
  const [deptData, setDeptData] = useState<DeptCount[]>([]);
  const [yearDeptData, setYearDeptData] = useState<YearDeptCount[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yearRes, deptRes, yearDeptRes] = await Promise.all([
          axiosClient.get("/admin/studentcountbyyear"),
          axiosClient.get("/admin/studentcountbydept/all"),
          axiosClient.get("/admin/studentcountperyearperdept"),
        ]);
        setYearData(yearRes.data);
        setDeptData(deptRes.data);
        setYearDeptData(yearDeptRes.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      }
    };
    fetchData();
  }, []);

  // Transform data for stacked bar (year + dept)
  const stackedData = yearDeptData.reduce((acc: any[], item) => {
    let yearEntry = acc.find((d) => d.year === item.year);
    if (!yearEntry) {
      yearEntry = { year: item.year };
      acc.push(yearEntry);
    }
    yearEntry[item.departmentName] = item.totalStudents;
    return acc;
  }, []);

  // Get unique department names for stacked bars
  const uniqueDepartments = Array.from(
    new Set(yearDeptData.map((d) => d.departmentName))
  );

  return (
    <div className="p-8 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[70vw]">
        <Card className="shadow-lg rounded-2xl w-full">
          <CardContent className="p-6 w-full">
            <h2 className="text-base font-semibold text-gray-600">
              Total Students
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {yearData.reduce((sum, y) => sum + y.totalStudents, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl w-full">
          <CardContent className="p-6 w-full">
            <h2 className="text-base font-semibold text-gray-600">
              Departments
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {deptData.length}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold text-gray-600">Years</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {yearData.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students per Year */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Students per Year
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalStudents"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Students per Department */}
      <Card className="shadow-lg rounded-2xl ">
        <CardContent className="p-6 w-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Students per Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" />
              <YAxis dataKey="department" type="category" width={180} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalStudents"
                fill="#34d399"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Students per Year + Department (Stacked) */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Students per Year per Department
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {uniqueDepartments.map((dept,index) => (
                <Bar
                  key={dept}
                  dataKey={dept}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}  // random color
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDeptAnalytics;
