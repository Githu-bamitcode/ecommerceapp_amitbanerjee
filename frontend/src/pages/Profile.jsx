import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.jpg";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/userSlice";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role,
  });
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return toast.error("All fields are required");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      setPasswordLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // clear fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

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

    const accessToken = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      // use FormData for text + file
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("password", updateUser.password);
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
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div>
            <div className="flex flex-col justify-center items-center bg-gray-100">
              <h1 className="font-bold mb-5 text-2xl text-gray-800">
                Update Profile
              </h1>
              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                {/* profile picture */}
                <div className="flex flex-col items-center">
                  <img
                    src={updateUser?.profilePic || userLogo}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
                  />
                  <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-800">
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
                        value={updateUser.firstName}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={updateUser.lastName}
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
                      value={updateUser.email}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password securely
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>Current Password</Label>
                        <Input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="text-white  bg-pink-600 cursor-pointer hover:bg-pink-800"
                      >
                        {passwordLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  <div>
                    <Label className="block text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      type="text"
                      name="phoneNo"
                      placeholder="Enter your Contact No."
                      value={updateUser.phoneNo}
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
                      value={updateUser.address}
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
                        value={updateUser.city}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        name="zipCode"
                        placeholder="Enter your Zip Code"
                        value={updateUser.zipCode}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-pink-600 cursor-pointer hover:bg-pink-800 text-white font-semibold py-2 rounded-lg disabled:opacity-70"
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
        </TabsContent>
        <TabsContent value="orders">
          <MyOrder />
          {/*          
<Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current password</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New password</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className={"bg-black text-white"}>Save password</Button>
            </CardFooter>
          </Card> 
          */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
