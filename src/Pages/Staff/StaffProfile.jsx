import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { HiUser, HiMail, HiPhone, HiCamera } from "react-icons/hi";
import Loader from "../../Components/Loader/Loader";

const StaffProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    photoURL: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        phoneNumber: user.phoneNumber || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      await axios.patch(
        "https://citywatch-server.vercel.app/staff/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-20 bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Staff <span style={{ color: "var(--color-primary)" }}>Profile</span>
          </h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="relative inline-block mb-4">
                {formData.photoURL ? (
                  <img
                    src={formData.photoURL}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[var(--color-primary)]"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: "var(--color-primary)" }}
                    className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-[var(--color-primary)]"
                  >
                    {user.displayName?.charAt(0).toUpperCase() || "S"}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.displayName || "Staff Member"}
              </h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <span
                style={{ backgroundColor: "var(--color-primary)" }}
                className="inline-block px-4 py-1 text-white rounded-full text-sm font-semibold"
              >
                Staff
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <HiUser className="w-5 h-5" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <HiMail className="w-5 h-5" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <HiPhone className="w-5 h-5" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <HiCamera className="w-5 h-5" />
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) =>
                      setFormData({ ...formData, photoURL: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter photo URL"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: "var(--color-primary)" }}
                    className="flex-1 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
