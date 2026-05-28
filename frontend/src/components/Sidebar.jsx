import React, { useState } from "react";
import {
  LayoutDashboard,
  ListOrdered,
  PackagePlus,
  PackageSearch,
  Users,
  Menu,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      to: "/dashboard/sales",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/add-product",
      icon: <PackagePlus size={20} />,
      label: "Add Product",
    },
    {
      to: "/dashboard/products",
      icon: <PackageSearch size={20} />,
      label: "Products",
    },
    {
      to: "/dashboard/users",
      icon: <ListOrdered size={20} />,
      label: "Order & Payment",
    },
    {
      to: "/dashboard/orders",
      icon: <FaRegEdit size={20} />,
      label: "Delivery Status",
    },
    {
      to: "/dashboard/userslist",
      icon: <Users size={20} />,
      label: "Users",
    },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-pink-600 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-md">
        <NavLink to="/" className="text-lg font-bold">
          Home
        </NavLink>

        <div className="flex items-center gap-4">
          <NavLink to="/dashboard/sales" className="text-sm font-semibold">
            Dashboard
          </NavLink>

          <button onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-pink-50 border-r border-pink-200 p-5 transform transition-transform duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-xl font-bold text-pink-600">Menu</h2>

          <button onClick={() => setOpen(false)}>
            <X size={28} />
          </button>
        </div>

        {/* Desktop Title */}
        <div className="hidden md:block mb-8 mt-12">
          <h2 className="text-2xl font-bold text-pink-600">
            <u>Admin Dashboard</u>
          </h2>
        </div>

        {/* Nav Links */}
        <div className="space-y-3">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl font-semibold transition-all duration-200
                ${
                  isActive
                    ? "bg-pink-600 text-white"
                    : "text-gray-700 hover:bg-pink-100"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
