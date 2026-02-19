import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";    //supabase"
 import FullScreenLoader from "../utils/FullScreenLoader";
 import back from "../assets/icon_download_back.png";
 import { useNavigate } from "react-router-dom";



export default function OrderTracking() {
  const { orderId } = useParams()
  const [trackingData, setTrackingData] = useState([])
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchTracking()
  }, [orderId])

  const fetchTracking = async () => {
    setLoading(false)

    const { data, error } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("order_id", orderId)
      .order("updates_time", { ascending: true })

    if (!error) {
      setTrackingData(data)
       setLoading(false)
    } else {
         setLoading(false)
      console.error(error)
    }

    setLoading(false)
  }

  if (loading) return <div className="p-6">Loading tracking...</div>

  return (

     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold">  Order Tracking </h1>
            </div>
            <hr />
          </div>

    <div className="max-w-2xl mx-auto p-6">
       

         <FullScreenLoader loading={loading}
      message=" loading..."/>


      <div className="relative border-l-2 border-gray-200 ml-4">
        {trackingData.map((item, index) => (
          <div key={item.id} className="mb-10 ml-6">
            {/* Circle */}
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-8 ring-white">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>

            {/* Card */}
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <h3 className="font-semibold text-lg text-gray-800">
                {item.updates}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(item.updates_time).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div > 
  )
}
