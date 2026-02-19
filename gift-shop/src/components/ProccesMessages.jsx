import { useEffect } from "react";
import cartIcon from "../assets/icons_downloaded_cart_default.png"

export default function ProccesMessages({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // auto close after 3s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" > 
    <div className="fixed bottom-5 bg-white text-gray-500 px-4 py-2 rounded shadow-lg animate-bounce border-2 border-gray-600 mb-10">
       <div className="flex gap-2 ">
      <span className="text-xl"><img src={cartIcon} alt="Cart" className="h-6 w-6 sm:h-7 sm:w-7" /></span> 
       <span>{message}</span>
       </div> 
    </div>
     </div>
  );
}
