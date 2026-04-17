import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import axios from "axios";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  let filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.productPrice - b.productPrice,
    );
  }
  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.productPrice - a.productPrice,
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editProduct) return;

    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    const images = editProduct.productImg || [];
    // Add existing images public_ids
    const existingImages = images
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages || []));

    // Add new files
    images
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product updated successfully");

        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updateProducts));
        setEditProduct(null);
        setOpen(false);
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error?.response);
      console.log("DATA:", error?.response?.data);
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product deleted successfully");
        // Update Redux store immediately
        const remainingProducts = products.filter(
          (product) => product._id !== productId,
        );
        dispatch(setProducts(remainingProducts));
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };
  return (
    <div className="pl-87.5 py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Product..."
            className="w-100 items-center"
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>
        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-50 bg-white border border-gray-300 shadow-sm font-semibold">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="bg-gray-600 text-white z-50 border border-gray-200 shadow-xl rounded-md"
          >
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
          </SelectContent>
        </Select>
      </div>
      {filteredProducts.map((product, index) => {
        return (
          <Card key={index} className="px-4">
            <div className="flex item-center justify-between">
              <div className="flex gap-2 item-center">
                <img
                  src={product.productImg[0]?.url}
                  alt=""
                  className="w-15 h-15"
                />
                <h1 className="font-bold w-96 text-gray-700">
                  {product.productName}
                </h1>
              </div>
              <h1 className="font-semibold text-gray-800 mt-5">
                ₹{product.productPrice?.toLocaleString("en-IN")}
              </h1>
              <div className="flex gap-3">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Edit
                      onClick={() => {
                        (setOpen(true), setEditProduct({ ...product }));
                      }}
                      className="text-green-500 cursor-pointer mt-5"
                    />
                  </DialogTrigger>
                  <DialogContent className="bg-white opacity-100 sm:max-w-156.25 max-h-185 overflow-y-auto rounded-lg shadow-xl">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Make changes to your product here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-2">
                      <div className="grid gap-2">
                        <Label>Product Name</Label>
                        <Input
                          type="text"
                          value={editProduct?.productName || ""}
                          onChange={handleChange}
                          name="productName"
                          placeholder="Ex-Iphone"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={editProduct?.productPrice || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow up to 6 digits
                            if (
                              value === "" ||
                              (/^\d{0,6}$/.test(value) &&
                                Number(value) <= 999999)
                            ) {
                              handleChange(e);
                            }
                          }}
                          name="productPrice"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Brand</Label>
                          <Input
                            type="text"
                            value={editProduct?.brand || ""}
                            onChange={handleChange}
                            name="brand"
                            placeholder="Ex-apple"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Input
                            type="text"
                            value={editProduct?.category || ""}
                            onChange={handleChange}
                            name="category"
                            placeholder="Ex-mobile"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label>Description</Label>
                        </div>
                        <Textarea
                          name="productDesc"
                          value={editProduct?.productDesc || ""}
                          onChange={handleChange}
                          placeholder="Enter brief description of product"
                        />
                      </div>
                      <ImageUpload
                        productData={editProduct}
                        setProductData={setEditProduct}
                      />
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose>
                        <Button
                          variant="outline"
                          className="bg-gray-300 text-black cursor-pointer  hover:bg-black hover:text-white"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleSave}
                        type="submit"
                        className="bg-pink-800 text-white cursor-pointer  hover:bg-black"
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 className="text-red-500 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this product from all users' carts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-300 text-black cursor-pointer  hover:bg-black hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProductHandler(product._id)}
                        className="bg-pink-800 text-white cursor-pointer  hover:bg-black"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminProduct;
