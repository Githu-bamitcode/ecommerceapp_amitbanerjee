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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    //    console.log(formData);
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center px-4">
      {/* White card */}
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Log in with your account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your login credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Enter a password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                required
                className="pr-2" // space for icon
              />
              {/* Toggle icon 
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>*/}
            </div>
            <Button
              // onClick={submitHandler}
              type="submit"
              className="w-full text-white bg-pink-600 cursor-pointer hover:bg-pink-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Please wait..
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-gray-600 text-sm text-center">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="hover:underline text-pink-700 font-medium"
            >
              Signup
            </Link>
          </p>
          <p className="text-gray-600 text-sm text-center">
            Already have an account?{" "}
            <Link
              to={"/forgot-password"}
              className="hover:underline text-pink-700 font-medium"
            >
              Forgot password
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
