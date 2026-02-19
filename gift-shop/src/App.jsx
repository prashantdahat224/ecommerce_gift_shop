import React from "react";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"; //BrowserRouter as Router//added

import { useEffect } from 'react'; //added
import { supabase } from './supabaseClient'; //added

import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./redux/authSlice";

import ProtectedRoute from "./routes/ProtectedRoute";



import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import EmailLogin from "./pages/EmailLogin";
import EmailRegistration from "./pages/EmailRegistration";
import AdminOption from "./pages/AdminOption";
import AdminPassword from "./pages/AdminPassword";
import OfferPosterUpload from "./pages/Admin/OfferPosterUpload";
import TestingPage from "./pages/TestingPage";
import EditProfile from "./pages/EditProfile";
import ProductPostUpload from "./pages/Admin/ProductPostUpload";
import ProductDetails from "./pages/ProductDetails";
import EditProductPosts from "./pages/Admin/EditProductPost";
import EditProductDetails from "./pages/Admin/EditProductDetails";
 
import Settings from "./pages/Settings";
import LogOut  from "./pages/logOut";
import LogOutButton  from "./pages/logOutButton";


import AdminProductSearch from "./pages/Admin/AdminProductSearch";
import DeleteProductPost from "./pages/Admin/DeleteProductPost";
import Search from "./pages/Search"
import OfferPage from "./pages/Admin/offerPage";
import WishListPage from "./pages/WishListPage";
import ImagePreview from "./components/FullSizeImage";
import Manage_category from "./pages/Admin/Manage_category";
import ManageKeywords from "./pages/Admin/ManageKeywords";
import ManageImageCategory from "./pages/Admin/ManageImageCategory";
import ManageTrendingKeywords from "./pages/Admin/ManageTrendingKeywords";
import SearchProductID from "./pages/Admin/SearchProductID";

import CategoryProducts from "./pages/Extra/CategoryProducts";
import AdminDetailsPage from "./pages/Admin/AdminDetailsPage";
import AdminSelect from "./pages/Admin/AdminSelect";
import HelpCenterPage from "./pages/HelpCenterPage";
import CategoriesPage from "./pages/CategoriesPage";
import OrdersPage from "./pages/OrdersPage";
import AskUs from "./pages/AskUs";
 
import EditKeywordAndCategory from "./pages/Admin/EditKeywordAndCategory";
import AdminProfilePassword from "./pages/Admin/AdminProfilePassword";
import EditOrder from "./pages/Admin/EditOrders";
import EditOrderDetailsPage from "./pages/Admin/EditOrdeDetailsPage";
import EditOrderTracking from "./pages/Extra/EditOrderTracking";
import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./pages/OrderTracking";
import ProductCartNew from "./pages/ProductCartNew";
import ProductWhishList from "./pages/ProductWhishList";
import { fetchWishlist } from "./redux/wishlistSlice";
  
 

 
function App() {

      const dispatch = useDispatch();

      
      /////////////////
      useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      dispatch(setUser(data?.session?.user || null));
    });

    // Listen auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          dispatch(setUser(session.user));
           dispatch(fetchWishlist(session.user.id)); //added
        } else {
          dispatch(clearUser());
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

      /////////////////

    

  return (
    
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/home/*" element={<Home />} /> {/*//added*/}
        
               {/*//added*/}
       
        <Route path="/" element={<Home />} /> 
        <Route path="/Search" element={<Search />} /> 
       
    


      <Route path="/product/:id" element={<ProductDetails />} >
          <Route path="image/:imageIndex" element={<ImagePreview 
          key={location.pathname}/>} />

         

     </Route>

     <Route path="/product/:id" element={<ProductDetails />} ></Route>


     <Route path="/editKeywordAndCategory/:productId" element={<EditKeywordAndCategory />} /> 

      <Route path="/cart" element={<Cart />} />

      <Route path="/Admin/Manage_category" element={<Manage_category />} />
      <Route path="/Admin/ManageKeywords" element={<ManageKeywords />} />
      <Route path="/Admin/AdminProfilePassword" element={<AdminProfilePassword />} />
      <Route path="/Admin/EditOrder" element={<EditOrder />} />

      <Route path="/ManageImageCategory/:productId" element={<ManageImageCategory />} />
      <Route path="/CategoryProducts/:categoryId" element={<CategoryProducts />} />
  
      <Route path="/Admin/ManageTrendingKeywords" element={<ManageTrendingKeywords />} />
      <Route path="/Admin/SearchProductID" element={<SearchProductID />} />

      <Route path="/Admin/AdminDetailsPage" element={<AdminDetailsPage />} />
      <Route path="/Admin/AdminSelect" element={<AdminSelect />} />
      <Route path="/HelpCenterPage" element={<HelpCenterPage />} />
      <Route path="/CategoriesPage" element={<CategoriesPage />} />
      <Route path="/ProductCartNew" element={<ProductCartNew />} />
      <Route path="/ProductWhishList" element={<ProductWhishList />} />
      <Route path="/OrdersPage" element={<OrdersPage />} />
      <Route path="/AskUs" element={<AskUs />} />
         
      

        
      <Route path="/account" element={

      
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
     
        
        } /> 


      <Route path="/EmailLogin" element={<EmailLogin />} /> 
      <Route path="/EmailRegistration" element={<EmailRegistration />} /> 
      <Route path="/AdminOption" element={<AdminOption/>} /> 
      <Route path="/AdminPassword" element={<AdminPassword />} /> 
      <Route path="/Admin/OfferPosterUpload" element={<OfferPosterUpload />} /> 
      <Route path="/TestingPage" element={<TestingPage />} />

      <Route path="/Settings" element={<Settings />} />
      <Route path="/logOut" element={<LogOut />} />
      <Route path="/logOutButton" element={<LogOutButton />} />
 
      <Route path="/EditProfile" element={<EditProfile />} />
      <Route path="/Admin/ProductPostUpload" element={<ProductPostUpload />} />
      <Route path="/admin/EditProductPost" element={<EditProductPosts />} /> 
      <Route path="/admin/AdminProductSearch" element={<AdminProductSearch />} /> 

      <Route path="/admin/edit-products" element={<EditProductPosts />} />  
      <Route path="/admin/product/:id" element={<EditProductDetails />} />
      <Route path="/admin/EditOrderDetailsPage/:orderId" element={<EditOrderDetailsPage />} />
      <Route path="/admin/Extra/EditOrderTracking/:orderId" element={<EditOrderTracking />} />
      <Route path="/OrderDetails/:orderId" element={<OrderDetails />} />
      <Route path="/OrderTracking/:orderId" element={<OrderTracking />} />
  
     <Route path="/admin/select-for-delete" element={<AdminProductSearch />} />
     <Route path="/admin/delete-product/:id" element={<DeleteProductPost />} />
     <Route path="/:offerId" element={<OfferPage />} />

      <Route path="/Admin/Offers" element={<OfferPage />} />
      <Route path="/wishlist" element={<WishListPage />} />

      
       
  
 
    </Routes>
  );
}

export default App;
