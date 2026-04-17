import React, { useState, useMemo, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

const ProductDesc = ({ product }) => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  // State for quantity
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // AUTO HANDLE PRICE = 0
  useEffect(() => {
    if (product?.productPrice === 0) {
      setQuantity(0);
    } else {
      setQuantity(1);
    }
  }, [product]);

  const cart = useSelector((state) => state.product.cart);
  // FIND THIS PRODUCT IN CART
  const cartQuantity = useMemo(() => {
    if (!cart?.items || !product?._id) return 0;

    const item = cart.items.find((item) => item.productId?._id === product._id);

    return item ? item.quantity : 0;
  }, [cart, product]);

  const addToCart = async () => {
    try {
      // Check if user is logged in
      if (!accessToken) {
        return toast.error("Please login first");
      }

      // BLOCK IF PRICE IS 0
      if (product?.productPrice === 0) {
        return toast.error("This product is not available for purchase");
      }

      // Validate quantity
      if (quantity < 1) {
        return toast.error("Quantity must be at least 1");
      }

      if (!product?._id) {
        return toast.error("Invalid product");
      }

      setLoading(true);

      const res = await axios.post(
        `http://localhost:8000/api/v1/cart/add`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true, // important if backend uses cookies
        },
      );
      if (res?.data?.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      } else {
        toast.error(res?.data?.message || "Failed to add product");
      }
    } catch (error) {
      console.log("Add to cart error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl text-gray-800">
        {product?.productName}
      </h1>
      <p className="text-gray-800">
        {product?.category} | {product?.brand}
      </p>
      <h2 className="text-pink-500 font-bold text-2xl">
        {product?.productPrice === 0 ? (
          <span className="text-red-500">Out of Stock</span>
        ) : (
          <span className="text-pink-500">
            ₹{product?.productPrice?.toLocaleString("en-IN")}
          </span>
        )}
      </h2>
      <p className="line-clamp-12 text-muted-foreground ">
        {product?.productDesc}
      </p>
      <div className="flex-gap-2 items-center w-75">
        <p className="text-gray-800 font-semibold">Quantity :</p>
        <Input
          type="number"
          className="w-14"
          value={quantity}
          min={product?.productPrice === 0 ? 0 : 1}
          disabled={product?.productPrice === 0}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={addToCart}
          disabled={loading || product?.productPrice === 0}
          className="bg-pink-600  text-white cursor-pointer hover:bg-black"
        >
          <ShoppingCart size={16} />
          {product?.productPrice === 0
            ? "Unavailable"
            : loading
              ? "Adding..."
              : "Add to cart"}
        </Button>
        {/* SHOW ACTUAL CART QUANTITY */}
        {cartQuantity > 0 && (
          <span className="text-green-600 font-semibold">
            🛒{cartQuantity} in cart
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductDesc;
