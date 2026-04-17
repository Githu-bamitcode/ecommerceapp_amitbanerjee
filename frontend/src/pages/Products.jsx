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

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/product/getallproducts`,
      );
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.mmessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allProducts.length === 0) return;
    let filtered = [...allProducts];
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }
    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }
    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  useEffect(() => {
    getAllProducts();
  }, []);

  console.log(allProducts);

  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* sidebar */}
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
        {/* Main product section */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-50 bg-white border border-gray-300 shadow-sm font-semibold">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="bg-gray-600 text-white z-50 border border-gray-200 shadow-xl rounded-md"
              >
                <SelectGroup>
                  <SelectItem
                    value="lowToHigh"
                    className="hover:bg-blue-700 focus:bg-blue-700 focus:text-white cursor-pointer"
                  >
                    Price: Low to High
                  </SelectItem>
                  <SelectItem
                    value="highToLow"
                    className="hover:bg-blue-700 focus:bg-blue-700 focus:text-white cursor-pointer"
                  >
                    Price: High to Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {products.map((product) => {
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  loading={loading}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
