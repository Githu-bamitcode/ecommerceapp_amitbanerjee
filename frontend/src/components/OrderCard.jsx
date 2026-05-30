import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();
  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // SORT ORDERS: NEWEST FIRST
  const sortedOrders = [...(userOrder || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <div className="w-full flex flex-col gap-4 px-0 sm:px-6">
      <div className="w-full p-0 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">My Orders</h1>
        </div>
        {sortedOrders?.length === 0 ? (
          <p className="text-gray-700 text-lg sm:text-2xl text-center">
            No Orders found for this user
          </p>
        ) : (
          <div className="space-y-6 w-full">
            {sortedOrders?.map((order) => (
              <div
                key={order._id}
                className="shadow-lg rounded-2xl p-4 sm:p-5 border border-gray-200 bg-white"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <h2 className="text-sm sm:text-lg font-semibold wrap-break-word">
                    Order ID: <span className="text-gray-600">{order._id}</span>
                  </h2>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg">
                      Delivery Method : <b>{order.deliveryMethod}</b>
                    </span>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg">
                      Delivery Status : <b>{order.deliveryStatus}</b>
                    </span>

                    <span
                      className={`text-xs px-2 py-1 rounded-lg text-white ${order.status === "Paid" ? "bg-green-600" : order.status === "Failed" ? "bg-red-600" : "bg-orange-400"}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* user info */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-medium">User:</span>{" "}
                      {order.user?.firstName || "Unknown"}{" "}
                      {order.user?.lastName}
                    </p>
                    <p className="text-gray-500">
                      Email: {order.user?.email || "N/A"}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Total:{" "}
                      <span className="font-bold">
                        {order.currency} {order.amount.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Tax:{" "}
                      <span className="font-bold">
                        {order.currency} {order.tax.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Shipping:{" "}
                      <span className="font-bold">
                        {order.currency} {order.shipping.toFixed(2)}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>

                {/* products */}
                <div>
                  <h3 className="font-medium mb-2">Products:</h3>
                  <ul className="space-y-3">
                    {order.products?.map((product, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 p-3 rounded-lg"
                      >
                        <img
                          onClick={() =>
                            navigate(`/products/${product?.productId?._id}`)
                          }
                          className="w-16 h-16 object-cover cursor-pointer rounded"
                          src={product.productId?.productImg?.[0].url}
                          alt=""
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                          <span className="line-clamp-2 text-sm sm:w-1/2">
                            {product.productId?.productName}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">
                            <b>PID:</b> {product?.productId?._id}
                          </span>
                          <span className="text-green-600 font-bold text-sm">
                            ₹ {product.productId?.productPrice} x{" "}
                            {product.quantity}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
