import React from "react";
import icon1 from "../assets/icon_whatsapp.png"
import FullScreenLoader from "../utils/FullScreenLoader";
import back from "../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { supabase } from "../supabaseClient";
import BottomNavigation from "../components/BottomNavigation";


const AskUs = () => {

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
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We Are a Trusted Platform Delivering the Best Products for You
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white"> {/*text-blue-100 */}
           So many customers trust us for quality, reliability, and
            exceptional service.
          </p>
          
           
          
            {((!loading) && (!phoneNumber)) && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white flex items-center justify-center gap-3 text-green-600 font-semibold py-3 px-6 rounded-xl transition "
              >
                <img
                  src={icon1}
                  alt="WhatsApp"
                  className="w-6 h-6"
                />
                Tell us on WhatsApp
              </a>
              )}

                 <FullScreenLoader loading={loading}
      message=" loading..."/>

        </div>
      </section>

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow">
          <h2 className="text-3xl font-bold text-center  ">
            Tell Us What Product You Need
          </h2>
      </div>
      

       
      {/* Why Choose Us */}
      <section className="py-6 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Premium Quality",
              desc: "We ensure top quality products sourced from trusted suppliers."
            },
            {
              title: "Fast & Secure Delivery",
              desc: "Quick shipping with complete tracking and safe packaging."
            },
            {
              title: "24/7 Customer Support",
              desc: "Our team is always available to help you anytime."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      {/* <section className="bg-white py-16 px-6 border-t">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-blue-600">10K+</h2>
            <p className="text-gray-600 mt-2">Happy Customers</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-blue-600">5K+</h2>
            <p className="text-gray-600 mt-2">Products Delivered</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-blue-600">99%</h2>
            <p className="text-gray-600 mt-2">Positive Feedback</p>
          </div>
        </div>
      </section> */}

      {/* Product Request Form */}
      {/* <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">
            Tell Us What Product You Need
          </h2>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Describe Your Requirement
              </label>
              <textarea
                rows="4"
                placeholder="Tell us more about what you're looking for..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
          </form>
        </div>
      </section> */}
 <div className="h-26">
      <BottomNavigation />
      </div>
    </div>
    
  );
};

export default AskUs;
