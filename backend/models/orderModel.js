import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // NEW: Delivery method
    deliveryMethod: {
      type: String,
      enum: ["Standard", "Express", "Same-day"],
      default: "Standard",
    },

    // NEW: Delivery status
    deliveryStatus: {
      type: String,
      enum: [
        "Pending",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Razorpay fields
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
