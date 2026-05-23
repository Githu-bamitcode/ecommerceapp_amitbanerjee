import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <Link to="/">
              <img src="/loginbkground.png" alt="Logo" className="w-32 mb-4" />
            </Link>

            <p className="text-sm leading-6">
              Powering Your World with the Best in Electronics
            </p>

            <p className="mt-3 text-sm">
              123 Electronics St, Style City, NY 10001
            </p>

            <p className="text-sm mt-1">Email: support@Zaptro.com</p>

            <p className="text-sm mt-1">Phone: (123) 456-7890</p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-pink-500 cursor-pointer transition">
                Contact Us
              </li>

              <li className="hover:text-pink-500 cursor-pointer transition">
                Shipping & Returns
              </li>

              <li className="hover:text-pink-500 cursor-pointer transition">
                FAQs
              </li>

              <li className="hover:text-pink-500 cursor-pointer transition">
                Order Tracking
              </li>

              <li className="hover:text-pink-500 cursor-pointer transition">
                Size Guide
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                "Shop",
                "New Arrivals",
                "Best Sellers",
                "Deals & Offers",
                "Gift Cards",
                "Blogs",
              ].map((item, index) => (
                <li
                  key={index}
                  className="hover:text-pink-500 transition duration-300 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Stay in the Loop</h3>

            <p className="text-sm leading-6">
              Subscribe to get special offers, free giveaways, and more.
            </p>

            <form className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full p-3 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <button
                type="submit"
                className="bg-pink-600 text-white px-5 py-3 rounded-md hover:bg-red-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Media 
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>

            <div className="flex items-center gap-4 text-2xl">
              <FaFacebook className="hover:text-blue-500 cursor-pointer transition" />

              <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />

              <FaTwitterSquare className="hover:text-sky-400 cursor-pointer transition" />

              <FaPinterest className="hover:text-red-500 cursor-pointer transition" />
            </div>
          </div>
          */}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 mt-6 text-lg">
          <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 transition duration-300 flex items-center justify-center cursor-pointer">
            <FaFacebookF />
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-500 transition duration-300 flex items-center justify-center cursor-pointer">
            <FaInstagram />
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-sky-500 transition duration-300 flex items-center justify-center cursor-pointer">
            <FaTwitter />
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-500 transition duration-300 flex items-center justify-center cursor-pointer">
            <FaYoutube />
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 transition duration-300 flex items-center justify-center cursor-pointer">
            <FaPinterestP />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-pink-500 font-medium">
              Amit Banerjee's Ecommerce Kart
            </span>{" "}
            | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
