import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Navigate } from "react-router-dom"; 
import back from "../../assets/icon_download_back.png";
 import FullScreenLoader from "../../utils/FullScreenLoader";



export default function DeleteProductPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goBack, setGoBack] = useState(false); //added
  const [deleting, setDeleting] = useState(false); //added
  const [loading_delete, setLoadingDelete] = useState(false);

  
 


  

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        alert("Error fetching product");
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Delete images from storage
  const deleteImages = async (product) => {
    setLoadingDelete(true);
    try {
      const bucket = "products";
      const paths = [];

      if (product.featured_image) {
        const featuredPath = product.featured_image.split("/storage/v1/object/public/")[1];
        paths.push(featuredPath);
      }

      if (product.images && product.images.length > 0) {
        const imagePaths = product.images.map((img) =>
          img.split("/storage/v1/object/public/")[1]
        );
        paths.push(...imagePaths);
      }

      if (paths.length > 0) {
        const { error } = await supabase.storage.from(bucket).remove(paths);
        if (error) console.error("Error deleting images:", error);
      }
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  };

  // Delete product row
  const deleteProductRow = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  };

  // Handle Delete
  const handleDeleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product post?")) {
      setLoadingDelete(false); //added
      return;}

    try {
      setDeleting(true);  //added

      await deleteImages(product);
      await deleteProductRow(product.id);

      //navigate(0)
      setLoadingDelete(false); //added  
      alert("Product deleted successfully!");
      navigate("../AdminOption"); // adjust route to your product list page

      setDeleting(false); //addd
    } catch (error) {
      setLoadingDelete(false); //added
      console.error(error);
      alert("Failed to delete product");
    }
  };

  // helper to convert storage path → public URL
const getPublicUrl = (path) => {
  if (!path) return null;
  return supabase.storage
    .from("products")
    .getPublicUrl(path).data.publicUrl;
};

  if (goBack) return <Navigate to="../AdminOption"/>; //added


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading...
      </div>
    );
  }



  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Product not found
      </div>
    );
  }

  return (

    <div> 
      <h1 className="flex items-center gap-3 text-left text-lg font-medium text-gray-900 my-2 ml-4">
                         <img
                           src={back}
                           alt="Back"
                           className="h-10 w-10"
                           onClick={() => setGoBack(true)}
                         />
                          
                        Delete Product</h1>
      
      <hr className="border-gray-300" />
      
    <div className="p-4 max-w-2xl mx-auto">
       

        <FullScreenLoader loading={loading}
      message=" loading..."/>
      
      
      {/* Featured Image */}
      <p className="text-gray-600">Featured Images -</p>
      {product?.featured_image && (
        <img
         src={getPublicUrl(product.featured_image)}
         alt="Featured"
          className="w-full h-64 object-cover rounded mb-4 "
        />
        )}

  {/* Product Info */}
      <div className="mb-4">
        <p>
          <span className="font-semibold">Name: </span>
          {product.name}
        </p>

        <p>
          <span className="font-semibold">about: </span>
          {product.about || ""}
        </p>
        
        <p>
          <span className="font-semibold">Price: </span>
          {product.currency} {product.price}
        </p>

        <p>
          <span className="font-semibold">Description: </span>
          {product.description || ""}
        </p>

        <p>
          <span className="font-semibold">Stock: </span>
          {product.stock || ""}
        </p>
      </div>

      {/* Additional Images */}
      <p className="text-gray-600">Additional Images -</p>
      {product.additional_images && product.additional_images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {product.additional_images.map((img, idx) => (
            <img
              key={idx}
              src={getPublicUrl(img)}
              alt={`Additional ${idx}`}
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
      )}

    

      {/* Delete Button */}
      <div className="sticky bottom-0 bg-white p-4 border-t">
      <button
        onClick={handleDeleteProduct}
        disabled={deleting} 
        className={`w-full py-2 bg-red-600 text-white rounded font-semibold
           ${deleting ? "bg-gray-400"
          : "bg-red-600 text-white"
          }`}
         >
        {deleting ? "Deleting..." : "Delete Product"} 
      </button>
      </div>
    </div>
    </div>
  );
}
