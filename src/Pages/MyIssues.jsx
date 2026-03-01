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
  HiDocumentText,
  HiPencil,
  HiTrash,
  HiX,
} from "react-icons/hi";
import { HiFire } from "react-icons/hi";
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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, filter, categoryFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const queryParams = new URLSearchParams();
      if (filter) queryParams.append("status", filter);
      if (categoryFilter) queryParams.append("category", categoryFilter);

      const [issuesRes, statsRes] = await Promise.all([
        axios.get(
          `https://citywatch-server.vercel.app/issues/my-issues?${queryParams}`,
          {
            headers,
          }
        ),
        axios.get("https://citywatch-server.vercel.app/dashboard/stats", {
          headers,
        }),
      ]);

      setIssues(issuesRes.data.issues || issuesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (issue, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingIssue(issue);
    setEditFormData({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      location: issue.location,
      image: issue.image,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://citywatch-server.vercel.app/issues/${editingIssue._id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Issue updated successfully!");
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update issue");
    }
  };

  const handleDelete = async (issueId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://citywatch-server.vercel.app/issues/${issueId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Issue deleted successfully!");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete issue");
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
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Road">Road</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Waste">Waste</option>
                <option value="Drainage">Drainage</option>
                <option value="Street Light">Street Light</option>
              </select>
            </div>
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
              <div
                key={issue._id}
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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/issues/${issue._id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                    {issue.status === "Pending" && (
                      <>
                        <button
                          onClick={(e) => handleEdit(issue, e)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          title="Edit Issue"
                        >
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(issue._id, e)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete Issue"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
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

        {/* Edit Issue Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            ></div>
            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Issue</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    <option value="Road">Road & Infrastructure</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water Supply</option>
                    <option value="Waste">Waste Management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editFormData.image}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        image: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    style={{ backgroundColor: "var(--color-primary)" }}
                    className="flex-1 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold"
                  >
                    Update Issue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
