import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom"; 


import Header from "../components/homeComponents/Header";
import SearchBar from "../components/homeComponents/SearchBar";
import OfferPoster from "../components/homeComponents/OfferPoster";
import ProductList from "../components/homeComponents/ProductList";
import BottomNavigation from "../components/BottomNavigation";
import OfferPosterPlaceholder from "../components/placeHolder/OfferPosterPlaceholder"
import CategoryBar from "../components/homeComponents/CategoryBar";
import CategoryProductList from "../components/homeComponents/CategoryProductList";

  
function Home() {


  const [loading, setLoading] = useState(true);
  const [clicks, setclicks] = useState(false);
  const navigate = useNavigate();  

  //  useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);  

  //   return () => clearTimeout(timer);
  // }, []);

 

  return (
    
    <div className="bg-white min-h-screen pb-20">
      
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      
      <div className="sticky top-0 z-50">
        <p onClick={()=>navigate("/TestingPage")}>tesing page </p>
      </div>
          
          
     
      <div className="sticky top-14 z-40 bg-white px-4 sm:px-6 lg:px-8">
        <SearchBar 
          
          onFocus={() => navigate("/Search")}
    
         />
      </div >
         
{/* <button
        onClick={() => navigate("/TestingPage")}
        className="border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       admin GUIDE
      </button> */}

      <div className="mt-1">
           
          <CategoryBar/>

      </div>
 
   <div>
    
   </div>
  
       <div className="mt-2">
       <OfferPoster className="top-20" />
</div> 

       <div className="mt-7">
       
      <ProductList />   
      
      </div>

      <div className="h-26">
        <BottomNavigation />
      </div>
    </div>
  );
}

export default Home;
