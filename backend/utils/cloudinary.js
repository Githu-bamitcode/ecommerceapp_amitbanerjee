import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
// dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true, // remove this line if Render Deployment fails
});

export default cloudinary;
