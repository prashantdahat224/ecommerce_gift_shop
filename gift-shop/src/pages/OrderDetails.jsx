// src/pages/OrderPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function OrderDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("product_order")
        .select("*")
        .eq("product_id", productId)
        .single();

      if (error) {
        console.error(error);
      } 
      //////////////////////////////////////
      else {
        setOrder(data);
      }
          //////////////////////////////////////
      setLoading(false);
    };

    fetchOrder();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">

        {/* Product Card */}
        <div
          onClick={() => navigate(`/product/${order.product_id}`)}
          className="cursor-pointer hover:shadow-md transition rounded-lg p-1"
        >
          <img
            src={order.product_image}
            alt={order.product_name}
            className="w-20 h-20 object-cover rounded-lg"
          />

         <div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {order.product_name}
          </h2>
          <button className="text-blue-600 border border-blue-600 p-1 rounded">Go to product details</button>
          </div>


        </div>
<hr className="border-gray-500 my-6" />
        {/* Track Order Button */}
        <button
          onClick={() => navigate(`/OrderTracking/${order.id}`)}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Track Order
        </button>
        <hr className="border-gray-500 my-6" />
         <button 
        onClick={()=>navigate("/HelpCenterPage")}
           className="mt-6 p-2 border border-gray-400 text-black text-sm font-semibold  rounded-lg hover:bg-blue-700 transition"
        >
          Need help 
        </button  >

      </div>
    </div>
  );
}
