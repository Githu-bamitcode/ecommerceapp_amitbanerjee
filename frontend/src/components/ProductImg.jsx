import React, { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images[0].url);
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex md:flex-col gap-3 overflow-x-auto">
        {images.map((img) => {
          return (
            <img
              onClick={() => setMainImg(img.url)}
              src={img.url}
              alt=""
              className="cursor-pointer w-16 h-16 sm:w-20 sm:h-20 border shadow-lg object-cover shrink-0"
            />
          );
        })}
      </div>

      {/* Main Image */}
      <div className="w-full overflow-hidden">
        <Zoom>
          <img
            src={mainImg}
            alt=""
            className="w-full max-w-full h-auto border shadow-lg rounded-lg object-contain"
          />
        </Zoom>
      </div>
    </div>
  );
};

export default ProductImg;
