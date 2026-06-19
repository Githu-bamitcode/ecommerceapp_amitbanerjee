import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector((store) => store.product);
  const product = products.find((item) => item._id === productId);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
      <Breadcrums product={product} />
      <div className="mt-6 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductImg images={product.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;
