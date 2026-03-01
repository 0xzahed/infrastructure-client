import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { auth } from "../Firebase/Firebase.config";
import toast from "react-hot-toast";
import {
  HiMail,
  HiUser,
  HiCalendar,
  HiPencil,
  HiX,
  HiCheck,
  HiPhone,
  HiCreditCard,
} from "react-icons/hi";
import { updateProfile } from "firebase/auth";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Loader from "../Components/Loader/Loader";
import PremiumCheckoutForm from "../Components/PremiumCheckoutForm/PremiumCheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
  });
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    photoURL: "",
    isPremium: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleOpenPaymentModal = async () => {
    try {
      setShowPaymentModal(true);

      // Create payment intent
      const token = localStorage.getItem("authToken");
      console.log("Creating payment intent...");
      const response = await axios.post(
        "https://citywatch-server.vercel.app/create-payment-intent/premium",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Payment intent created:", response.data);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Payment intent error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to initialize payment. Check console for details."
      );
      setShowPaymentModal(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Successfully upgraded to Premium!");
    setShowPaymentModal(false);
    window.location.reload();
  };

  const fetchUserData = async () => {
    try {
      // Get fresh token from Firebase auth
      const token = await auth.currentUser?.getIdToken();
      console.log("Fetching user data for:", user.email);
      console.log("Token exists:", !!token);

      const response = await axios.get(
        `https://citywatch-server.vercel.app/users/${user.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData({
        displayName: response.data.displayName || user.displayName || "",
        phoneNumber: response.data.phoneNumber || "",
        photoURL: response.data.photoURL || user.photoURL || "",
        isPremium: response.data.isPremium || false,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      console.error("Error response:", error.response?.data);
      // Fallback to Firebase user data
      setFormData({
        displayName: user.displayName || "",
        phoneNumber: user.phoneNumber || "",
        photoURL: user.photoURL || "",
        isPremium: false,
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://citywatch-server.vercel.app/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats({
        totalIssues: response.data.totalIssues || 0,
        resolvedIssues: response.data.resolvedIssues || 0,
        pendingIssues: response.data.pendingIssues || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchUserData(); // Reload original data
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL || user.photoURL,
      });

      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://citywatch-server.vercel.app/users/${user.email}`,
        {
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber,
          photoURL: formData.photoURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-16 bg-[#FAF6F3] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div
            style={{ backgroundColor: "var(--color-primary)" }}
            className="h-32 relative"
          >
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                {formData.photoURL || user?.photoURL ? (
                  <img
                    src={formData.photoURL || user.photoURL}
                    alt={formData.displayName || user?.displayName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiUser className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-md"
              >
                <HiPencil className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="pt-20 pb-8 px-8">
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                <HiCheck className="w-5 h-5" />
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                <HiX className="w-5 h-5" />
                {error}
              </div>
            )}

            {isEditing ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Edit Profile
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Photo URL
                    </label>
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      placeholder="Enter photo URL"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      style={{ backgroundColor: "var(--color-primary)" }}
                      className="flex-1 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <HiCheck className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <HiX className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  {user?.displayName || "Anonymous User"}
                  {user?.isPremium && (
                    <span className="text-base px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold flex items-center gap-1">
                      ⭐ Premium
                    </span>
                  )}
                </h1>
                <p className="text-gray-600">Citizen Account</p>

                {/* Blocked User Warning */}
                {user?.isBlocked && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-start">
                      <HiX className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-bold text-red-800">
                          Account Blocked
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          Your account has been blocked by the administrator.
                          You cannot submit, edit, upvote, or boost issues.
                          Please contact the authorities for more information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <HiMail
                    className="w-6 h-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <h3 className="font-semibold text-gray-900">Email Address</h3>
                </div>
                <p className="text-gray-700 ml-9">{user?.email || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <HiPhone
                    className="w-6 h-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <h3 className="font-semibold text-gray-900">Phone Number</h3>
                </div>
                <p className="text-gray-700 ml-9">
                  {formData.phoneNumber || "Not provided"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <HiCalendar
                    className="w-6 h-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <h3 className="font-semibold text-gray-900">Member Since</h3>
                </div>
                <p className="text-gray-700 ml-9">
                  {formatDate(user?.metadata?.creationTime)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <HiUser
                    className="w-6 h-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <h3 className="font-semibold text-gray-900">
                    Account Status
                  </h3>
                </div>
                <p className="text-gray-700 ml-9">
                  {user?.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="text-yellow-600">Not Verified</span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {stats.totalIssues}
                </p>
                <p className="text-gray-700 mt-1">Issues Reported</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {stats.resolvedIssues}
                </p>
                <p className="text-gray-700 mt-1">Issues Resolved</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.pendingIssues}
                </p>
                <p className="text-gray-700 mt-1">Pending Issues</p>
              </div>
            </div>

            {/* Premium Subscription Section */}
            <div className="mt-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <HiCreditCard className="w-7 h-7 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.isPremium ? "Premium Member" : "Free Plan"}
                    </h3>
                  </div>
                  <p className="text-gray-700 ml-10">
                    {formData.isPremium
                      ? "You have unlimited issue reporting access"
                      : "Upgrade to premium for unlimited issue reporting (Only 1000 BDT)"}
                  </p>
                </div>
                {!formData.isPremium && (
                  <button
                    onClick={handleOpenPaymentModal}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <HiCreditCard className="w-5 h-5" />
                    Upgrade Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowPaymentModal(false);
              setClientSecret("");
            }}
          ></div>
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Upgrade to Premium
              </h2>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setClientSecret("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-semibold">
                  Premium Plan
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  ৳1000
                </span>
              </div>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unlimited issue reporting
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No ads
                </li>
              </ul>
            </div>

            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PremiumCheckoutForm onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 mt-4">Initializing payment...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
