import React from "react";
import icon1 from "../assets/icon_whatsapp.png"
import icon2 from "../assets/icon_square.png"
import { useState,useEffect } from "react";
import { supabase } from "../supabaseClient";
import FullScreenLoader from "../utils/FullScreenLoader";


export default function PurchaseNow({ product,userId }) {

   const [phoneNumber, setPhoneNumber] = useState(null);
       const [loading, setLoading] = useState(false);
 
 
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
            setPhoneNumber(data.phone_number);
          }
          setLoading(false);
        };
    
        fetchAdminNumber();
      }, []);


  const shareOnWhatsApp = () => {
      //   placeOrder();
     
    //const url = `https://giftalaxy.netlify.app/.netlify/functions/index?id=${product.id}&v=${Date.now()}`;
    const url = `https://gift-shop-new.netlify.app/product/${product.id}`;//&v=${Date.now()}
    const text = `hey, I want this gift: ${url}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`,"_blank");

       //https://giftalaxy.com/product/564ce3a4-4511-4365-9033-c826ade140b8
       

  };
  const AskOnWhatsApp = () => {
       
    const url = `https://gift-shop-new.netlify.app/product/${product.id}`; //&v=${Date.now()}
    const text = `hey, I want to ask something about this product: ${url}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");

  };

  const placeOrder =async () =>{

     try {
      setLoading(true);
      // 2️⃣ Generate unique order code
      const orderCode = "ORDER-" + Math.floor(Math.random() * 1000000);

      // 3️⃣ Insert new order row in single table
      const { data, error } = await supabase.from("orders").insert([
        {
          order_code: orderCode,
          user_id: userId,
          product_id: product.id,
          product_name: product.name,
          product_image: product.product_image,
          quantity: 1, // or select from UI
          status: "pending",
          product_code:product.product_code,
          created_at:new Date(),

        },
      ]);

      if (error) throw error;

      alert("Order placed successfully! Order code: " + orderCode);
    } catch (err) {
            setLoading(false);
      console.error(err);
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
     setLoading(false);
  }

   return (
     
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                 <FullScreenLoader loading={loading}
      message=" loading..."/>
            {console.log("phoneNumber",phoneNumber)}
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
           {false && (<p>"Where quality meets reliability</p>)}
           <div className="absolute">
         <span className="top-4 left-4 bg-green-600 text-white
                text-xs font-semibold px-3 py-1 rounded-full shadow ">
              Trusted Seller 
            </span>
            </div>
          {/* Content */}
          <div className="mt-5">
           
           
          <div className="p-5">
           
         

            <div className="flex gap-4" >
              <div >
                
             {/* Image */}
          <div className="relative">
                     

 

           {!(product.Product_image_url==="") &&(
            
             <img
              src={product.Product_image_url} 
              alt={product.name}
              className="w-25 h-25 object-cover rounded"
            />)}
           </div>
             </div>
             
            <div>
             <h2 className=" font-semibold text-gray-900">  {/*tracking-tight */}
              {product.name}
            </h2>
 
            <p className="text-gray-600   text-sm leading-relaxed">
              {product.about || ""}
            </p>
 
             
             </div>
 
             </div>

             
              <hr className="border border-gray-300 my-2" />

               <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-semibold text-gray-900">
                ₹{product.price}
              </p>
              {true && (<span className="text-xs text-gray-500">
                Cash on Delivery Available
              </span>)}
            </div>
 
 
            {/* Buttons */}
             {((!loading)) && (       // && (!phoneNumber)
            <div className="mt-2 flex flex-col gap-3">
    
    
     {/* <a
      href={shareOnWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="border-4 border-green-600 flex items-center justify-center gap-3  hover:bg-gray-200 text-green-600
      font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
    >
     <img src={icon1} className="h-9 w-9 mr-2"/>
      Order by WhatsApp
    </a>
 
    <a
     // href={infoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 bg-gray-200 hover:bg-gray-200 text-gray-800 font-medium py-3.5 rounded-xl transition"
    >
       
      Ask a Question on WhatsApp
    </a> */}
    <div className="mt-2 flex flex-col gap-3">
  <button
    onClick={shareOnWhatsApp}
    className="border-4 border-green-600 flex items-center justify-center gap-3 hover:bg-gray-200 text-green-600
    font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
  >
    <img src={icon1} className="h-9 w-9 mr-2" />
    Order by WhatsApp
  </button>

  <button
    onClick={AskOnWhatsApp}
    className="flex items-center justify-center gap-3 bg-gray-200 hover:bg-gray-200 text-gray-800 font-medium py-3.5 rounded-xl transition"
  >
    Ask a Question on WhatsApp
  </button>
</div>

    
            </div>
             )}

      {/* Buttons */}
 
          </div>
          </div>
 
          {/* Trust Section */}
          <div className="border-t border-gray-400 p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Customers Trust Us Because
            </h3>
 
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li className="flex"><img src={icon2} className="h-5 w-5 mr-2"/> Trusted by many users and growing community</li>
              <li className="flex"><img src={icon2} className="h-5 w-5 mr-2"/> Secure ordering via WhatsApp</li>
              <li className="flex"><img src={icon2} className="h-5 w-5 mr-2"/> Fast & reliable delivery</li>
              <li className="flex"><img src={icon2} className="h-5 w-5 mr-2"/> Cash on Delivery available</li>
              <li className="flex"><img src={icon2} className="h-5 w-5 mr-2"/> Friendly support – ask anything</li>
              <li className="flex"><img src={icon2} className="h-5 w-5 mr-2"/> 24/7 Whatsapp support </li>
            </ul>
 
 
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              We’re here to help you every step of the way.  
              Chat with us on WhatsApp for instant support, secure ordering,
              and reliable doorstep delivery.
            </p>
          </div>
        </div>
      </div>
    );
}

