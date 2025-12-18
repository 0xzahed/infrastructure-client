import React from "react";
import { Link, useNavigate } from "react-router";
import {
  HiHome,
  HiArrowLeft,
  HiSearch,
  HiClipboardList,
  HiQuestionMarkCircle,
  HiDocumentText,
} from "react-icons/hi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1
            className="text-[180px] font-bold leading-none"
            style={{ color: "var(--color-primary)" }}
          >
            404
          </h1>
          <HiSearch className="text-6xl mx-auto mb-4 text-gray-400" />
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            <HiArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <Link
            to="/"
            style={{ backgroundColor: "var(--color-primary)" }}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg hover:bg-black transition-colors font-semibold shadow-lg"
          >
            <HiHome className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <Link
            to="/all-issues"
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <HiClipboardList className="text-2xl mx-auto mb-2 text-gray-600" />
            <p className="text-gray-700 font-medium">View All Issues</p>
          </Link>

          <Link
            to="/how-it-works"
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <HiQuestionMarkCircle className="text-2xl mx-auto mb-2 text-gray-600" />
            <p className="text-gray-700 font-medium">How It Works</p>
          </Link>

          <Link
            to="/report-issue"
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <HiDocumentText className="text-2xl mx-auto mb-2 text-gray-600" />
            <p className="text-gray-700 font-medium">Report Issue</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
