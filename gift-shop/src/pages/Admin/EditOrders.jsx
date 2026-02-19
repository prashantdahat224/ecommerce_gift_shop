import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import back from "../../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import EditOrderDetailsPage from "./EditOrdeDetailsPage"

 

export default function AdminEditOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

    const navigate = useNavigate();


  const statuses = ["pending", "shipped", "delivered", "cancelled"];

  // Fetch all orders with user info
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_code,
        product_code,
        status,
        created_at,
        product_image,
        product_name,
        user_id,
        user_phone_number,
        user_address,
        product_address,
        quantity
      `)
      .order("created_at", { ascending: false });

    if (error){ console.error(error);
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
            setOrders(withUrls || []);
              setLoading(false);
          }
          
    /////////
     


    // setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) console.error(error);
    else fetchOrders();
  };

  // Filter orders by search
  const filteredOrders = orders.filter((order) => {
    const code = order.order_code?.toLowerCase() || "";
    const user_phone_number = order.user_phone_number?.toLowerCase() || "";
    const product_code = order.product_code?.toLowerCase() || "";
    const s = search.toLowerCase();

    return code.includes(s) || user_phone_number.includes(s)||
     product_code.includes(s)|| product_code.includes(s);
  });

  if (loading) return <p className="p-4">Loading orders...</p>;

  return (
    <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Edit order </h1>
            </div>
            <hr />
          </div>

   {!selectedOrder? ( <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-semibold mb-4">Admin Order Edit</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by order code or user phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded "
      />

      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <p className="text-gray-500 text-sm">No orders found</p>
        )}

        {filteredOrders.map((order) => (
          <div
            key={order.id}
            
            
          >
            <div    
                 className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"   >
             <img src={product_image_url} className="h-15 w-15"></img>
            <div>
              <p className="text-sm font-medium">
                Order Code: {order.order_code}
              </p>
              <p className="text-xs text-gray-500">
               product name: {order.product_name}              {/* "N/A" */}
              </p>
              <p className="text-xs text-gray-500">
                Created At: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

           </div>
           <div>
            <button onClick={()=>navigate(`/admin/EditOrderDetailsPage/${order.id}`)}
             className="bg-gray-200 p-1">Edit order details</button>

            <button onClick={()=>navigate(`/admin/Extra/EditOrderTracking/${order.id}`)}
            className="bg-gray-200 p-1">Edit order tracking</button>
           </div>
          </div>
        ))}
      </div>
    </div>)
    :
    (
    <EditOrderDetailsPage
    order={selectedOrder}
    onClose={()=>selectedOrder(null)}
    />
  )
    }


     </div >


  );
}
