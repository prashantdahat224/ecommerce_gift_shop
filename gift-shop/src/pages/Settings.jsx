import React from "react";
import { useNavigate } from "react-router-dom";
import back from "../assets/icon_download_back.png";


const SettingsPage = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logOutButton");
  };

  return (

    <div className=" ">
          {/* HEADER */}
          <div className="top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 ">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
              <p className="text-xl font-semibold "> Settings  </p>
            </div>
            <hr />
          </div>
   

    <div className="flex flex-col min-h-screen  ">
      {/* <h2 className="text-2xl font-semibold mb-6">Settings</h2> */}

      {/* Add other settings options here */}
      <div> 
        <p className="p-2 mt-4 font-semibold w-20"
        onClick={handleLogout}

        > Log out 
             </p>
              <hr className="border-gray-400  mt-1" />

            </div>
            
        
       
    </div>

    </div>
  );
};

export default SettingsPage;
