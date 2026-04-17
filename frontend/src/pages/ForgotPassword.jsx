import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/forgot-password",
        { email: formData.email },
      );

      if (res.data.success) {
        toast.success("OTP sent");
        setOtpSent(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:8000/api/v1/user/verify-otp/${formData.email}`,
        { otp: formData.otp },
      );

      if (res.data.success) {
        toast.success("OTP Verified");
      }
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();

    if (!formData.otp || !formData.password) {
      toast.error("OTP and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/reset-password",
        formData,
      );

      if (res.data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false); // ✅ THIS MUST RUN
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 via-white to-pink-200 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0 bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-500">
            {!otpSent
              ? "Enter your email to receive OTP"
              : "Verify OTP and reset your password"}
          </CardDescription>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mt-3">
            <span
              className={`h-2 w-10 rounded-full ${
                !otpSent ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
            <span
              className={`h-2 w-10 rounded-full ${
                otpSent ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={otpSent ? resetPassword : sendOtp}
            className="space-y-5"
          >
            <Input
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11"
            />

            {otpSent && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <Input
                  name="otp"
                  placeholder="Enter OTP sent to email"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="h-11 tracking-widest text-center text-lg"
                />

                <Button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full bg-gray-100 text-red-700 hover:bg-gray-300"
                >
                  Verify OTP
                </Button>

                <Input
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
            )}

            <Button className="w-full h-11 bg-pink-600 hover:bg-pink-700 transition-all text-white font-medium">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </span>
              ) : otpSent ? (
                "Reset Password"
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
