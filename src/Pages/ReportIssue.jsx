import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import { issueAPI } from "../Services/api";
import {
  HiCamera,
  HiLocationMarker,
  HiDocumentText,
  HiTag,
} from "react-icons/hi";
import Loader from "../Components/Loader/Loader";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image: "",
  });

  const categories = [
    "Road",
    "Electricity",
    "Water",
    "Waste",
    "Drainage",
    "Street Light",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to report an issue");
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.location
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Submitting issue:", formData);
      const response = await issueAPI.createIssue(formData);
      console.log("Issue created:", response);

      alert("Issue reported successfully!");
      navigate("/my-issues");
    } catch (error) {
      console.error("Error creating issue:", error);
      console.error("Error response:", error.response);

      const errorMessage = error.response?.data?.message;
      const errorStatus = error.response?.status;

      if (errorMessage === "blocked") {
        setError("Your account is blocked. Please contact authorities.");
      } else if (errorMessage === "limit exceeded") {
        setError(
          "You have reached your monthly limit (3 issues). Please upgrade to premium for unlimited reporting."
        );
      } else if (errorStatus === 401 || errorMessage === "unauthorized") {
        setError("Please login again. Your session may have expired.");
      } else if (errorMessage === "forbidden") {
        setError("You do not have permission to report issues.");
      } else {
        setError(
          `Failed to report issue: ${
            errorMessage || error.message || "Please try again."
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mt-20 max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to report an issue
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
    <div className="mt-20 bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Report an{" "}
            <span style={{ color: "var(--color-primary)" }}>Issue</span>
          </h1>
          <p className="text-gray-600">
            Help improve your city by reporting infrastructure issues
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Free users can report up to 3 issues per
                month.
                <span className="font-semibold"> Upgrade to premium</span> for
                unlimited reporting.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <HiDocumentText className="w-5 h-5 text-[var(--color-primary)]" />
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Large pothole on Main Street"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <HiTag className="w-5 h-5 text-[var(--color-primary)]" />
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <HiLocationMarker className="w-5 h-5 text-[var(--color-primary)]" />
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Mirpur 1, Dhaka"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <HiDocumentText className="w-5 h-5 text-[var(--color-primary)]" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <HiCamera className="w-5 h-5 text-[var(--color-primary)]" />
                Photo URL (Optional)
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Provide an image URL to help illustrate the issue
              </p>
            </div>
            {formData.image && (
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Image Preview:
                </p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              style={{ backgroundColor: "var(--color-primary)" }}
              className="flex-1 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold text-lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Report Issue"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
