import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "../../assets/user.jpg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import axios from "axios";
//import { setUser } from "@/redux/userSlice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "user",
    profilePic: "",
  });
  const [file, setFile] = useState(null);
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.id;
  const [loading, setLoading] = useState(false);
  //  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    }); //preview only
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!updateUser.firstName || !updateUser.lastName) {
      return toast.error("First name and last name are required");
    }
    if (userId === user?._id && updateUser.role !== "admin") {
      return toast.error("You cannot change your own admin role");
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);
      // use FormData for text + file
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); // image file for backend multer
      }
      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setUpdateUser({
          ...res.data.user,
          profilePic: res.data.user.profilePic || userLogo,
        });
        // dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `http://localhost:8000/api/v1/user/get-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUpdateUser({
          ...res.data.user,
          profilePic: res.data.user.profilePic || userLogo,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch user details",
      );
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [userId]);

  useEffect(() => {
    if (!user) return; // wait until user loads

    if (user.role !== "admin") {
      toast.error("Unauthorized access");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const currentPic = updateUser.profilePic;

    return () => {
      if (currentPic?.startsWith("blob:")) {
        URL.revokeObjectURL(currentPic);
      }
    };
  }, [updateUser.profilePic]);

  return (
    <div className="pt-5 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex justify-between gap-10">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>
          <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
            {/* profile picture */}
            <div className="flex flex-col items-center">
              <img
                src={updateUser?.profilePic || userLogo}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
              />
              <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
            {/* profile form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={updateUser?.firstName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={updateUser?.lastName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  name="email"
                  disabled
                  value={updateUser?.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  name="phoneNo"
                  placeholder="Enter your Contact No."
                  value={updateUser?.phoneNo}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Address</Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="Enter your Address"
                  value={updateUser?.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">City</Label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="Enter your City"
                    value={updateUser?.city}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Zip Code</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    placeholder="Enter your Zip Code"
                    value={updateUser?.zipCode}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Label className="block text-sm font-medium">Role :</Label>
                <RadioGroup
                  disabled={userId === user?._id}
                  value={updateUser?.role}
                  onValueChange={(value) =>
                    setUpdateUser({ ...updateUser, role: value })
                  }
                  className={`flex items-center ${userId === user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
