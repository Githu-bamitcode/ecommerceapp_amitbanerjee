import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(
  cors({
    //    origin: "http://localhost:5173",
    origin: process.env.CLIENT_URL, // dynamic
    credentials: true,
  }),
);

// routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);

// start server ONLY after DB connects
const startServer = async () => {
  try {
    await connectDB(); // ensure DB connects first
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server is listening at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect DB:", error);
    process.exit(1); // crash if DB fails
  }
};

startServer();

{
  /* app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port:${PORT}`);
}); */
}
