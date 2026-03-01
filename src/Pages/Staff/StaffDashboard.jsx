import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import {
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiChartBar,
} from "react-icons/hi";
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
import Loader from "../../Components/Loader/Loader";

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedIssues: 0,
    resolvedIssues: 0,
    todayTasks: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, issuesRes] = await Promise.all([
        axios.get("https://citywatch-server.vercel.app/staff/stats", {
          headers,
        }),
        axios.get("https://citywatch-server.vercel.app/staff/issues", {
          headers,
        }),
      ]);

      setStats(statsRes.data);
      setRecentIssues(issuesRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In-Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Working":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const chartData = [
    { name: "Assigned", value: stats.assignedIssues },
    { name: "Resolved", value: stats.resolvedIssues },
    { name: "Today's Tasks", value: stats.todayTasks },
  ];

  return (
    <div className="mt-20 bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Staff{" "}
            <span style={{ color: "var(--color-primary)" }}>Dashboard</span>
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.displayName || "Staff Member"}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-[var(--color-primary)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Assigned</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.assignedIssues}
                </p>
              </div>
              <div
                style={{ backgroundColor: "var(--color-primary)" }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
              >
                <HiClipboardList className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Resolved Issues</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.resolvedIssues}
                </p>
              </div>
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white">
                <HiCheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Today's Tasks</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.todayTasks}
                </p>
              </div>
              <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center text-white">
                <HiClock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <HiChartBar className="text-gray-600 w-6 h-6" />
            <h2 className="text-2xl font-bold">Statistics Overview</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Assigned Issues</h2>
            <Link
              to="/staff/assigned-issues"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline font-medium"
            >
              View All →
            </Link>
          </div>

          {recentIssues.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((issue) => (
                    <tr
                      key={issue._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {issue.title}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {issue.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            issue.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No issues assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
