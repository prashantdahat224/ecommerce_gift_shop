import { useState } from "react"
import { supabase } from "../../supabaseClient"
 import FullScreenLoader from "../../utils/FullScreenLoader";


export default function AdminSelect() {
  const [value, setValue] = useState("")
  const [user, setUser] = useState(null)
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const findUser = async () => {
  setLoading(true)
  setMessage("")
  setUser(null)
 
  const isEmail = value.includes("@")
  const searchValue = isEmail ? value.toLowerCase() : value

  const { data, error } = await supabase
    .from("users") // MUST be your public users table
    .select("id, email, number")
    .eq(isEmail ? "email" : "phone", searchValue)
    .maybeSingle()

  if (error) {
    console.error(error)
    setMessage("Something went wrong")
  } else if (!data) {
    setMessage("User not found")
  } else {
    setUser(data)
  }

  setLoading(false)
}


  const assignRole = async () => {
    if (!role) {
      setMessage("Please select a role")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("admin_users")
      .insert({
        user_id: user.id,
        role: role,
      })

    if (error) {
       setLoading(false)
      setMessage("Failed to assign role")
    } else {
     // setMessage(`User assigned as ${role} `)
     alert("User assigned as Admin ")
      setUser(null)
      setValue("")
      setRole("")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">
          Assign Admin Role
        </h1>

        <FullScreenLoader loading={loading}
      message=" loading..."/>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Email or Phone"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={findUser}
            disabled={!value || loading}
            className="bg-gray-300 px-4 rounded "
          >
            Find
          </button>
        </div>

        {/* User Details */}
        {user && (
          <div className="border rounded p-4 mb-4 bg-gray-50">
             
            <p className="text-sm"> Email:  {user.email || "-"}</p>
            <p className="text-sm"> Phone:  {user.phone || "-"}</p>
          </div>
        )}

        {/* Role Selection */}
        {user && (
          <>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={assignRole}
              disabled={loading}
              className="w-full border border-blue-500 text-blue-500 py-2 rounded  "
            >
                select Admin Role
            </button>
          </>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
