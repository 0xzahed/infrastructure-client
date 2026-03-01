import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import { HiFilter, HiFire, HiLocationMarker, HiCalendar } from "react-icons/hi";
import Loader from "../../Components/Loader/Loader";
import toast from "react-hot-toast";

const StaffAssignedIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [changingStatus, setChangingStatus] = useState({});

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        "https://citywatch-server.vercel.app/staff/issues",
        {
          params: filters,
          headers,
        }
      );

      // Sort: boosted issues first
      const sortedIssues = (response.data || []).sort((a, b) => {
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;
        return 0;
      });

      setIssues(sortedIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (issueId, currentStatus, newStatus) => {
    if (!newStatus) return;

    try {
      setChangingStatus({ ...changingStatus, [issueId]: true });
      const token = localStorage.getItem("authToken");

      await axios.patch(
        `https://citywatch-server.vercel.app/staff/issues/${issueId}/status`,
        { status: newStatus, note: `Status changed to ${newStatus}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated successfully!");
      fetchIssues();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setChangingStatus({ ...changingStatus, [issueId]: false });
    }
  };

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      Pending: ["In-Progress"],
      "In-Progress": ["Working"],
      Working: ["Resolved"],
      Resolved: ["Closed"],
    };
    return transitions[currentStatus] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-400 text-white";
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

  return (
    <div className="mt-20 bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Assigned{" "}
            <span style={{ color: "var(--color-primary)" }}>Issues</span>
          </h1>
          <p className="text-gray-600">
            Manage and update your assigned issues
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HiFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold">Filter Issues</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Working">Working</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="">All Priority</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">{issues.length}</span>{" "}
            assigned issue{issues.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Issues Table */}
        {issues.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Issue Details
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Priority
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Change Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr
                      key={issue._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-900 line-clamp-1 mb-1">
                            {issue.title}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <HiLocationMarker className="w-4 h-4 mr-1" />
                            <span className="line-clamp-1">
                              {issue.location}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <HiCalendar className="w-4 h-4 mr-1" />
                            <span>
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {issue.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {issue.priority === "High" && issue.isBoosted ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                            <HiFire className="w-4 h-4" /> High
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {issue.priority}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {issue.status !== "Closed" &&
                        getNextStatuses(issue.status).length > 0 ? (
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            onChange={(e) =>
                              handleStatusChange(
                                issue._id,
                                issue.status,
                                e.target.value
                              )
                            }
                            disabled={changingStatus[issue._id]}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Change Status
                            </option>
                            {getNextStatuses(issue.status).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {issue.status === "Closed"
                              ? "Completed"
                              : "No actions"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="text-blue-600 hover:underline font-medium text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Issues Assigned
            </h3>
            <p className="text-gray-600">
              {filters.status || filters.priority || filters.category
                ? "No issues match your current filters"
                : "You don't have any assigned issues yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAssignedIssues;
