import React, { useEffect } from "react";

const BlockingSpinnerBox = ({ loading, message = "Loading..." }) => {
  // Prevent back navigation while loading
  useEffect(() => {
    if (loading) {
      const handlePopState = (event) => {
        event.preventDefault();
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default BlockingSpinnerBox;
