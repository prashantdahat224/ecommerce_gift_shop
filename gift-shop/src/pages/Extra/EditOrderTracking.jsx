import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Suspense } from "react";                             //../lib/supabase"
import back from "../../assets/icon_download_back.png";
 
export default function EditOrderTracking() {
  const {orderId} = useParams()
  const navigate = useNavigate()

  const [updates, setUpdates] = useState("")
  const [updatesTime, setUpdatesTime] = useState("")
  const [loading, setLoading] = useState(false)

  

  // Fetch existing data
  useEffect(() => {
    fetchOrderTrack()
  }, [])

  const fetchOrderTrack = async () => {
    const { data, error } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("id", orderId)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setUpdates(data.updates)
    setUpdatesTime(data.updates_times?.slice(0, 16)) // format for datetime-local
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("order_tracking")
      .update({
        updates: updates,
        updates_times: updatesTime,
      })
      .eq("id", orderId)

    setLoading(false)

    if (error) {
      alert("Error updating record")
      console.error(error)
    } else {
      alert("Updated successfully")
    //  navigate("/orders") // redirect
    }
  }

  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Page name </h1>
            </div>
            <hr />
          </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Edit Order Tracking
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Update Message
            </label>
            <textarea
              value={updates}
              onChange={(e) => setUpdates(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Update Time
            </label>
            <input
              type="datetime-local"
              value={updatesTime}
              onChange={(e) => setUpdatesTime(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg"
          >
            {loading ? "Please wait..." : "Update Order"}
          </button>
        </form>
      </div>
    </div>
    </div > 
  )
}
