import { useNavigate } from "react-router-dom";

export default function CartItem({ item, onRemove,onPurchase }) {
  const navigate = useNavigate();

  return (
    <div className=" items-center bg-white   rounded-lg p-4 mb-4  border border-gray-300">
       <div className="flex  gap-4"
       onClick={() => navigate(`/product/${item.product_id}`)}      
        >
      {item.products.product_image_url && (<img
        src={item.products.product_image_url}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md"
      />)}
      <div className="ml-4 flex-1">
        <h2 className="text-gray-600 ">{item.products.name}</h2>
        <p className="text-lg font-semibold">{item.products.currency}{item.products.price}</p>
      </div>
</div>
       
      <div className="flex gap-6 mt-5">

        <button
          onClick={() => onRemove(item.id)}
          className="px-4 py-2 border border-gray-300   rounded-lg  "
        >
          Remove
        </button>
        <button
          onClick={() => onPurchase( item.user_id,item.products)}
         className="px-4 py-2 bg-[#ffd912]  text-black font-semibold rounded-lg"
        >
          Purchase
        </button>
      </div>
       
    </div>
  );
}
