import React from "react";
import { useNavigate } from "react-router-dom";
import back from "../assets/icon_download_back.png";


const SettingsPage = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logOut");
  };

  return (

    <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 ">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
              <p className="text-xl font-semibold "> Log Out  </p>
            </div>
            <hr />
          </div>
   

    <div className="flex flex-col min-h-screen  bg-gray-100">
      {/* <h2 className="text-2xl font-semibold mb-6">Settings</h2> */}

      {/* Add other settings options here */}
       
        
      <div className="mt-50 text-center">
        <button
          onClick={handleLogout}
          className="mb-15 px-4 py-2 border border-red-500 text-red-500 rounded-md"
        >
          Log Out
        </button>
      </div>
    </div>

    </div>
  );
};

export default SettingsPage;
