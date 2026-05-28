import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserLogo from "../../assets/user.jpg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

// Google Maps imports
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

// fallback (Kolkata default)
//const defaultCenter = {
//  lat: 22.5726,
//  lng: 88.3639,
//};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  /* ==============================
     GOOGLE MAP URL BUILDER
  ============================== */
  const getMapUrl = (user) => {
    if (!user?.address) return null;

    const fullAddress = `${user.address} ${user.zipCode || ""}`;
    const encodedAddress = encodeURIComponent(fullAddress);

    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  };

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/all-user`,
        //        "http://localhost:8000/api/v1/user/all-user",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName} ${user.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isLoaded) return <p>Loading Maps...</p>;

  //  console.log(users);

  return (
    <div className="min-h-screen bg-gray-100 md:ml-64 pt-14 md:pt-6 px-4 sm:px-6 lg:px-8 pb-6">
      <h1 className="font-bold text-xl sm:text-2xl">
        Customer Orders and Payments
      </h1>
      <p>View customer wise orders and payments status</p>

      <div className="relative w-full sm:w-87.5 mt-4">
        <Search className="absolute left-2 top-1.75 text-gray-600 w-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          placeholder="Search by name or email id or role"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredUsers.map((user) => {
          const hasValidLocation =
            user.location &&
            user.location.lat !== null &&
            user.location.lng !== null;

          return (
            <div
              key={user._id}
              className="bg-pink-100 p-5 rounded-2xl shadow-md"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 text-center sm:text-left">
                <img
                  src={user?.profilePic || UserLogo}
                  alt=""
                  className="rounded-full w-20 h-20 object-cover border-2 border-pink-600"
                />
                <div>
                  <h1 className="font-semibold wrap-break-word">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <h3 className="text-sm wrap-break-word">{user?.email}</h3>
                  <h3>Role : {user?.role}</h3>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-5 sm:flex-row sm:items-center">
                <Button
                  className="w-full sm:w-auto bg-pink-200 hover:bg-pink-300 cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/users/orders/${user?._id}`)
                  }
                  variant="outline"
                >
                  <Eye />
                  Orders & Payemnts
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
