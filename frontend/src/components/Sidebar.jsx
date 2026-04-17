import React from "react";
import {
  LayoutDashboard,
  ListOrdered,
  PackagePlus,
  PackageSearch,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="hidden fixed md:block border-r bg-pink-50 border-pink-200 x-10 w-70 p-10 space-y-2 h-180">
      <div className="text-center pt-10 px-0 space-y-2">
        <NavLink
          to="/dashboard/sales"
          className={({ isActive }) =>
            `test-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/add-product"
          className={({ isActive }) =>
            `test-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <PackagePlus />
          <span>Add Product</span>
        </NavLink>

        <NavLink
          to="/dashboard/products"
          className={({ isActive }) =>
            `test-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <PackageSearch />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `test-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <ListOrdered />
          <span>Order & Payment</span>
        </NavLink>

        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) =>
            `test-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <FaRegEdit />
          <span>Delivery Status</span>
        </NavLink>

        <NavLink
          to="/dashboard/userslist"
          className={({ isActive }) =>
            `test-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <Users />
          <span>Users</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
