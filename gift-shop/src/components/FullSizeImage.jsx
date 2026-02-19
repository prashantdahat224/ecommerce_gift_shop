import React from "react";
import { useParams,useNavigate,useOutletContext } from "react-router-dom";

const FullSizeImage = () => {
  const navigate =useNavigate();
  const {images} = useOutletContext() || {};
    if (!images) return null;  
      const { imageIndex} =useParams();

 
  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-70 flex flex-col items-start justify-center z-50 p-4"
      onClick={()=>navigate("/ProductDetails")} // click outside closes modal
    >
      {/* Close button at the top-left, outside the image */}
      <button
        onClick={()=>navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded text-sm"
      >
        Close
      </button>

      <div
        className="relative w-full flex justify-center"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
      >
        <img
          src={images[imageIndex]}
          alt="Full size"
          className="max-w-full max-h-screen rounded shadow-lg"
        />
      </div>
    </div>
  );
};

export default FullSizeImage;
