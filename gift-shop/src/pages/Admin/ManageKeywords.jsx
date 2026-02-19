import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import back from "../../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
 import FullScreenLoader from "../../utils/FullScreenLoader";
 import {useDispatch} from "react-redux";
 import { setSelectedProductIds } from "../../redux/productSlice";



export default function ManageKeywords() {
         const dispatch = useDispatch();

  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
   const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



  // Fetch Keywords
  const fetchKeywords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("keywords")
      .select("*")
      .order("id", { ascending: false })
      .limit(100);

    if (error){
       setLoading(false);
    } else{
        setLoading(false);
        setKeywords(data);
    }
     setLoading(false);
  };

  // Add Keyword
  const addKeyword = async () => {
     

    const name_lower=newKeyword.toLowerCase();
    if (!newKeyword.trim() || newKeyword.includes(" ") || newKeyword.includes(",")) {
        alert("spaces or comma not allowed!");
        return;
    }
    setLoading(true);

    const { error } = await supabase.from("keywords").insert([
      { name: name_lower }
    ]);

    if (error) {
        setLoading(false);
    }else{
      setLoading(false);
      setNewKeyword("");
      fetchKeywords();
    }
     setLoading(false);
  };

  // Delete Keyword
  const deleteKeyword = async (id) => {
    
    
    const confirmAction = window.confirm("Are you sure to delete ? ");

  if (!confirmAction) return;

  setLoading(true);
    const { error } =await supabase.from("keywords").delete().eq("id", id);
    if(error){
        setLoading(false);
    }else{
        fetchKeywords();
    setLoading(false);
    }
   setLoading(false);
    
  };

  useEffect(() => {
    fetchKeywords();
  }, []);


  ///////////
  const fetchProductsByKeyword = async (keywordId) => {
    setLoading(true);
    // Step 1: Get product IDs from product_keywords table
    const { data: productLinks, error: Error } = await supabase
      .from("product_keywords")
      .select("product_id")
      .eq("keyword_id", keywordId);

    if (Error) {
        setLoading(false);
      console.error(Error);
      return;
    }

    // Extract product IDs into an array
    const productIds = productLinks.map((link) => link.product_id);

    if (productIds.length === 0) {
        setLoading(false);
        alert("product not found");
     // setProducts([]); // No products for this keyword
      return;
    }else{
      setLoading(false)
       dispatch(setSelectedProductIds(productIds));
       navigate("/Admin/SearchProductID");
    }
};
  ///////////

  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Edit Keywords </h1>
            </div>
            <hr />
          </div>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white shadow rounded p-4">
          <FullScreenLoader loading={loading}
      message=" loading..."/>

        
        <h1 className="text-xl font-bold mb-4">Keywords</h1>

        {/* Add Keyword */}
        <p className="font-semibold">make a new keyword:</p>

        <div className="flex gap-2 mb-4">
            
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter keyword"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={addKeyword}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <hr></hr>
        {/* Keyword List */}
        <p className="font-semibold mt-5">Existing Kyewords:</p>
        <ul className="space-y-2">
          {keywords?.map((item) => (
            <li
              key={item.id}
              className="flex flex-col bg-gray-100 p-1 rounded"
            >
              <span>{item?.name || ""}</span>
              <div>
              <button
                onClick={() => fetchProductsByKeyword(item.id)}
                className="text-blue-500 border border-blue-500 rounded p-1 "
              >
                View linked Products
              </button>
              <button
                onClick={() => deleteKeyword(item.id)}
                className="border border-red-500 text-red-500 rounded p-1 mt-2 text-right ml-10"
              >
                Delete keyword
              </button>
              </div>

            </li>
          )) || "no keyword found"} 
        </ul>

      </div>
    </div>
     </div >
  );
}