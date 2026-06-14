import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setProducts } from "@/redux/productSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (
      productData.productName.length === 0 ||
      productData.productPrice.length === 0 ||
      productData.productDesc.length === 0 ||
      productData.category.length === 0 ||
      productData.brand.length === 0
    ) {
      toast.error("Please enter all details in above fields");
      return;
    }

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        `${API_URL}/api/v1/product/add`,
        //        `http://localhost:8000/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success(res.data.message);
        //        productData;
        productData.productName = "";
        productData.productPrice = 0;
        productData.productDesc = "";
        productData.productImg = [];
        productData.brand = "";
        productData.category = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 md:ml-64 pt-14 md:pt-6 px-4 sm:px-6 lg:px-8 pb-6">
      <Card className="w-full max-w-5xl mx-auto shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add Product</CardTitle>
          <CardDescription>Enter product details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="Ex-Iphone"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder="Ex-apple"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  type="text"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  placeholder="Ex-mobile"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  name="productPrice"
                  value={productData.productPrice}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Only allow up to 6 digits
                    if (
                      value === "" ||
                      (/^\d{0,6}$/.test(value) && Number(value) <= 999999)
                    ) {
                      handleChange(e);
                    }
                  }}
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                placeholder="Enter brief description of product"
                className="min-h-30"
              />
            </div>
            <div>
              <ImageUpload
                productData={productData}
                setProductData={setProductData}
              />
            </div>
            <CardFooter className="p-0 pt-4">
              <Button
                disabled={loading}
                onClick={submitHandler}
                className="w-full bg-pink-600 cursor-pointer  text-white hover:bg-black"
                type="submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Please wait
                  </span>
                ) : (
                  "Add Product"
                )}
              </Button>
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
