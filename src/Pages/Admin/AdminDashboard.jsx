import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiCurrencyDollar,
  HiUsers,
} from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Components/Loader/Loader";
import { Link } from "react-router";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [latestIssues, setLatestIssues] = useState([]);
  const [latestPayments, setLatestPayments] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [statsRes, issuesRes, paymentsRes, usersRes] = await Promise.all([
        axios.get("https://citywatch-server.vercel.app/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://citywatch-server.vercel.app/issues?limit=5", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          "https://citywatch-server.vercel.app/admin/payments?limit=5",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get("https://citywatch-server.vercel.app/admin/users?limit=5", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data);
      setLatestIssues(issuesRes.data.issues || issuesRes.data);
      setLatestPayments(paymentsRes.data.payments || paymentsRes.data);
      setLatestUsers(usersRes.data.users || usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3"];

  const issueStatusData = [
    { name: "Pending", value: stats?.pendingIssues || 0 },
    { name: "In Progress", value: stats?.inProgressIssues || 0 },
    { name: "Resolved", value: stats?.resolvedIssues || 0 },
    { name: "Rejected", value: stats?.rejectedIssues || 0 },
  ];

  const categoryData = stats?.categoryStats || [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Issues</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.totalIssues || 0}
              </h3>
            </div>
            <HiClipboardList className="text-4xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Resolved</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.resolvedIssues || 0}
              </h3>
            </div>
            <HiCheckCircle className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.pendingIssues || 0}
              </h3>
            </div>
            <HiClock className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rejected</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.rejectedIssues || 0}
              </h3>
            </div>
            <HiXCircle className="text-4xl text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Payments</p>
              <h3 className="text-3xl font-bold text-gray-800">
                ৳{stats?.totalPayments || 0}
              </h3>
            </div>
            <HiCurrencyDollar className="text-4xl text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.totalUsers || 0}
              </h3>
            </div>
            <HiUsers className="text-4xl text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Issue Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issueStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {issueStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Issues by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Data Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Issues */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Latest Issues</h2>
            <Link
              to="/admin/all-issues"
              className="text-blue-500 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {latestIssues.slice(0, 5).map((issue) => (
              <div
                key={issue._id}
                className="border-b pb-3 last:border-b-0 last:pb-0"
              >
                <Link
                  to={`/issues/${issue._id}`}
                  className="font-semibold text-gray-800 hover:text-[var(--color-primary)] line-clamp-1"
                >
                  {issue.title}
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      issue.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : issue.status === "In-Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {issue.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Payments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Latest Payments</h2>
            <Link
              to="/admin/payments"
              className="text-blue-500 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {latestPayments.slice(0, 5).map((payment) => (
              <div
                key={payment._id}
                className="border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {payment.userName || payment.userEmail}
                    </p>
                    <p className="text-xs text-gray-500">{payment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ৳{payment.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Latest Users</h2>
            <Link
              to="/admin/manage-users"
              className="text-blue-500 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {latestUsers.slice(0, 5).map((user) => (
              <div
                key={user._id}
                className="border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 line-clamp-1">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {user.email}
                    </p>
                  </div>
                  {user.isPremium && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
