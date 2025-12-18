import React, { useState } from "react";
import { Link } from "react-router";
import { HiMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset email sent to:", email);
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors mb-6"
      >
        <HiArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Login</span>
      </Link>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Forgot{" "}
          <span style={{ color: "var(--color-primary)" }}>Password?</span>
        </h2>
        <p className="text-gray-600">
          {submitted
            ? "Check your email for reset instructions"
            : "Enter your email to receive password reset instructions"}
        </p>
      </div>

      {submitted ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg text-center">
            <HiCheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-semibold mb-1">Email Sent!</p>
            <p className="text-sm">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Didn't receive the email?</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[var(--color-primary)] hover:text-black font-medium mt-1"
            >
              Try again
            </button>
          </div>

          <Link
            to="/login"
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full block text-center py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold uppercase"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold uppercase"
          >
            Send Reset Link
          </button>

          {/* Info Text */}
          <div className="text-center text-sm text-gray-600">
            <p>Remember your password?</p>
            <Link
              to="/login"
              className="text-[var(--color-primary)] hover:text-black font-medium"
            >
              Sign in here
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
