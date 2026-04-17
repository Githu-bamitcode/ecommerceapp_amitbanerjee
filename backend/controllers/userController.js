import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";
import axios from "axios";

// Helper: Get coordinates safely
const getCoordinatesFromAddress = async (address, city, zipCode) => {
  try {
    if (!address || !city || !zipCode) return null;

    const fullAddress = `${address}, ${city}, ${zipCode}`;

    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: fullAddress,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    );

    if (res.data.results.length > 0) {
      return res.data.results[0].geometry.location;
    }

    return null;
  } catch (error) {
    console.log("Geocoding error:", error.message);
    return null;
  }
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email); // send email here
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1]; // Bearer, kjehlkefkjaed(token)[1]
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email); // send email here
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification email sent again successfully",
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not existing",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (existingUser.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Verify your account at first, then login",
      });
    }

    // generate token
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    existingUser.isLoggedIn = true;
    await existingUser.save();

    // check for existing session and delete it
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }

    // create a new session
    await Session.create({ userId: existingUser._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    //    if (!email || !otp || !password) {
    //      return res.status(400).json({
    //        success: false,
    //        message: "All fields are required",
    //      });
    //    }

    // 1️⃣ Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Check OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already used",
      });
    }

    // 3️⃣ Check OTP expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 4️⃣ Match OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 5️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Update password
    user.password = hashedPassword;

    // 7️⃣ Clear OTP after success
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Reset Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP is not generated or already verified",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired, please request a new one",
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.id; // from isAuthenticated middleware
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
{
  /*}
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
*/
}

//
{
  /*}
export const allUser = async (__, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
*/
}

//

// ================= GET ALL USERS (🔥 IMPORTANT FIX) =================
export const allUser = async (__, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpiry -token");

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        let updatedLocation = user.location;

        // If no coordinates but address exists → generate it
        if (
          (!user.location?.lat || !user.location?.lng) &&
          user.address &&
          user.city &&
          user.zipCode
        ) {
          const coords = await getCoordinatesFromAddress(
            user.address,
            user.city,
            user.zipCode,
          );

          if (coords) {
            updatedLocation = {
              lat: coords.lat,
              lng: coords.lng,
            };

            // ✅ Save in DB (one-time fix)
            await User.findByIdAndUpdate(user._id, {
              location: updatedLocation,
            });
          }
        }

        const fullAddress = `${user.address || ""}, ${user.city || ""}, ${
          user.zipCode || ""
        }`.replace(/^,\s*|,\s*$/g, "");

        return {
          ...user._doc,
          location: {
            lat: updatedLocation?.lat || null,
            lng: updatedLocation?.lng || null,
          },
          fullAddress,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      users: updatedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // extract userId from request params
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id; //the ID of the user we want to update
    const loggedInUser = req.user; //from isAuthenticated middleware

    const { firstName, lastName, address, city, zipCode, phoneNo, role } =
      req.body;
    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }
    let user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    //If a new file is uploaded
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }
    //update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;

    // NEW: Generate coordinates
    if (user.address && user.city && user.zipCode) {
      const coords = await getCoordinatesFromAddress(
        user.address,
        user.city,
        user.zipCode,
      );

      if (coords) {
        user.location = {
          lat: coords.lat,
          lng: coords.lng,
        };
      }
    } else {
      user.location = { lat: null, lng: null };
    }

    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// userController.js
export const getUserLocations = async (req, res) => {
  try {
    const users = await User.find({}, "name address city zipCode");
    const locations = users.map((user) => ({
      lat: user.address.lat,
      lng: user.address.lng,
      name: user.name,
      address: `${user.address.street}, ${user.city}, ${user.zipCode}`,
    }));
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user locations" });
  }
};

//
{
  /* export const getUserLocations = async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName location address city zipCode");

    const locations = users.map((user) => ({
      lat: user.location?.lat || null,
      lng: user.location?.lng || null,
      name: `${user.firstName} ${user.lastName}`,
      address: `${user.address || ""}, ${user.city || ""}, ${user.zipCode || ""}`.trim(),
    }));

    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user locations" });
  }
}; */
}

//
{
  /*export const fixMissingUserLocations = async (req, res) => {
  try {
    const users = await User.find();

    let updatedCount = 0;

    for (const user of users) {
      // Skip if already has coordinates
      if (user.location?.lat && user.location?.lng) continue;

      // Skip if address is incomplete
      if (!user.address || !user.city || !user.zipCode) continue;

      const coords = await getCoordinatesFromAddress(
        user.address,
        user.city,
        user.zipCode,
      );

      if (coords) {
        await User.findByIdAndUpdate(user._id, {
          location: {
            lat: coords.lat,
            lng: coords.lng,
          },
        });

        updatedCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: "User locations fixed successfully",
      updatedUsers: updatedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; */
}
