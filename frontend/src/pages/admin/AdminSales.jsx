import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [],
  });

  const fetchstats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchstats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 md:ml-64 pt-8 md:pt-6 px-4 sm:px-6 lg:px-8 pb-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="bg-pink-500 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="bg-pink-500 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="bg-pink-500 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card className="bg-pink-500 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold wrap-break-word">
            ₹ {stats.totalSales?.toLocaleString("en-IN")}
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card className="sm:col-span-2 lg:col-span-4 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Sales Overview (Last 30 Days)
            </CardTitle>
          </CardHeader>

          <CardContent>
            {stats.sales?.length ? (
              <div className="w-full h-75 sm:h-90">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.sales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={20}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                      }
                    />

                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #eee",
                        fontSize: "13px",
                      }}
                      formatter={(value) => [`₹${value}`, "Sales"]}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />

                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F47286"
                          stopOpacity={0.8}
                        />

                        <stop
                          offset="95%"
                          stopColor="#F47286"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>

                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#F47286"
                      strokeWidth={2}
                      fill="url(#colorSales)"
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-400">
                Please wait....fetching sales data
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSales;
