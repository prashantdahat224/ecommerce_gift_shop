//import logo from "../assets/logo.png";       // App logo PNG
import { getErrorMessage } from "../components/errorMessages"; // Import the error message utility
import React, { useState } from "react";
import { Link} from "react-router-dom";
 import { useNavigate, useLocation } from "react-router-dom"; 
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice"  //
import { supabase } from "../supabaseClient";
import FullScreenLoader from "../utils/FullScreenLoader";
import back from "../assets/icon_download_back.png";


//checked / database

const EmailLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); //added
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false); // new state, showForgotPassword //added
 // const [resetMessage, setResetMessage] = useState(""); //  feedback message //added
  const [createAccountButton, setCreateAccountButton] = useState(false);
   const navigate = useNavigate(); 
  const location = useLocation(); 
  const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Supabase login
      setLoading(true);
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setLoading(false);
        // If user not found → redirect to registration
        if (loginError.message.includes("Invalid login credentials")) {
          //navigate("/EmailRegistration");
          setCreateAccountButton(true);
          //setError("Invalid email or password.");
          setError("Incorrenct email or password.");
          setShowForgot(true); //added
          return;
        }
        setError(getErrorMessage(loginError.message));
        return;
      }
     
      setLoading(false);

      if (data?.user) { dispatch(setUser(data.user));
         // redirect back or default to /account
          const redirectTo = location.state?.from?.pathname || "/Account";
           navigate(redirectTo, { replace: true }); 
          } 
      // ✅ Successful login → redirect
      // if (data?.user) {
      //   navigate("/Account", { replace: true });
      // }
    } catch (err) {
      setLoading(false);
      setError(getErrorMessage(err.message));
    }
    setLoading(false);
  };


  // const handleForgotPassword = async () => {
  //   setResetMessage("");
  //   try {
  //     const { error } = await supabase.auth.resetPasswordForEmail(email, {
  //       redirectTo: "http://localhost:5173/reset-password", // 👈 adjust to your app route
  //     });
  //     if (error) {
  //       setResetMessage(getErrorMessage(error.message));
  //     } else {
  //       setResetMessage("Password reset email sent! Check your inbox.");
  //     }
  //   } catch (err) {
  //     setResetMessage(getErrorMessage(err.message));
  //   }
  // };
  


  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate("/")} />
                           <h1 className="text-lg font-semibold"> Login  </h1>
            </div>
            <hr />
          </div>
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mb-30 mt-5">
        {/* Logo */}
             <FullScreenLoader loading={loading}
      message=" loading..."/>
        <div className="flex justify-center mb-6">
          {/* <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto"
          /> */}
        </div>

        {/* Heading */}
        <div className="mb-4">
        <h2 className="text-xl font-bold text-left ">Log In</h2>
         {error && (
          <div className="border border-gray-500 p-1 mb-1 rounded text-sm ">
            <p className="font-medium">Their was a problem to log In- </p>
          <p className="   text-red-600 ">{error}</p>
          </div>
        )}
        </div>

        
        
       

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
          </div>

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



       

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 
            rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Continue
          </button>

          
        </form>

        {createAccountButton && (
            <div>
              <p className=" text-center">or</p>
            <button
            type="submit"
            className=" w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
             focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => navigate("/EmailRegistration")}
          >
            Create new account 
          </button>
          </div>
          )}

              {/* Error */}
       
        {/* Forgot password option */}
        {showForgot && (
          <div className="mt-5 flex text-center justify-center mt-2 mb-4">
            <p className="text-gray-600 text-sm mr-2">Problem in log in?</p>
            <button onClick={() => navigate("/registerByPhone")}
             className="text-blue-600 hover:text-blue-800 text-sm font-medium" >
               Get help
            </button>
            {/* {resetMessage && (
              <p className="mt-2 text-green-600 text-sm">{resetMessage}</p>
            )} */}
          </div>
        )}


        {/* Create account option */}
        <p className="mt-6 text-center text-base text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/EmailRegistration"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Create new account
          </Link>
        </p>
      </div>
    </div>
    </div > 
  );
};

export default EmailLogin;
