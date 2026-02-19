import { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../../assets/icon_download_back.png";

//checked / database

function AdminProfilePassword() {
  const [input , setInput ] = useState("");
  const [checking, setChecking] = useState("checking");
    const [loading, setLoading] = useState(false);

  
  const fetchChecking = async()=>{
    setLoading(true);
       const {data,error} = await  supabase
       .from("admin_checking")
       .select("value")
       .eq("name","admin_level_two")
       .single();
  
       if(error){
        setLoading(false);
        alter("their is some proble , refresh or restart the app")
       }else{
       
        setChecking(data.value);
         setLoading(false);
       }
        setLoading(false);
     };
  

  const handlePassword = () => {
    fetchChecking();
    if (input  === checking) {
      navigate("Admin/AdminDetailsPage", { replace: true }); // redirect to admin page
    } else {
      alert("Incorrect password. Try again.");
    }
  };

  return (

   <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
              <h1 className="text-lg font-semibold">Admin profile check</h1> 
            </div>
            <hr />
          </div>
   


    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter Admin Profile Password @try 123456
        </label>
        <input
          type="password"
          id="password"
          value={input }
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-4"
        />
        <button
          onClick={handlePassword}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
         {loading?"Loading...":"__Go__@_Now_"}
        </button>
      </div>
    </div>

    </div >
    
  );
}

export default AdminProfilePassword;
