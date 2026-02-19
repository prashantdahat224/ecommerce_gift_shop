 import { useEffect, useState } from "react";
 import { useSelector,useDispatch } from "react-redux";  //added
 import { toggleWishlist } from "../redux/wishlistSlice"; //added

import { Outlet,useParams ,useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import share from "../assets/icon_account_share.png";
import icon_whish_list from "../assets/icons_account_heart.png";
import icon_whish_list_clicked from "../assets/icons_heart_black_for_card.png";
  
import Header2 from "../components/HeaderForBack";
import ImageSwiper from "../components/ImageSwiper"; // added
 import ProductDetailsSkeleton from "../components/placeHolder/ProductDetailsPlaceholder";
 import PurchaseNow from "../components/PurchaseNow"
  import FullScreenLoader from "../utils/FullScreenLoader";
  import LoginDialog from "../components/LoginDialog"
   import ProccesMessages from "../components/ProccesMessages";
  

 

export default function ProductDetails() {

  
  const { user, loading } = useSelector((state) => state.auth); //added
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

    const [loading2, setLoading2] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [cartMessage, setCartMessage] = useState(false);//added
    const [message, setMessage] = useState("");//added
    


  const { id } = useParams(); // product id from route
  const [product, setProduct] = useState(null);
  const [purchaseOpen, setPurchaseOpen] = useState(true);
  const [whish_list_clicked, setWhish_list_clicked] = useState(false);
   const navigate = useNavigate();

     const isWishlisted = wishlist.includes( id);


    const openFullImage = (index) => {
      //"/product/:id" 
      //`/product/${product.id}/image/${index}`
    navigate(`/product/${product.id}/image/${index}`);
  };
   
  

  useEffect(() => {

    window.scrollTo(0, 0); //added for scrolling

    const fetchProduct = async () => {

      setLoading2(false);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error){
           setLoading2(false);
         throw error;
        }

        // Convert featured image path to public URL
        let featuredUrl = "";
        let ProductUrl = "";
        if (data.featured_image) {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(data.featured_image);
          featuredUrl = urlData.publicUrl;
        }
        if (data.product_image) {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(data.product_image);
          ProductUrl = urlData.publicUrl;
        }

        // Convert additional images paths to public URLs
        const additionalUrls = (data.additional_images || []).map((imgPath) => {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(imgPath);
          return urlData.publicUrl;

        });

        setProduct({
          ...data,
          featured_image_url: featuredUrl,
          additional_images_url: additionalUrls,
          Product_image_url: ProductUrl,
        });

          
      } catch (err) {

         setLoading2(false);
        console.error("Error fetching product:", err.message);
      }
  
    };
  setLoading2(false);
    fetchProduct();
  }, [id]);

  if (!product) return <ProductDetailsSkeleton />;

  
  // Collect images: featured first, then additional //
  const images = [product.featured_image_url, ...(product.additional_images_url || [])];

  

  
  const shareProduct = async (product) => {
  if (navigator.share) {
    await navigator.share({
      title: product.name,
      text: product.about,
      url:`${product.featured_image}`,
    });
  } else {
    alert("Sharing not supported on this browser");
  }
};

 
    const handlePurchase = ()=>{
         if (!user) {
        
        setShowDialog(true)
    }else{
       setPurchaseOpen(false);
    }

     
      
  }


    const handleAddToCart = async () => {
    setLoading2(true);

     console.log("clicked")
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    if (!user) {
      setLoading2(false);
       setShowDialog(true)
    }else{
        const { data, error } = await supabase
    .from('product_cart')
    .upsert(
      { user_id: user.id, product_id: id },
      {
        onConflict: ['user_id', 'product_id'], // unique columns
        ignoreDuplicates: true               // silently ignore duplicates
      }
    )
    .select();

  if (error) {

    console.error('Error adding to cart:', error.message);
   setMessage("Error in adding to cart, Refresh the page")
    setCartMessage(true);
  } else if (data.length > 0) {
    console.log('Product added to cart:', data);
    setMessage("Product added to cart")
    setCartMessage(true);
  } else {
    console.log('Product already in cart, ignored');
    setMessage("Product already in cart, ignored")
    setCartMessage(true);
  }
    
     }
     setLoading2(false);
  };


    const addToWhishList = async () => {
   // setLoading2(true);

   if (!user.id) {
    setLoading2(false);
       setShowDialog(true)
    return;
   }
    // dispatch(
    //   toggleWishlist({
    //     userId: user.id,
    //     productId: id,
    //   })
    // );
      ///////////////////
      setMessage(
  isWishlisted
    ? "Product removed from wishlist"
    : "Product added to wishlist"
);
setCartMessage(true);

dispatch(toggleWishlist({ userId: user.id, productId: id }))
  .then((action) => {
    if (action.meta.requestStatus === "rejected") {
      // If backend failed, show error
      setMessage("Error updating wishlist. Please refresh.");
      setCartMessage(true);
    }
  });
    //////////////
  //    dispatch(toggleWishlist({ userId: user.id, productId: id }))
  //     .then((action) => {
  //       if (action.meta.requestStatus === "fulfilled") {
  //         if (action.payload.action === "add") {
  //          // toast.success("Added to wishlist");
  //           console.log('Product added to whish list:');
  //   setMessage("Product added to whish list")
  //   setCartMessage(true);
  //         } else {
  //          // toast.info("Removed from wishlist");
  //           console.log('Removed');
  //   setMessage("Product Removed from wishlist")
  //   setCartMessage(true);
  //         }
  //       } else {
  //        // toast.error("There was a problem updating wishlist");
  //        console.error('Error adding to whish list');
  //  setMessage("Error in adding to whish list, Refresh the page")
  //  setCartMessage(true);
  //       }
  //     });
    ////////////////////

     //console.log("clicked")
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

  //   if (!user) {
  //     setLoading2(false);
  //      setShowDialog(true)
  //   }else{
  //       const { data, error } = await supabase
  //   .from('whish_list_products')
  //   .upsert(
  //     { user_id: user.id, product_id: id },
  //     {
  //       onConflict: ['user_id', 'product_id'], // unique columns
  //       ignoreDuplicates: true               // silently ignore duplicates
  //     }
  //   )
  //   .select();

  // if (error) {

  //   console.error('Error adding to whish list:', error.message);
  //  setMessage("Error in adding to whish list, Refresh the page")
  //   setCartMessage(true);
  // } else if (data.length > 0) {
  //   console.log('Product added to whish list:', data);
  //   setMessage("Product added to whish list")
  //   setCartMessage(true);
  // } else {
  //   console.log('Product already in whish list, ignored');
  //   setMessage("Product already in whish list")
  //   setCartMessage(true);
  // }
    
  //    }
  //    setLoading2(false);
  };



  return (
     
    <div className="flex flex-col min-h-screen bg-white font-sans  ">
      {/* Header (sticky) */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <Header2 />
      </header>

         <FullScreenLoader loading={loading2 || loading}
      message=" loading..."/>
      
       <ProccesMessages
              show={cartMessage}
              message={message}
              onClose={() => setCartMessage(false)}
            />
          
      

       <LoginDialog open={showDialog} onClose={() => setShowDialog(false)} />

  {purchaseOpen ?(  <div>
      {/* Image Slider */}
      
       <div className="relative ">
      <ImageSwiper 
        images={images}
        onImageClick={openFullImage}
      />   
        {/* Nested route renders here */}
      <Outlet context={{ images : images}} />
      
        {/* <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow">
          <img src={share} alt="share" className="w-6 h-6"
          onClick={sharePost} 
          />
         
        </button> */}
      </div>
  
    

      {/* Share/Wishlist Button */} 
      <div className="flex gap-4 p-2 mt-4">
        <div className="flex flex-col items-center justify-center ">
          <div 
          onClick={addToWhishList}
          className="border border-gray-300 p-2 rounded-full">

          {(isWishlisted)?(
           <img src={icon_whish_list_clicked} alt="icon_w" className="h-5 w-5 "/>
           ):(
           <img src={icon_whish_list} alt="icon_w" className="h-5 w-5 "/>
           )}

          </div>
        <p className="text-gray-500 rounded text-sm">Add to Whish list</p>
        </div>
        <div className="flex flex-col items-center justify-center ml-4 ">
          <div
          onClick={shareProduct}
           className="border border-gray-300 p-2 rounded-full">
           <img src={share} alt="icon_s" className="h-5 w-5"/></div>
        <p className="text-gray-500 rounded text-sm">Share</p>
        </div>
        </div>

        <hr className="border border-gray-200 mx-3"/>
     
  {/* Product Info */}

      <div className="px-4 space-y-1 mt-4">
        <h1 className="text-base font-semibold tracking-wide">{product.name || ""}</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400">
          {product.about || "nike and jordan"}
        </p>
        <p className="text-xl font-bold mt-4">
          {product.currency || "₹"}
          {product.price || "price not available"}
        </p>
        <p className="text-sm text-green-600">{product.stock || " "}</p>

        {product.description && (<div className="text-sm text-gray-700 leading-relaxed break-words border border-gray-300 rounded-2xl p-4 mt-6">
          <p className="font-bold text-black">Product details</p>

          { product.description || ""}
        </div>
        )}

      </div>

      {/* Sticky Bottom Buttons */}
      <div className="sticky bottom-0 flex w-full bg-white ml-0.5 mt-4">
        <button 
        onClick={handleAddToCart}
        className="flex-1 py-3 border border-[#ffd912] bg-white text-black font-bold text-sm hover:bg-gray-300 transition mb-2">
          Add to Cart
        </button>
        <button
        onClick={ handlePurchase} 
         className="flex-1 py-3 bg-[#ffd912] text-black font-bold text-sm hover:opacity-90 transition mb-2">
          Buy Now
        </button>

        
      </div>

       
    </div>)
          :
        (
          (<div>
          <PurchaseNow
        product={product}
        userId={user.id}/>
        </div>)
        )
        
        
        }

    </div>
     
  );
}
