import React from "react";
import searchIcon from "../../assets/search.png";  
import backIcon from "../../assets/icon_download_back.png";
 
//checked / database

const SearchBar = ({

   search, setSearch, 
   onFocus
   ,isSearchOpen,onBack
   }) => {

     
  return (
    <div>
    <div className="w-full flex items-center gap-2"> 


     {/* Back Arrow (outside search bar) */}
       {isSearchOpen && (
        <img
          src={backIcon}
          alt="Back"
          className="w-10 h-10 cursor-pointer bg-gray-100 rounded-full shadow-md p-1"
          onClick={onBack}
        />
      )} 
   
      <div className="
        flex items-center 
        flex-1  
        bg-[#f8f7f5] rounded-full shadow     
        transition-all duration-300 
        hover:shadow-lg focus-within:shadow-lg border border-[#bcb8ab]
      ">
        {/* Search Icon */}
        <img
          src={searchIcon}
          alt="Search Icon"
          className="w-5 h-5 ml-3 text-gray-400"
        />

        {/* Input Field */}

         
         <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={onFocus}
          placeholder="Search products (e.g., luxury, etc.)..."
          className="
            flex-1 px-3 py-2 
            bg-transparent text-gray-700 placeholder-[#bcb8ab] 
            text-base sm:text-base text-gray-700
            focus:outline-none rounded-full 
            transition-all duration-300 
            focus:px-4
          "
        /> 
        
        
      
      


      </div>
      
      
    </div>
    <div className="h-2" /> {/* Spacer */}
      </div>
  );
};

export default SearchBar;
