import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiFilter,
  HiDownload,
  HiCurrencyDollar,
  HiCalendar,
} from "react-icons/hi";
import Loader from "../../Components/Loader/Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);

      const response = await axios.get(
        `https://citywatch-server.vercel.app/admin/payments?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayments(response.data.payments || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setLoading(false);
    }
  };

  const downloadInvoice = (payment) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("CityWatch", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Payment Invoice", 105, 25, { align: "center" });

    // Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Invoice #: ${payment.transactionId}`, 20, 40);
    doc.text(
      `Date: ${new Date(payment.createdAt).toLocaleDateString()}`,
      20,
      47
    );

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text("Customer Information:", 20, 60);
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Name: ${payment.userName || "N/A"}`, 20, 68);
    doc.text(`Email: ${payment.userEmail}`, 20, 75);

    // Payment Details Table
    doc.autoTable({
      startY: 90,
      head: [["Description", "Amount"]],
      body: [
        [
          payment.type === "subscription"
            ? "Premium Subscription"
            : "Issue Boost",
          `৳${payment.amount}`,
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: [255, 107, 0] },
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Total Amount: ৳${payment.amount}`, 20, finalY);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Thank you for your payment!",
      105,
      doc.internal.pageSize.height - 20,
      { align: "center" }
    );
    doc.text(
      "For any queries, contact us at support@citywatch.com",
      105,
      doc.internal.pageSize.height - 15,
      { align: "center" }
    );

    // Save PDF
    doc.save(`invoice-${payment.transactionId}.pdf`);
  };

  if (loading) return <Loader />;

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <div className="mt-20 bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Payments</h1>
        <div className="bg-white px-6 py-3 rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">৳{totalRevenue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">All Types</option>
            <option value="subscription">Subscription</option>
            <option value="boost">Boost</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {payment.userName || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.type === "subscription"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {payment.type === "subscription"
                        ? "Subscription"
                        : "Boost"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">
                      ৳{payment.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <HiCalendar className="w-4 h-4 text-gray-400" />
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => downloadInvoice(payment)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      <HiDownload className="w-4 h-4" />
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md mt-6">
          <HiCurrencyDollar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No payments found</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminPayments;
