import { Menu, ShoppingCart, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);

  const logoutHandler = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        //        `${import.meta.env.VITE_URL}/api/v1/user/logout`,
        `${API_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <header className="bg-pink-50 fixed top-0 left-0 w-full z-50 border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/">
              <img src="/shop_online.jpg" alt="logo" className="w-16 md:w-20" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <ul className="flex items-center gap-6 text-base font-semibold">
                <Link to="/">
                  <li className="hover:text-pink-600 transition">Home</li>
                </Link>

                <Link to="/products">
                  <li className="hover:text-pink-600 transition">Products</li>
                </Link>

                {user && (
                  <Link to={`/profile/${user._id}`}>
                    <li className="hover:text-pink-600 transition">
                      Hello, {user.firstName}
                    </li>
                  </Link>
                )}

                {admin && (
                  <Link to="/dashboard/sales">
                    <li className="hover:text-pink-600 transition">
                      Dashboard
                    </li>
                  </Link>
                )}
              </ul>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6" />

                <span className="bg-pink-500 rounded-full absolute text-white text-xs -top-2 -right-3 px-1.5 py-0.5">
                  {cart?.items?.length || 0}
                </span>
              </Link>

              {/* Auth Button */}
              {user ? (
                <Button
                  onClick={logoutHandler}
                  className="bg-pink-600 text-white hover:bg-black"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-tr from-blue-600 to-purple-600 text-white"
                >
                  Login
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-pink-100 shadow-lg">
            <div className="flex flex-col px-6 py-5 gap-5 text-lg font-medium">
              <Link to="/" onClick={() => setMobileMenu(false)}>
                Home
              </Link>

              <Link to="/products" onClick={() => setMobileMenu(false)}>
                Products
              </Link>

              {user && (
                <Link
                  to={`/profile/${user._id}`}
                  onClick={() => setMobileMenu(false)}
                >
                  Hello, {user.firstName}
                </Link>
              )}

              {admin && (
                <Link
                  to="/dashboard/sales"
                  onClick={() => setMobileMenu(false)}
                >
                  Dashboard
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center gap-2"
                onClick={() => setMobileMenu(false)}
              >
                <ShoppingCart />
                Cart ({cart?.items?.length || 0})
              </Link>

              {/* Auth */}
              {user ? (
                <Button
                  onClick={logoutHandler}
                  className="bg-pink-600 text-white w-full"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenu(false);
                  }}
                  className="bg-gradient-to-tr from-blue-600 to-purple-600 text-white w-full"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Prevent content hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
