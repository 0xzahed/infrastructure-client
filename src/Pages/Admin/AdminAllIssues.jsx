import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiSearch,
  HiFilter,
  HiUserAdd,
  HiX,
  HiCheckCircle,
} from "react-icons/hi";
import Loader from "../../Components/Loader/Loader";
import { toast } from "react-toastify";

const AdminAllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    fetchIssues();
    fetchStaff();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.priority) queryParams.append("priority", filters.priority);
      if (filters.category) queryParams.append("category", filters.category);

      const response = await axios.get(
        `https://citywatch-server.vercel.app/issues?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIssues(response.data.issues || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://citywatch-server.vercel.app/admin/staff",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://citywatch-server.vercel.app/admin/issues/${selectedIssue._id}/assign`,
        { assignedTo: selectedStaff },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Staff assigned successfully!");
      setShowAssignModal(false);
      setSelectedIssue(null);
      setSelectedStaff("");
      fetchIssues();
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast.error("Failed to assign staff");
    }
  };

  const handleRejectIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to reject this issue?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://citywatch-server.vercel.app/admin/issues/${issueId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Issue rejected successfully!");
      fetchIssues();
    } catch (error) {
      console.error("Error rejecting issue:", error);
      toast.error("Failed to reject issue");
    }
  };

  const getPriorityBadge = (priority, isBoosted) => {
    if (priority === "High" || isBoosted) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
          High
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
        Normal
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      "In-Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
      Closed: "bg-gray-100 text-gray-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) return <Loader />;

  // Sort issues: boosted issues first
  const sortedIssues = [...issues].sort((a, b) => {
    if (a.isBoosted && !b.isBoosted) return -1;
    if (!a.isBoosted && b.isBoosted) return 1;
    return 0;
  });

  return (
    <div className="mt-20 bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">All Issues</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">All Priority</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">All Categories</option>
            <option value="Road">Road</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Garbage">Garbage</option>
            <option value="Drainage">Drainage</option>
            <option value="Street Light">Street Light</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assigned Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedIssues.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {issue.title}
                      </p>
                      {issue.isBoosted && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
                          Boosted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {issue.category}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(issue.status)}</td>
                  <td className="px-6 py-4">
                    {getPriorityBadge(issue.priority, issue.isBoosted)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {issue.assignedStaff?.name || (
                      <span className="text-gray-400 italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!issue.assignedStaff && (
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowAssignModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          <HiUserAdd className="w-4 h-4" />
                          Assign
                        </button>
                      )}
                      {issue.status === "Pending" && (
                        <button
                          onClick={() => handleRejectIssue(issue._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          <HiX className="w-4 h-4" />
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Staff Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowAssignModal(false);
              setSelectedIssue(null);
              setSelectedStaff("");
            }}
          ></div>
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-2xl font-bold mb-4">Assign Staff</h2>
            <p className="text-gray-600 mb-4">
              Issue:{" "}
              <span className="font-semibold">{selectedIssue?.title}</span>
            </p>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] mb-4"
            >
              <option value="">Select Staff Member</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff.email}>
                  {staff.name} - {staff.email}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleAssignStaff}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <HiCheckCircle className="w-5 h-5" />
                Assign
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedIssue(null);
                  setSelectedStaff("");
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminAllIssues;
