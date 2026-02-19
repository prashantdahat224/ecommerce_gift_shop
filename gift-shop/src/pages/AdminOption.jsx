import { useNavigate } from "react-router-dom";
//checked / database

function AdminOption() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-2xl font-bold mt-4 mb-6">_choose_a_Page_for_EDIT_</h1>

      <button
        onClick={() => navigate("/Admin/OfferPosterUpload") }
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Offers Poster
      </button>

      <button
        onClick={() => navigate("/Admin/ProductPostUpload")}
        className="w-40 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
      >
        Product Post UPLOAD
      </button>

      <button
        onClick={() => navigate("/Admin/EditProductPost")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
         EDIT the existing product post
      </button>

      <button
        onClick={() => navigate("/Admin/AdminProductSearch")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        DELETE the Product Post
      </button>

       

      <button
       // onClick={() => navigate("/page3")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        changes in GIFT REMINDER
      </button>

      <button
        onClick={() => navigate("/Admin/manage_category")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage category 
      </button>

      <button
        onClick={() => navigate("/Admin/ManageKeywords")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage keywords 
      </button>
      <button
        onClick={() => navigate("/Admin/ManageTrendingKeywords")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage trending keywords 
      </button>
      <button
        onClick={() => navigate("/Admin/EditOrder")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage ORDERS 
      </button>
      
       

      <button
        onClick={() => navigate("/Account")}
        className="border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       go BACK
      </button>
      <button
        onClick={() => navigate("/home")}
        className="border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       go back to HOME
      </button>

      <button
       // onClick={() => navigate("/TestingPage")}
        className="border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       admin GUIDE
      </button>
      <button
        onClick={() => navigate("/Admin/AdminProfilePassword")}                        
        className="mb-20 border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       Admin Profile Page
      </button>
    </div>
  );
}

export default AdminOption;
