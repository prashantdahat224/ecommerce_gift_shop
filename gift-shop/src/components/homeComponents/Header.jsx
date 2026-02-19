import React from "react";
//import logo from "../../assets/logo.png";       // App logo PNG
//import searchIcon from "../../assets/icons_downloaded_heart_default.png"; // Action icon PNG
import searchIcon from "../../assets/icons_downloaded_heart_clicked.png"; // Action icon PNG
//import cartIcon from "../../assets/icons_downloaded_cart_default.png";     // Action icon PNG
import cartIcon from "../../assets/icons_downloaded_cart_clicked.png";     // Action icon PNG
import { useNavigate } from "react-router-dom";
//checked /database//no db

//////////

const Header = () => {
 
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-black">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          {/* <img
           
            src={logo}
            alt="App Logo"
            className="h-10 w-auto sm:h-12 object-contain"
          /> */}
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={()=>navigate("/ProductWhishList", { replace: true })}
            className="p-2 rounded-md hover:bg-gray-100 transition">
            <img src={searchIcon} alt="Search" className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
          <button 
          onClick={()=>navigate("/ProductCartNew", { replace: true })}
          className="p-2 rounded-md hover:bg-gray-100 transition">
            <img src={cartIcon} alt="Cart" className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>
      </div>
    </header>
  );
};

//////////////



export default Header;
