import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";
import {
  HiCamera,
  HiLocationMarker,
  HiDocumentText,
  HiTag,
  HiInformationCircle,
  HiXCircle,
} from "react-icons/hi";
import Loader from "../Components/Loader/Loader";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `https://citywatch-server.vercel.app/users/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formDataImg = new FormData();
    formDataImg.append("image", file);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formDataImg
    );
    return response.data.data.url;
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image: "" });
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

      let imageUrl = formData.image;
      if (imageFile) {
        setImageUploading(true);
        imageUrl = await uploadImageToImgBB(imageFile);
        setImageUploading(false);
      }

      const issueData = {
        ...formData,
        image: imageUrl,
        userEmail: user.email,
        userName: user.displayName || user.email,
      };
      console.log("Submitting issue:", issueData);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://citywatch-server.vercel.app/issues",
        issueData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Issue created:", response);

      toast.success("Issue reported successfully!");
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
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
              <HiInformationCircle className="h-5 w-5 text-blue-500" />
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

        {/* Limit Reached Warning */}
        {userStats &&
          !userStats.isPremium &&
          userStats.issueReportedThisMonth >= 3 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">
                    Limit Reached
                  </h3>
                  <p className="text-sm text-yellow-700 mb-4">
                    You have reported {userStats.issueReportedThisMonth} issues
                    this month. Upgrade to Premium for unlimited reporting!
                  </p>
                  <button
                    onClick={() => navigate("/profile")}
                    style={{ backgroundColor: "var(--color-primary)" }}
                    className="px-6 py-2 text-white rounded-lg hover:bg-black transition-colors font-semibold"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiXCircle className="h-5 w-5 text-red-500" />
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
          <fieldset
            disabled={
              userStats &&
              !userStats.isPremium &&
              userStats.issueReportedThisMonth >= 3
            }
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
                  Photo (Optional)
                </label>

                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[var(--color-primary)] hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiCamera className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold text-[var(--color-primary)]">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <HiXCircle className="w-5 h-5" />
                    </button>
                    <p className="text-xs text-gray-500 p-2 bg-gray-50">{imageFile?.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                style={{ backgroundColor: "var(--color-primary)" }}
                className="flex-1 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold text-lg"
                disabled={loading || imageUploading}
              >
                {imageUploading ? "Uploading image..." : loading ? "Submitting..." : "Report Issue"}
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
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
