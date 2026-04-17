import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  //  console.log("orders", orders);

  // NEW: Delivery status options
  const deliveryStatuses = [
    "Pending",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // NEW: Delivery methods
  const deliveryMethods = ["Standard", "Express", "Same-day"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/orders/all",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (data.success) setOrders(data.orders);
      } catch (error) {
        console.error("❌ Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken]);

  // NEW: Update delivery status
  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/orders/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      // update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, deliveryStatus: newStatus } : o,
        ),
      );
    } catch (error) {
      console.error("❌ Failed to update status:", error);
    }
  };

  // NEW: Update delivery method
  const updateDeliveryMethod = async (orderId, method) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/orders/update-delivery/${orderId}`,
        { deliveryMethod: method },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, deliveryMethod: method } : o,
        ),
      );
    } catch (error) {
      console.error("❌ Failed to update delivery method:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading all orders...
      </div>
    );
  }
  return (
    <div className="pl-71 py-19 pr-20 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-3">Update - Delivery status</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Payment</th>
                <th className="px-4 py-2 border">Delivery Method</th>
                <th className="px-4 py-2 border">Delivery Status</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">
                    {order.user?.name}
                    <span className="text-gray-900">{order.user?.email}</span>
                  </td>
                  <td className="px-4 py-2 border">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="text-sm">
                        {p.productName}
                        <b>PID:</b>
                        {p._id}
                        <b> Quantity:</b> {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border font-semibold">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Delivery Method Dropdown */}
                  <td className="px-4 py-2 border">
                    <select
                      value={order.deliveryMethod || "Standard"}
                      onChange={(e) =>
                        updateDeliveryMethod(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {deliveryMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Delivery Status Dropdown */}
                  <td className="px-4 py-2 border">
                    <select
                      value={order.deliveryStatus || "Pending"}
                      onChange={(e) =>
                        updateDeliveryStatus(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {deliveryStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
