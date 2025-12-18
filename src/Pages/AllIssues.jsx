import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  HiLocationMarker,
  HiArrowUp,
  HiFilter,
  HiFire,
  HiSearch,
} from "react-icons/hi";
import Loader from "../Components/Loader/Loader";

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    priority: "",
    search: "",
  });

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:3000/issues", {
        params: filters,
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (issueId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:3000/issues/${issueId}/upvote`,
        {},
        { headers: { authorization: `Bearer ${token}` } }
      );
      fetchIssues();
    } catch (error) {
      console.error("Error upvoting issue:", error);
      alert(
        error.response?.data?.message || "Failed to upvote. Please login first."
      );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          All <span style={{ color: "var(--color-primary)" }}>Issues</span>
        </h1>
        <p className="text-gray-600">
          Browse and track infrastructure issues reported by citizens
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HiFilter className="text-gray-600" />
          <h2 className="text-lg font-semibold">Filter Issues</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by title or location..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            <option value="Road">Road</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Waste">Waste</option>
            <option value="Drainage">Drainage</option>
            <option value="Street Light">Street Light</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">All Priority</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">{issues.length}</span>{" "}
          issue{issues.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Issues Grid */}
      {issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <Link
              key={issue._id}
              to={`/issues/${issue._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
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
                  <button
                    onClick={(e) => handleUpvote(issue._id, e)}
                    className="flex items-center gap-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <HiArrowUp className="w-5 h-5" />
                    <span className="font-semibold">{issue.upvotes || 0}</span>
                  </button>

                  <span className="text-sm text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <HiSearch className="text-6xl mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No Issues Found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() =>
              setFilters({ category: "", status: "", priority: "", search: "" })
            }
            style={{ backgroundColor: "var(--color-primary)" }}
            className="px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllIssues;
