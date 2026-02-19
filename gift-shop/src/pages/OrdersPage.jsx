import { useEffect, useState } from "react";
 import { useSelector } from "react-redux";  //added
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
 import FullScreenLoader from "../utils/FullScreenLoader";
 import back from "../assets/icon_download_back.png";


export default function OrdersPage() {
       const userID = useSelector((state) => state.auth.user?.id); //added

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          created_at,
          product_image,
          product_name
        `)
        .eq("user_id", userID)
        .order("created_at", { ascending: false });

      if (error) {
        setLoading(false);
      }
      ///////////////////
              else

               {
               
              //console.log("1",data)
             const withUrls = data.map(cat => {
              let publicUrl = null;
              if (cat.product_image) {
                const { data: urlData ,error} = supabase
                  .storage
                  .from("products")
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

    if (userID) {
      fetchOrders();
    }
  }, [userID]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Order products </h1>
            </div>
            <hr />
          </div>
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-semibold mb-4">Orders </h1> {/*My Orders*/}
  <FullScreenLoader loading={loading}
      message=" loading..."/>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={()=>navigate(`/OrderDetails/${order.id}`)}
              className="bg-white rounded-xl shadow-sm p-3 flex gap-3 items-center"
            >
              {/* Product Image */}
              <img
                src={order.product_image_url}
                alt={order.product_name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="text-sm font-medium">
                  {order.product_name}
                </h2>

                {/* <p className="text-xs text-gray-500 mt-1">
                  Order ID: {order.id.slice(0, 8)}
                </p> */}  

                {/* Status Badge */}
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
     </div > 
  );
}
