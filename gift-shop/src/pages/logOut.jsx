import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice";
import { clearUserData } from "../redux/userDataSlice";



const LogoutPage = () => {

  const navigate = useNavigate();

   const dispatch = useDispatch();


    const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    //dispatch(clearUser())
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      // Redirect to login page after successful logout
      navigate("/EmailLogin");
     
    dispatch(clearUser());//added
    dispatch(clearUserData());//added
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover"
          >
            Yes, Log Out
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
