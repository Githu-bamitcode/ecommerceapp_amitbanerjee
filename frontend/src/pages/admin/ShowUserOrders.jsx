import OrderCard from "@/components/OrderCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowUserOrders = () => {
  const params = useParams();
  const [userOrder, setUserOrder] = useState(null);
  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const API_URL = import.meta.env.VITE_API_URL;
    const res = await axios.get(
      `${API_URL}/api/v1/orders/user-order/${params.userId}`,
      //      `http://localhost:8000/api/v1/orders/user-order/${params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  console.log(userOrder);

  return (
    <div className="min-h-screen bg-gray-100 md:ml-64 pt-16 px-4">
      <OrderCard userOrder={userOrder} />
    </div>
  );
};

export default ShowUserOrders;
