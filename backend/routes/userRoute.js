import express from "express";
import {
  allUser,
  changePassword,
  forgotPassword,
  getUserById,
  getUserLocations,
  login,
  logout,
  register,
  resetPassword,
  reVerify,
  updateUser,
  verify,
  verifyOTP,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgot-password", forgotPassword); // send OTP
router.post("/verify-otp/:email", verifyOTP); // general use, optional UI verification step

router.post("/reset-password", resetPassword); // NEW for password reset, email + otp + password

router.post("/change-password", isAuthenticated, changePassword);
router.get("/all-user", isAuthenticated, isAdmin, allUser);
//router.get("/get-user/:userId", getUserById);
router.get("/get-user/:userId", isAuthenticated, isAdmin, getUserById);
router.put("/update/:id", isAuthenticated, singleUpload, updateUser);

router.get("/locations", isAuthenticated, isAdmin, getUserLocations);

export default router;
