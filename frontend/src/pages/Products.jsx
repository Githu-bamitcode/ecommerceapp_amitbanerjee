//chat gpt

import FilterSidebar from "@/components/FilterSidebar";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

const Products = () => {
  const { products } = useSelector((store) => store.product);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const [priceRange, setPriceRange] = useState([0, 999999]);

  const [sortOrder, setSortOrder] = useState("");

  const dispatch = useDispatch();

  // Fetch Products
  const getAllProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/getallproducts`,
      );

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filtering & Sorting
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // Search
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Brand
    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    // Price Range
    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );

    // Sorting
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  // Initial Fetch
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="pt-1 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-70 shrink-0">
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              allProducts={allProducts}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Main Product Section */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl mt-6 font-bold text-gray-800">
                Products
              </h2>

              {/* Sort Dropdown */}
              <Select onValueChange={(value) => setSortOrder(value)}>
                <SelectTrigger className="w-full sm:w-55 bg-white border border-gray-300 shadow-sm font-medium">
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="bg-white text-black z-50 border border-gray-200 shadow-xl rounded-md"
                >
                  <SelectGroup>
                    <SelectItem
                      value="lowToHigh"
                      className="hover:bg-blue-100 cursor-pointer"
                    >
                      Price: Low to High
                    </SelectItem>

                    <SelectItem
                      value="highToLow"
                      className="hover:bg-blue-100 cursor-pointer"
                    >
                      Price: High to Low
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loading={loading}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <h2 className="text-2xl font-semibold text-gray-500">
                    No Products Found
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
