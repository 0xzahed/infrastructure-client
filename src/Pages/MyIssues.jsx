import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../Context/AuthContext";
import {
  HiLocationMarker,
  HiCalendar,
  HiArrowUp,
  HiPlus,
  HiFilter,
} from "react-icons/hi";
import Loader from "../Components/Loader/Loader";

const MyIssues = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("status", filter);

      const [issuesRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:3000/issues/my-issues?${queryParams}`, {
          headers,
        }),
        axios.get("http://localhost:3000/dashboard/stats", { headers }),
      ]);

      setIssues(issuesRes.data.issues || issuesRes.data);
      setStats(statsRes.data);
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
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Road":
        return "bg-blue-100 text-blue-800";
      case "Electricity":
        return "bg-purple-100 text-purple-800";
      case "Water":
        return "bg-cyan-100 text-cyan-800";
      case "Waste":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="mt-20 max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to view your issues
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-20 bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              My <span style={{ color: "var(--color-primary)" }}>Issues</span>
            </h1>
            <p className="text-gray-600">
              Track and manage your reported issues
            </p>
          </div>
          <Link
            to="/report-issue"
            style={{ backgroundColor: "var(--color-primary)" }}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold shadow-lg"
          >
            <HiPlus className="w-5 h-5" />
            Report New Issue
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border-t-4 border-[var(--color-primary)] p-6">
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalIssues}
            </p>
            <p className="text-gray-600 mt-1">Total Issues</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-t-4 border-gray-400 p-6">
            <p className="text-3xl font-bold text-gray-600">
              {stats.pendingIssues}
            </p>
            <p className="text-gray-600 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-t-4 border-yellow-500 p-6">
            <p className="text-3xl font-bold text-yellow-600">
              {stats.inProgressIssues}
            </p>
            <p className="text-gray-600 mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-t-4 border-green-500 p-6">
            <p className="text-3xl font-bold text-green-600">
              {stats.resolvedIssues}
            </p>
            <p className="text-gray-600 mt-1">Resolved</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HiFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold">Filter by Status</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === ""
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "Pending"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("In-Progress")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "In-Progress"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("Resolved")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "Resolved"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">{issues.length}</span>{" "}
            issue{issues.length !== 1 ? "s" : ""}
          </p>
        </div>
        {issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className="bg-white rounded-lg shadow-sm border-t-4 border-[var(--color-primary)] hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {issue.image && (
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                        issue.category
                      )}`}
                    >
                      {issue.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  {issue.priority === "High" && issue.isBoosted && (
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                        <HiFire className="w-4 h-4" /> High Priority
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-gray-900">
                    {issue.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <HiLocationMarker className="mr-1 flex-shrink-0" />
                    <span className="truncate">{issue.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                      <HiArrowUp className="w-5 h-5" />
                      <span className="font-semibold">
                        {issue.upvotes || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <HiCalendar className="w-4 h-4" />
                      <span>
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <HiDocumentText className="text-6xl mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Issues Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter
                ? `You don't have any ${filter.toLowerCase()} issues`
                : "You haven't reported any issues yet"}
            </p>
            <Link
              to="/report-issue"
              style={{ backgroundColor: "var(--color-primary)" }}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold"
            >
              <HiPlus className="w-5 h-5" />
              Report Your First Issue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
