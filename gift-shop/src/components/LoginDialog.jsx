import React from "react";
 import { useNavigate, useLocation } from "react-router-dom";
 

const LoginDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!open) return null;

  const handleRegister = () => {
     navigate("/EmailRegistration", { state: { from: location } });
     };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute "></div>

      {/* Dialog box */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[400px] p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Welcome!
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please log in or sign up to continue using the app.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRegister}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Log In / Sign Up
          </button>
           
          
        </div>
        <div className="flex justify-center space-x-4 mt-5">
          
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-sm text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition"
          >
            Skip for now and explore
          </button>

        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
