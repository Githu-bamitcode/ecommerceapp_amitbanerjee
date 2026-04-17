import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import axios from "axios";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName, _id } = product;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // GET CART FROM REDUX
  const cart = useSelector((state) => state.product.cart);

  // FIND PRODUCT IN CART
  const cartQuantity = useMemo(() => {
    if (!cart?.items || !_id) return 0;

    const item = cart.items.find((item) => item.productId?._id === _id);

    return item ? item.quantity : 0;
  }, [cart, _id]);

  const addToCart = async () => {
    try {
      if (!accessToken) {
        return toast.error("Please login first");
      }

      // BLOCK IF OUT OF STOCK
      if (productPrice === 0) {
        return toast.error("This product is out of stock");
      }

      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId: _id, quantity: 1 }, // always send quantity
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        },
      );

      if (res?.data?.success) {
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
      } else {
        toast.error(res?.data?.message || "Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      <div className="w-22 h-19 aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
            onClick={() => navigate(`/products/${_id}`)}
            src={productImg[0]?.url}
            alt=""
            className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 space-y-2 my-2">
          <Skeleton className="w-50 h-4" />
          <Skeleton className="w-25 h-4" />
          <Skeleton className="w-37.5 h-8" />
        </div>
      ) : (
        <div className="px-2 space-y-1">
          <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>
          {/* PRICE / OUT OF STOCK */}
          <h2 className="font-bold">
            {productPrice === 0 ? (
              <span className="text-red-500">Out of Stock</span>
            ) : (
              <span>₹{productPrice?.toLocaleString("en-IN")}</span>
            )}
          </h2>
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={addToCart}
              disabled={productPrice === 0}
              className="bg-pink-600 text-white cursor-pointer hover:bg-black flex items-center gap-1 h-7 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              {productPrice === 0 ? "Unavailable" : "Add"}
            </Button>

            {/* SHOW CART QUANTITY */}
            {cartQuantity > 0 && productPrice !== 0 && (
              <span className="text-green-600 font-semibold text-sm">
                {cartQuantity} in cart
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
