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
    <div className="pl-87.5 bg-gray-100 py-20 pr-20 mx-auto px-4">
      <div className="p-6 grid gap-6 lg:grid-cols-4">
        {/* stats card */}
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalSales?.toLocaleString("en-IN")}
          </CardContent>
        </Card>

        {/* sales chart */}
        <Card className="lg:col-span-4 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Sales Overview (Last 30 days)
            </CardTitle>
          </CardHeader>

          <CardContent className="h-80">
            {stats.sales?.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.sales}>
                  {/* subtle grid for modern dashboard feel */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                      })
                    }
                  />

                  <YAxis
                    tick={{ fontSize: 12 }}
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

                  {/* gradient fill (modern look) */}
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F47286" stopOpacity={0.8} />
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
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
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

{
  /*
    return (
    <div className="pl-87.5 bg-gray-100 py-20 pr-20 mx-auto px-4">
      <div className="p-6 grid gap-6 lg:grid-cols-4">
        // stats card 
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalSales?.toLocaleString("en-IN")}
          </CardContent>
        </Card>

        // sales chart 
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.sales}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F47286"
                  fill="#F47286"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
*/
}
