import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
 import FullScreenLoader from "../../utils/FullScreenLoader";
 import back from "../../assets/icon_download_back.png";
 import { useNavigate } from "react-router-dom";


export default function AdminDetailsPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState([]);
  
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


  const fetchAdmins = async () => {
    const { data, error } = await supabase.from("admin_details").select("*");
    if (error) {
      setMessage("Error fetching data: " + error.message);
    } else {
      setAdmins(data);
    }
  };

 


  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("admin_details")
      .upsert({ name,role, email, phone_number: phone }, { onConflict: ["email"] });

    if (error) {
          setLoading(false);

      setMessage("Error: " + error.message);
    } else {
      alert("Saved successfully!");
      setName("");
      setRole("");
      setEmail("");
      setPhone("");
      fetchAdmins();
    }
     setLoading(false);
  };

  return (

     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Page name </h1>
            </div>
            <hr />
          </div>

      <div>
        <button className="bg-gray-200 p-3 ml-5 mt-5 mb-5"
          onClick={() => navigate("/Admin/AdminSelect")}
          > 
            <p>select user for admin role admin</p>
          </button>
       </div>

       <hr></hr>
    <div className="p-6">
         
             

      <form onSubmit={handleSubmit} className="mb-6">
       
        

        <h1 className="text-lg font-semibold mb-4">Admin Details</h1>
          

         
            <FullScreenLoader loading={loading}
      message=" loading..."/>


          <p>Name:</p>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full border p-2 mb-3"
          required
        />
        <p>Admin Role:</p>
        <input
          type="text"
          placeholder="Admin Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block w-full border p-2 mb-3"
          required
        />
      <p>Email:</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full border p-2 mb-3"
          required
        />
        <p>Phone Number with country code, eg. 919876543210:</p>
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full border p-2 mb-3"
          required
        />

        <button
          type="submit"
          className="bg-gray-300 p-3"
        >
          Save
        </button>

        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </form>

      <h2 >Existing Admins</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 p-3">
             
            <th >Name</th>
            
            <th  >Email</th>
            <th >Phone</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
               
              <td className="border px-2 py-1">{admin.name ||""}</td>
              
              <td className="border px-2 py-1">{admin.email ||""}</td>
              <td className="border px-2 py-1">{admin.phone_number ||""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

     </div >
  );
}
