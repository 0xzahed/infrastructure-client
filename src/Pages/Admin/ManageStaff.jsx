import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiPlus, HiPencil, HiTrash, HiX, HiCheckCircle } from "react-icons/hi";
import Loader from "../../Components/Loader/Loader";
import { toast } from "react-toastify";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    photoURL: "",
    password: "",
  });
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://citywatch-server.vercel.app/admin/staff",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStaffList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "https://citywatch-server.vercel.app/admin/staff",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Staff member added successfully!");
      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error(error.response?.data?.message || "Failed to add staff");
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://citywatch-server.vercel.app/admin/staff/${editingStaff.email}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Staff member updated successfully!");
      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://citywatch-server.vercel.app/admin/staff/${staffId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Staff member deleted successfully!");
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff");
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (staff) => {
    setModalMode("edit");
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      photoURL: staff.photoURL || "",
      password: "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      photoURL: "",
      password: "",
    });
    setEditingStaff(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Staff</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <HiPlus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assigned Issues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.photoURL || "/default-avatar.png"}
                        alt={staff.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {staff.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Since {new Date(staff.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {staff.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {staff.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-800">
                      {staff.assignedIssuesCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                      >
                        <HiPencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                      >
                        <HiTrash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {modalMode === "add" ? "Add Staff Member" : "Edit Staff Member"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={
                modalMode === "add" ? handleAddStaff : handleUpdateStaff
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={modalMode === "edit"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                {modalMode === "add" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <HiCheckCircle className="w-5 h-5" />
                  {modalMode === "add" ? "Add Staff" : "Update Staff"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
