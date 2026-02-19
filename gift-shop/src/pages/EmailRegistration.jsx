// src/pages/EmailRegistration.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";   // ✅ Supabase client
import back from "../assets/icon_download_back.png";


import logo from "../assets/logo.png";       // App logo PNG
import { getErrorMessage } from "../components/errorMessages"; // Import the error message utility

import { useNavigate, useLocation } from "react-router-dom";  //addd
import { useDispatch } from "react-redux";  //addd
import { setUser } from "../redux/authSlice"; //addd
 import FullScreenLoader from "../utils/FullScreenLoader";
//checked / database

const EmailRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); //added
  const [error, setError] = useState("");
  const navigate = useNavigate();
   const location = useLocation();
   const dispatch = useDispatch();

   const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
      
    setLoading(true);
    try {
      // ✅ Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setLoading(false);
        setError(getErrorMessage(signUpError.message));
        return;

      }
     


      const user = data?.user;
      if (user) {
        // ✅ Save user info in Supabase "users" table
        const { error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id: user.id,          // Supabase user id
              email: user.email,
              created_date: new Date(),
            },
          ]);

        if (insertError) {
                  setLoading(false);
          console.error("Error saving user:", insertError);
        }

         setLoading(false);

        if (data?.user) { dispatch(setUser(data.user)); 
          // Redirect back to previous page or home
           const redirectTo = location.state?.from?.pathname || "/Account"; 
           navigate(redirectTo, { replace: true });
           }

        // ✅ Redirect to dashboard or login
        //navigate("/Account", { replace: true });
      }
       
    } catch (err) {
       setLoading(false);
      setError(getErrorMessage(err.message));
    }
    setLoading(false);
  };

  const handleGoToLogin = () => { 
    // preserve the "from" state if available 
    navigate("/EmailLogin", { state: { from: location.state?.from } }); 
  };

  return (
     
    <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-8 w-8" onClick={() => navigate("/")} />
                           <h1 className="text-lg font-semibold"> Sign up </h1>
            </div>
            <hr />
          </div>

    <div className="flex min-h-screen items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 ">
        {/* Logo */}

           <FullScreenLoader loading={loading}
      message=" loading..."/>

        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto"
          />
        </div>

        {/* Heading */}
        <h2 className="text-lg font-bold text-left mb-6">
          Create New Account
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}   // toggle type
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
            {/* Show password checkbox */}
            <div className="ml-2 mt-2 flex items-center">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="showPassword"
                className="ml-2 block text-sm text-gray-700"
              >
                Show Password
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Continue
          </button>
        </form>

        {/* Already have account */}
        <p className="mt-6 text-center text-base text-gray-600">
          Already have an account?{" "}
          <button //the login redirect 
             
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={handleGoToLogin}
          >
            Log in
          </button>
        </p>
      </div>
    </div>

      </div >
  );
};

export default EmailRegistration;
