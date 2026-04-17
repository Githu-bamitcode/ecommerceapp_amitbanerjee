import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mt-15 mb-8">
              Latest Products at Best Prices
            </h1>
            <p className="text-xl mb-6 text-red-200">
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
          <div className="relative mt-20">
            <img
              src="/ecomheader.jpg"
              alt=""
              width={1500}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
