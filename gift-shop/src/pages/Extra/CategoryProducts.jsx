import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom"; 
import { useParams } from "react-router-dom";


import Header from "../../components/homeComponents/Header";
import SearchBar from "../../components/homeComponents/SearchBar";
import OfferPoster from "../../components/homeComponents/OfferPoster";
import ProductList from "../../components/homeComponents/ProductList";
import BottomNavigation from "../../components/BottomNavigation";
import OfferPosterPlaceholder from "../../components/placeHolder/OfferPosterPlaceholder"
import CategoryBar from "../../components/homeComponents/CategoryBar";
import CategoryProductList from "../../components/homeComponents/CategoryProductList";

  
function CategoryProducts() {


const { categoryId} =useParams();
const navigate = useNavigate();  
const [value,setValue]=useState(null);

//console.log("useParams",useParams())
  
  
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

     
      <div className="sticky top-14 z-40 bg-white px-4 sm:px-6 lg:px-8">
        <SearchBar 
          
          onFocus={() => navigate("/Search")}
    
         />
      </div >
         


      <div className="mt-1">
           
          <CategoryBar 
           cat_id={true}
           onChange={setValue}
           />

      </div>
 
   <div>
    
   </div>
  
       {/* <div className="mt-2">
       (<OfferPoster className="top-20" />)
</div>  */}

       <div className="mt-7">
      
       {value ? (<CategoryProductList
       categoryId={value}
       />): 
       (<CategoryProductList
       categoryId={categoryId}
       />)}
       
      </div>

      <div className="h-26">
        <BottomNavigation 
         
        />
      </div>
    </div>
  );
}

export default CategoryProducts;
