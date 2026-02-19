import icon2 from "../assets/icons_heart_black_for_card.png"; 
 import {  useState } from "react";

import icon from "../assets/icons_plus_ad_to_cart.png";
import LazyImage from "./placeHolder/lazyImage";
import { Link } from "react-router-dom";
import { getPublicImage } from "./getPublicImage";
import { supabase } from '../supabaseClient';

import { useSelector } from "react-redux";
import ProccesMessages from "./ProccesMessages";
import LoginDialog from "../components/LoginDialog"





function ProductCard({ product }) {



  const { user, loading } = useSelector((state) => state.auth);

  const imageUrl = getPublicImage(product.product_image || "");
   const [cartMessage, setCartMessage] = useState(false);//added
      const [message, setMessage] = useState("");//added
          const [showDialog, setShowDialog] = useState(false);
      
    
   
 
  //  const handleWishlist = async () => {
   
  //   const { error } = await supabase
  //     .from('wishlist')
  //     .upsert({ user_id: user.id, product_id: product.id })
  //     .select();

  //   if (error) console.error('Supabase error:', error.message);
  // };

   const handleAddToCart = async () => {
 //   setLoading2(true);
       
    // console.log("clicked")
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    if (!user) {
     // setLoading2(false);
       setShowDialog(true)
    }
    
    else{

      if(user?.id ){
         const { data, error } = await supabase
    .from('product_cart')
    .upsert(
      { user_id: user?.id, product_id: product.id  },
      {
        onConflict: ['user_id', 'product_id'], // unique columns
        ignoreDuplicates: true               // silently ignore duplicates
      }
    )
    .select();

  if (error) {

   // console.error('Error adding to cart:', error.message);
   setMessage("Error in adding to cart, Refresh the page")
    setCartMessage(true);
  } else if (data.length > 0) {
   // console.log('Product added to cart:', data);
    setMessage("Product added to cart")
    setCartMessage(true);
  } else {
   // console.log('Product already in cart, ignored');
    setMessage("Product already in cart, ignored")
    setCartMessage(true);
  }
    }
     }
    // setLoading2(false);
  };



  

  return (
    <div>
      
      {/* <button onClick={()=>setCartMessage(true)}> </button> */}

    <Link to={`/product/${product.id}`}>
    <div className="w-full h-67 rounded-xl border border-neutral-200 bg-white overflow-hidden lg:max-w-[220px]">
      
    

      {/* IMAGE */}
      <div className="relative w-48 h-47 bg-neutral-100">
        {imageUrl? (( <LazyImage
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          
         />)):( 
           <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded ">
          <p className="text-sm text-gray-500 text-center">No Image</p>
                  </div>
         )} 
    
      </div>
 
      {/* CONTENT */}
      <div className="ml-1 p-1">
       
        {/* TITLE */}
        <h3 className="text-sm text-neutral-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* CATEGORY */}
        <p className="text-[11px] uppercase tracking-widest text-neutral-400">
          {product.about || ""}
        </p>

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              ₹{product.price}
            </span>
      
             
          </div>

          {/* PRICE RIGHT BUTTON */}
          {/* <button
          onClick={ handleWishlist}
          className="h-7 w-7 rounded-full border border-neutral-200 bg-white flex items-center justify-center">
              <img src={icon} className="h-4 w-4" />
           </button> */}
           
         
<LoginDialog open={showDialog} onClose={() => setShowDialog(false)} />
                            <ProccesMessages
                                          show={cartMessage}
                                          message={message}
                                          onClose={() => setCartMessage(false)}
                                        />
        
                           

        </div>
       
      </div>
    </div>
</Link>
       <div className="relative ">
 <button
          onClick={handleAddToCart}
          
          className="h-7 w-7 absolute bottom-2 right-2  rounded-full border border-neutral-200 bg-white flex items-center justify-center">
               <img src={icon} className="h-4 w-4"/> 
           </button>
            </div>
 </div>
          

    

   
     
  );
}

export default ProductCard;
