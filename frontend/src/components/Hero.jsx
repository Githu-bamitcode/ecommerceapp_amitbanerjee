import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Latest Products at Best Prices
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 text-red-200">
              Discover cutting-edge technology with unbeatable deals on
              Smartphones, Laptops and more...
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate(`/products`)}
                className="bg-gray-300 text-blue-600 hover:bg-gray-400"
              >
                Shop Now
              </Button>
              <Button
                //variant="outline"
                onClick={() => navigate(`/profile/:userId`)}
                className="bg-gray-300 text-blue-600 hover:bg-gray-400"
              >
                View Deals
              </Button>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <img
              src="/ecomheader.jpg"
              alt="E-commerce Banner"
              //              width={1500}
              //              height={400}
              className="w-full h-auto rounded-xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
