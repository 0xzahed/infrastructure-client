import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { HiMail, HiLockClosed, HiUser, HiPhone } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../Context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone
      );
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError("Failed to create account. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed");
      } else if (error.code === "auth/cancelled-popup-request") {
        setError("Sign-in was cancelled");
      } else {
        setError("Failed to sign in with Google. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Create <span style={{ color: "var(--color-primary)" }}>Account</span>
        </h2>
        <p className="text-gray-600">Join us to make your community better</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 mt-1 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <Link
              to="/terms"
              className="font-medium text-[var(--color-primary)] hover:text-black"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-[var(--color-primary)] hover:text-black"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="w-full py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="text-2xl" />
          <span>Sign up with Google</span>
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="font-semibold text-[var(--color-primary)] hover:text-black transition-colors"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
};

export default Register;
