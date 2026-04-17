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
        "http://localhost:8000/api/v1/user/all-user",
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
    <div className="pl-90 py-20 pr-20 mx-auto px-4">
      <h1 className="font-bold text-2xl">Customer Orders and Payments</h1>
      <p>View customer wise orders and payments status</p>

      <div className="flex relative w-85 mt-3">
        <Search className="absolute left-2 top-1.75 text-gray-600 w-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          placeholder="Search by name or email id or role"
        />
      </div>

      <div className="grid grid-cols-3 gap-7 mt-3">
        {filteredUsers.map((user) => {
          const hasValidLocation =
            user.location &&
            user.location.lat !== null &&
            user.location.lng !== null;

          return (
            <div key={user._id} className="bg-pink-100 p-5 rounded-lg">
              <div className="flex items-center gap-2">
                <img
                  src={user?.profilePic || UserLogo}
                  alt=""
                  className="rounded-full w-15 aspect-square object-cover border-pink-600"
                />
                <div>
                  <h1 className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <h3>{user?.email}</h3>
                  <h3>Role : {user?.role}</h3>
                </div>
              </div>

              <div className="flex gap-3 mt-3 justify-center">
                {/*}                <Button
                  className="bg-pink-200 hover:bg-pink-300 cursor-pointer"
                  onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                  variant="outline"
                >
                  <Edit />
                  Edit Profile
                </Button> */}
                <Button
                  className="bg-pink-200 hover:bg-pink-300 cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/users/orders/${user?._id}`)
                  }
                  variant="outline"
                >
                  <Eye />
                  Orders & Payemnts
                </Button>
              </div>

              {/* MAP PER USER */}
              {/*              <div className="mt-4">
                {hasValidLocation ? (
                  <GoogleMap
                    center={user.location}
                    zoom={14}
                    mapContainerStyle={mapContainerStyle}
                  >
                    <Marker position={user.location} />
                  </GoogleMap>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>
                      <u>Full address</u> :-
                    </p>
                    {user.fullAddress && (
                      <p className="text-xs mt-1">{user.fullAddress}</p>
                    )}
                  </div>
                )}
              </div> */}

              {/* GOOGLE MAP */}
              {/*              {user?.address && (
                <div className="mt-3">
                  <h6 style={{ color: "#007bff", marginBottom: "8px" }}>
                    <FaMapMarkerAlt /> Location Map
                  </h6>
                  <div
                    style={{
                      width: "100%",
                      height: "250px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      border: "1px solid #ddd",
                    }}
                  >
                    <iframe
                      title={`map-${user._id}`}
                      src={getMapUrl(user)}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      loading="lazy"
                      //referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
