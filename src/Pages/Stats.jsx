import React, { useEffect, useState } from "react";
import axios from "axios";

const Stats = () => {
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/issues");
      const allIssues = response.data;
      setStats({
        totalIssues: allIssues.length,
        resolvedIssues: allIssues.filter((i) => i.status === "Resolved").length,
        activeUsers: Math.floor(allIssues.length / 3),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-[var(--color-primary)] hover:scale-105 transition-transform">
          <p className="text-5xl font-bold text-[var(--color-primary)] mb-2">
            {stats.totalIssues}
          </p>
          <p className="text-gray-600 text-lg">Total Issues Reported</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-green-500 hover:scale-105 transition-transform">
          <p className="text-5xl font-bold text-green-600 mb-2">
            {stats.resolvedIssues}
          </p>
          <p className="text-gray-600 text-lg">Issues Resolved</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-blue-500 hover:scale-105 transition-transform">
          <p className="text-5xl font-bold text-blue-600 mb-2">
            {stats.activeUsers}+
          </p>
          <p className="text-gray-600 text-lg">Active Citizens</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
