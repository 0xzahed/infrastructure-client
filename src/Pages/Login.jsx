import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, googleSignIn } = useAuth();
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
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later");
      } else {
        setError("Failed to sign in. Please try again");
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
          Welcome <span style={{ color: "var(--color-primary)" }}>Back</span>
        </h2>
        <p className="text-gray-600">Sign in to report and track issues</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
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
              placeholder="Enter your password"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-[var(--color-primary)] hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="w-full py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
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
          <span>Sign in with Google</span>
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Don't have an account?
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link
          to="/register"
          className="font-semibold text-[var(--color-primary)] hover:text-black transition-colors"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
