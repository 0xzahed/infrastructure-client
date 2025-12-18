import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../Context/AuthContext";
import {
  HiLocationMarker,
  HiCalendar,
  HiArrowUp,
  HiPencil,
  HiTrash,
  HiArrowLeft,
} from "react-icons/hi";
import Loader from "../Components/Loader/Loader";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIssueDetails();
  }, [id]);

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`http://localhost:3000/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssue(response.data);
    } catch (error) {
      console.error("Error fetching issue:", error);
      setError("Failed to load issue details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:3000/issues/${id}/upvote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchIssueDetails();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to upvote. Please login first."
      );
    }
  };

  const handleBoost = async () => {
    if (
      !window.confirm(
        "Boost this issue to high priority? This will require payment."
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:3000/issues/${id}/boost`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Issue boosted to high priority!");
      fetchIssueDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to boost issue");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:3000/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Issue deleted successfully");
      navigate("/all-issues");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="mt-20 max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Issue Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          {error || "The issue you are looking for does not exist."}
        </p>
        <Link
          to="/all-issues"
          style={{ backgroundColor: "var(--color-primary)" }}
          className="inline-block px-6 py-3 text-white rounded-lg hover:bg-black transition-colors"
        >
          Back to All Issues
        </Link>
      </div>
    );
  }

  const isOwner = user?.email === issue.citizenEmail;

  return (
    <div className="mt-20 bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-primary)] mb-6 transition-colors"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {issue.image && (
            <div className="w-full h-96 bg-gray-200">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      issue.category
                    )}`}
                  >
                    {issue.category}
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status}
                  </span>
                  {issue.priority === "High" && issue.isBoosted && (
                    <span className="px-4 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                      <HiFire className="w-4 h-4" /> High Priority
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {issue.title}
                </h1>
              </div>
              {isOwner && issue.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-issue/${issue._id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <HiPencil />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <HiTrash />
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
              <div className="flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="font-medium">{issue.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCalendar className="w-5 h-5 text-[var(--color-primary)]" />
                <span>
                  Reported on{" "}
                  {new Date(issue.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {issue.description}
              </p>
            </div>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reported By
              </h3>
              <p className="text-gray-700">
                {issue.citizenName || "Anonymous Citizen"}
              </p>
            </div>
            {issue.timeline && issue.timeline.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Timeline
                </h2>
                <div className="space-y-4">
                  {issue.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          style={{ backgroundColor: "var(--color-primary)" }}
                          className="w-3 h-3 rounded-full"
                        ></div>
                        {index !== issue.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {event.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{event.message}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Updated by: {event.updatedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              {/* Upvote Button */}
              {!isOwner && (
                <button
                  onClick={handleUpvote}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  disabled={issue.upvotedBy?.includes(user?.email)}
                >
                  <HiArrowUp className="w-5 h-5" />
                  <span>
                    {issue.upvotedBy?.includes(user?.email)
                      ? "Upvoted"
                      : "Upvote"}
                  </span>
                  <span className="ml-1">({issue.upvotes || 0})</span>
                </button>
              )}
              {isOwner && !issue.isBoosted && issue.status === "Pending" && (
                <button
                  onClick={handleBoost}
                  style={{ backgroundColor: "var(--color-primary)" }}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold"
                >
                  <HiFlag className="w-5 h-5" /> Boost to High Priority
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
