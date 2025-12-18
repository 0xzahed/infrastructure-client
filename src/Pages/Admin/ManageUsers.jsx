import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiSearch, HiLockClosed, HiLockOpen, HiStar } from "react-icons/hi";
import Loader from "../../Components/Loader/Loader";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://citywatch-server.vercel.app/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.users || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (userId, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://citywatch-server.vercel.app/admin/users/${userId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`User ${action}ed successfully!`);
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  if (loading) return <Loader />;

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Issues Reported
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                          {user.displayName}
                          {user.isPremium && (
                            <HiStar className="w-4 h-4 text-yellow-500" />
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    {user.isPremium ? (
                      <div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          Premium
                        </span>
                        {user.subscriptionDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Since{" "}
                            {new Date(
                              user.subscriptionDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-800">
                      {user.issuesCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleBlockUnblock(user._id, user.isBlocked)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
                        user.isBlocked
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? (
                        <>
                          <HiLockOpen className="w-4 h-4" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <HiLockClosed className="w-4 h-4" />
                          Block
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
