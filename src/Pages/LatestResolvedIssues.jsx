import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { HiLocationMarker, HiArrowUp, HiCheckCircle } from "react-icons/hi";
import Loader from "../Components/Loader/Loader";

const LatestResolvedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestResolvedIssues();
  }, []);

  const fetchLatestResolvedIssues = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/issues/latest-resolved"
      );
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Latest{" "}
          <span style={{ color: "var(--color-primary)" }}>Resolved Issues</span>
        </h2>
        <p className="text-gray-600 text-lg">
          See how we're making our city better
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.slice(0, 6).map((issue) => (
          <Link
            key={issue._id}
            to={`/issues/${issue._id}`}
            className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
          >
            {issue.image && (
              <div className="relative overflow-hidden h-48">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <HiCheckCircle /> Resolved
                  </span>
                </div>
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                {issue.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {issue.description}
              </p>

              <div className="flex items-center text-gray-600 text-sm mb-4">
                <HiLocationMarker className="mr-1 text-[var(--color-primary)]" />
                <span className="truncate">{issue.location}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <HiArrowUp className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="font-semibold">{issue.upvotes || 0}</span>
                </div>
                <button className="text-[var(--color-primary)] font-semibold hover:underline">
                  View Details →
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/all-issues"
          style={{ backgroundColor: "var(--color-primary)" }}
          className="inline-block px-8 py-4 text-white rounded-lg hover:bg-black transition-colors font-semibold text-lg shadow-lg"
        >
          View All Issues
        </Link>
      </div>
    </div>
  );
};

export default LatestResolvedIssues;
