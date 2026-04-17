import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.jpg";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = "http://localhost:8000/api/v1/cart";
  const accessToken = localStorage.getItem("accessToken");

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  const handleUpdateQuantity = async (productId, type) => {
    const previousCart = { ...cart };
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      } else {
        throw new Error("Failed to update cart");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity. Reverting changes.");
      dispatch(setCart(previousCart)); // rollback
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter out deleted products
  const validItems = cart?.items?.filter((item) => item?.productId?._id) || [];

  const subtotal = validItems.reduce((acc, item) => {
    const price = item?.productId?.productPrice || 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="pt-21 bg-gray-50 min-h-screen">
      {validItems.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            🛒Shopping Cart
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {validItems.map((product, index) => {
                const price = product?.productId?.productPrice || 0;
                const isOutOfStock = product.quantity === 0;
                return (
                  <Card key={index}>
                    <div className="flex justify-between items-center pr-7">
                      <div className="flex items-center gap-4 w-87.5">
                        <img
                          src={
                            product?.productId?.productImg?.[0]?.url || userLogo
                          }
                          alt=""
                          className="w-25 h-25"
                        />
                        <div className="w-70">
                          <h1 className="font-semibold truncate">
                            {product?.productId?.productName ||
                              "Product unavailable"}
                          </h1>
                          <p>
                            {isOutOfStock
                              ? "Out of Stock"
                              : `₹${price?.toLocaleString("en-IN")}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-5 items-center">
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              product?.productId?._id,
                              "decrease",
                            )
                          }
                          className="bg-amber-500 flex items-center justify-center w-8 h-8"
                          disabled={isOutOfStock || product.quantity <= 1}
                        >
                          -
                        </Button>
                        <span>{isOutOfStock ? 0 : product.quantity}</span>
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              product?.productId?._id,
                              "increase",
                            )
                          }
                          className="bg-amber-500 flex items-center justify-center w-8 h-8"
                          disabled={isOutOfStock}
                        >
                          +
                        </Button>
                      </div>
                      <p>
                        {isOutOfStock
                          ? "₹0"
                          : `₹${(price * product.quantity).toLocaleString("en-IN")}`}
                      </p>
                      <p
                        onClick={() => handleRemove(product?.productId?._id)}
                        className="flex text-red-500 items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div>
              <Card className="w-100">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({validItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <Separator className="my-2 bg-gray-300" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="Promo Code" />
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Button
                      onClick={() => navigate("/address")}
                      className="bg-pink-600 text-white mt-1 cursor-pointer  hover:bg-black w-full"
                      disabled={validItems.every((item) => item.quantity === 0)}
                    >
                      PLACE ORDER
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-gray-300  text-black hover:bg-black hover:text-white"
                    >
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free shipping on orders over 299</p>
                    <p>* 30-days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          {/* Icon */}
          <div className="bg-pink-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>
          {/* title */}
          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-gray-600">
            Looks like you haven't added anything
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="mt-6 cursor-pointer bg-pink-600 text-white py-3 px-6 hover:bg-pink-700"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};
export default Cart;
