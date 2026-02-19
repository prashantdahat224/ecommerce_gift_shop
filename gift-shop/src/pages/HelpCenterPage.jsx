import React from "react";
import icon1 from "../assets/icon_whatsapp.png"
import FullScreenLoader from "../utils/FullScreenLoader";
import back from "../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { supabase } from "../supabaseClient";


const HelpCenterPage = () => {

     const [phoneNumber, setPhoneNumber] = useState(null);
   const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

  //const phoneNumber = "919876543210"; // country code + number
  const message = "Hi, I need help with my order.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent( message)}`;
 
  
     useEffect(() => {
    const fetchAdminNumber = async () => {
        setLoading(true);
      const { data, error } = await supabase
        .from("admin_details")
        .select("phone_number")
        .eq("role", "admin_priority_1")
        .single();

      if (error) {
        setLoading(false);
        console.error("Error fetching admin number:", error);
      } else {
         setLoading(false);
        setPhoneNumber(data.number);
      }
      setLoading(false);
    };

    fetchAdminNumber();
  }, []);

  return (

     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-2">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />


            <h1 className="text-lg font-semibold"> Help center </h1>
            </div>
            <hr />
          </div>

    <div className="min-h-screen bg-gray-50 flex mt-10 justify-center px-4">

   <FullScreenLoader loading={loading}
      message=" loading..."/>


      <div className="bg-white max-w-md w-full rounded-2xl  p-6 text-center">
        
        <p 
        className="text-2xl font-bold text-gray-800 mb-2"
        
        >
          Help Center
        </p>
        

        <p className="text-gray-600 mb-6">
          Need help with your order, payment, or delivery?  
          Our support team is here for you.
        </p>

        {((!loading) && (!phoneNumber)) && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 text-green-500 font-semibold py-3 px-6 rounded-xl transition border border-gray-400"
        >
          <img
            src={icon1}
            alt="WhatsApp"
            className="w-6 h-6"
          />
          Ask on WhatsApp
        </a>
        )}


      </div>
    </div>
     </div >
  );
};

export default HelpCenterPage;
