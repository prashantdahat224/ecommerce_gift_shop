import { useEffect, useState,useRef   } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
 
import BottomNavigation from "../components/BottomNavigation";
import Placeholder from "../components/placeHolder/PlaceholderAccount";

import order from "../assets/icons_account_order_box.png";
import wishlist from "../assets/icons_account_heart.png";
import settings from "../assets/icon_account_setting.png";
import helpCenter from "../assets/icons_account_headset.png";
import userIcon from "../assets/icon_account_user.png";
import back from "../assets/icon_download_back.png";
import { useSelector } from "react-redux";
 

    
function Account() {

 const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetched = useRef(false); // ensures fetch happens only once

  

  

  const navigate = useNavigate();

   useEffect(() => {

     if (!user?.id || fetched.current) return; 
    
      console.log("fetched",fetched.current )


    const fetchProfile  = async () => {

      const controller = new AbortController();
            setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();



      if (!error) {
        setProfile(data); 
        fetched.current=true;
        // can be null or {}
      }

      setLoading(false);
    };

     if (user) {
      fetchProfile();
    }


 
     
  }, [user]);

 

  //  Placeholder while fetching
  if (loading) { return <Placeholder />;}


   

  const items = [
    { icon: order, label: "Orders", path: "/OrdersPage" },
    { icon: wishlist, label: "Wishlist", path: "/ProductWhishList" },
    { icon: settings, label: "Settings", path: "/settings" },
    { icon: helpCenter, label: "Help Center", path: "/HelpCenterPage" },
  ];


  
    return (
    <div className="bg-white min-h-screen flex flex-col">
      
    <div className="flex-1 overflow-y-auto">


      {/* Header */}
      <header className="flex items-center h-14 px-4 border-b border-gray-200">
        <h1 className="flex items-center gap-3 text-left text-lg font-medium text-gray-900">
          <img
            src={back}
            alt="Back"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          />
          <span>Account</span>
        </h1>
        <div className="w-8" />
      </header>

      {/* Greeting */}
      <div className="text-left mt-6">
        <h2 className="text-base font-normal text-gray-900 ml-4">
          Hello, {profile.name || ""}
        </h2>
        
      </div>

       
     
      <div className="grid grid-cols-2 gap-4 px-6 mt-8">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => navigate(item.path)}   // navigate on click  
          className="flex flex-col items-center justify-center border border-gray-400 rounded-md py-3 hover:bg-gray-100 transition"
        >
          <img src={item.icon} alt={item.label} className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium text-gray-800">
            {item.label}
          </span>
        </button>
      ))}
    </div>


     {/* Menu Buttons */}



      <hr className="border-gray-300 my-6" />

      {/* Profile Section */}
      <div className="ml-4 flex space-x-4">
        <img
          src={userIcon}
          className="w-12 h-12 rounded-full border-3 border-gray-300"
        />

        <div className="flex flex-col space-y-6">
          {/* Name */}
          {(profile?.name)? (
            
            <div>
               <span 
               onClick={()=>navigate("/EditProfile")}
               className="text-base" >{profile.name || "no name"}</span>
      <hr className="border-gray-400 mt-1" />

            </div>
          ) : (
            <div>
              <input
               // value={name}
               // onChange={(e) => nav(e.target.value)}
               onClick={()=> navigate("/EditProfile")}
                placeholder="Enter your name"
                className="border px-3 py-2 rounded "
              />
               
            </div>
          )}

          {/* Number */}
          {/* {(profile?.number || !(profile?.number.trim() ==="")) ? ( */}
          {(profile?.number && (profile.number.trim() !=="")) ? (
            <div>
              <span 
               onClick={()=>navigate("/EditProfile")}
              className="text-gray-600 text-base">{profile.number || "no number"}</span>
                <hr className="border-gray-400 mt-1" />

            </div>
          ) : (
            <div>
              <input
               // value={number}
                type="text"
               // onChange={(e) => setNumber(e.target.value)}
               onClick={()=>navigate("/EditProfile")}
                placeholder="Enter your phone number"
                className="border px-3 py-2 rounded"
              />
              
            </div>
          )}
          
          {(profile.name && profile.number) &&
          (<button className="bg-gray-200 hover:bg-gray-400 text-black font-semibold px-6 py-2 rounded text-sm"
           onClick={() => navigate("/EditProfile")}>
            Edit profile
          </button>
          )}


        </div>
         
      </div>

         
      <hr className="border-gray-300 my-6" />

      {/* Admin Panel */}
      {profile.role === "admin" && (
        <div className="mt-10 px-6">
           <h3 className="text-lg font-semibold mb-4">Admin Panel 🛠️</h3>
          <div
            className="border rounded-md p-4 bg-gray-200"
            onClick={() => navigate("/AdminPassword")}
          >
            <p>Manage users, products, and settings here ➡</p>
            <p className="text-xs">hope you got the permision from @JAYPRAKASH & @PRASHANT</p>
          </div>
        </div>
      )}

</div>
    <div className="h-26">
      <BottomNavigation />
      </div>
    </div>
  ); 

 

}

export default Account;