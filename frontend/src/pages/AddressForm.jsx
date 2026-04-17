import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );
  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  console.log(cart);

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!data.success)
        return toast.error("Something went wrong while placing order");

      console.log("Razorpay data:", data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id, // Order ID form backend
        name: "AmitBanerjeeEcomm",
        description: "Order Payment",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              response,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              },
            );

            if (verifyRes.data.success) {
              toast.success("✅ Payment Successfull");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("❌ Payment Verification failed");
            }
          } catch (error) {
            console.log(error);
            toast.error("Error verifying payment");
          }
        },
        modal: {
          ondismiss: async function () {
            // Handle user closing the popup
            await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              {
                razorpay_order_id: data.order.id,
                paymentFailed: true,
              },
              {
                headers: { Authorizatio: `Bearer ${accessToken}` },
              },
            );
            toast.error("Payment Cancelled or Failed");
          },
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F47286" },
      };

      const rzp = new window.Razorpay(options);

      // Listen for payment failures
      rzp.on("payment.failed", async function (response) {
        await axios.post(
          `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
          {
            razorpay_order_id: data.order.id,
            paymentFailed: true,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        toast.error("Payment Failed. Please try again");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE (Address Section) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold text-blue-500">🛒Checkout</h1>
          </div>

          {/* Address Card */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            {showForm ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Full Name</Label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <Input
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="zip"
                    placeholder="Zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                  <Input
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full font-bold bg-gray-300 cursor-pointer hover:bg-gray-400"
                >
                  Save & Continue
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-green-700">
                  Saved Addresses
                </h2>

                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    onClick={() => dispatch(setSelectedAddress(index))}
                    className={`border p-4 rounded-md cursor-pointer relative ${
                      selectedAddress === index
                        ? "border-pink-600 bg-pink-50"
                        : "border-gray-300"
                    }`}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p>{addr.phone}</p>
                    <p>{addr.email}</p>
                    <p>
                      {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                      {addr.country}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteAddress(index));
                      }}
                      className="absolute top-2 right-2 text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full font-bold bg-gray-300 cursor-pointer hover:bg-gray-400"
                  onClick={() => setShowForm(true)}
                >
                  + Add New Address
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE (Order Summary) */}
        <div className="lg:col-span-1">
          <div className="sticky top-40">
            <Card className="shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.items.length})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>

                <Separator className="my-2 bg-gray-400" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="text-sm text-gray-500 pt-2">
                  <p>* Free shipping on orders over ₹299</p>
                  <p>* 30-days return policy</p>
                  <p>* Secure checkout</p>
                </div>
              </CardContent>
            </Card>
            <br></br>
            <div className="flex justify-center">
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="bg-pink-600 text-white rounded-2xl px-8 py-2 shadow-lg hover:scale-105 transition cursor-pointer hover:bg-black"
              >
                Proceed to Pay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddressForm;

{
  /*
  return (
    <div className="max-w-2xl  grid place-items-center p-4">
      <div className="=grid grid-cols-2 items-start gap-20 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">My Cart</h1>
        </div>
        <div className="space-y-6 p-6 bg-white font-semibold">
          {showForm ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Kolkata"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="West Bengal"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="700010"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-green-700">
                Saved Addresses :-
              </h2>
              {addresses.map((addr, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => dispatch(setSelectedAddress(index))}
                    className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p>{addr.phone}</p>
                    <p>{addr.email}</p>
                    <p>
                      {addr.address},{addr.city},{addr.state},{addr.zip},
                      {addr.country}
                    </p>
                    <button
                      onClick={(e) => dispatch(deleteAddress(index))}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full bg-pink-300"
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </Button>
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full bg-pink-600 text-white"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
  //Right side order summary
        <div>
          <Card className="w-100 mt-5">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <Separator className="my-2 bg-gray-500" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
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
  );
};
export default AddressForm 
*/
}
