import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
 import FullScreenLoader from "../../utils/FullScreenLoader";
 import back from "../../assets/icon_download_back.png";
 
 


export default function EditOrderDetailsPage() {
   const navigate = useNavigate();

   const {orderId} = useParams();

  const [order2, setOrder2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalOrder, setOriginalOrder] = useState(null); //added

  

  // Fetch single order
  useEffect(() => {

    setLoading(true);
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id",orderId)
        .single();

      if (error){
    setLoading(false);
      } 
         /////////
        else
         {
          
                    //console.log("1",data)
                   const withUrls = data.map(cat => {
                    let publicUrl = null;
                    if (cat.product_image) {
                      const { data: urlData ,error} = supabase
                        .storage
                        .from("category-images")
                        .getPublicUrl(cat.category_image);
                      publicUrl = urlData.publicUrl;
                     // console.log("1",publicUrl);
                   //  setLoading(false);
                    }else{
                      console.log(error)
                       setLoading(false);
                    }
                    return {
                      ...cat,
                      product_image_url: publicUrl || ""  
                       
                    };
                    
                   
                  });
                 // console.log("2",withUrls)
                  setOrder2(withUrls || []);
                   setOriginalOrder(withUrls || []); //  added
                    setLoading(false);
                }
                
          /////////
        
       // setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, []);//orderId

  const handleChange = (e) => {
    setOrder2({ ...order2, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
     if (!order2 || !originalOrder) {
          alert("there is a problem")
            return;
        }

         const updatedDetails = {};
 Object.keys(order2).forEach((key) => {
    if (order2[key] !== originalOrder[key]) {
      updatedDetails[key] = order2[key];
    }
  });

   if (Object.keys(updatedDetails).length === 0) {
    alert("No changes");
    return;
  }

    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update(updatedDetails)
      .eq("id", order2.id);

    if (!error) {
         setLoading(false);
      alert("Order updated successfully");
      //navigate(-1); // go back
    } else {
         setLoading(false);
      alert("Error updating order");
    }
    setLoading(false);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!order2) return <p className="p-4">Order not found</p>;

  return (
     <div>
          {/* HEADER */}
           <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Edit order details </h1>
            </div>
            <hr />
          </div>

    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Order</h1>
           
              <FullScreenLoader loading={loading}
      message=" loading..."/>

      <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm">

        <img src={order2.product_image_url} className="w-20 h-20 mt-2"></img>

        {/* Order Code */}
        <div>
          <p className="text-sm text-gray-500 mt-4">Order Code</p>
          <p className="text-sm text-gray-500 mt-4">{order.order_code}</p>
          {/* <input
            type="text"
            name="order_code"
            value={order.order_code}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          /> */}
        </div>

        {/* User Name */}
        {/* <div>
          <label className="text-sm text-gray-500">User Name</label>
          <input
            type="text"
            name="user_name"
            value={order.user_name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div> */}

        {/* User Phone */}
        <div>
          <label className="text-sm text-gray-500">User Phone</label>
          <input
            type="text"
            name="user_phone"
            value={order2.user_phone}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Product Name */}
        <div>
          <p className="text-sm text-gray-500">Product Name:</p>
          <p className="text-sm text-gray-500">{order2.product_name}</p>
          {/* <input
            type="text"
            name="product_name"
            value={order.product_name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          /> */}
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm text-gray-500">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={order2.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">user address</label>
          <input
            type="number"
            name="quantity"
            value={order2.user_address}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">product address</label>
          <input
            type="number"
            name="quantity"
            value={order2.product_address}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm text-gray-500">Status</label>
          <select
            name="status"
            value={order2.status}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Created At (Read Only) */}
        <div>
          <label className="text-sm text-gray-500">Created At</label>
          {/* <input
            type="text"
            value={new Date(order.created_at).toLocaleString()}
            disabled
            className="w-full border p-2 rounded mt-1 bg-gray-100"
          /> */}
        </div>

        <button
          onClick={handleSave}
          className="w-full border border-blue-600 text-blue-600  py-2 rounded-lg mt-3"
          disabled={loading}
        >
          Save Changes
        </button>
      </div>
    </div>
      </div > 

  );
}
