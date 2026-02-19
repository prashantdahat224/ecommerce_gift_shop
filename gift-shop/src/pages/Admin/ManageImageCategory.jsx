import {useRef, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import back from "../../assets/icon_download_back.png";
import { data, useNavigate } from "react-router-dom";
import FullScreenLoader from "../../utils/FullScreenLoader";
 import Alert from "../../components/ProgressCompleteBox"
 import { useParams } from "react-router-dom";
//  import {useDispatch} from "react-redux";
//  import { setSelectedProductIds } from "../../redux/productSlice";
 
 
 //console


export default function ManageImageCategory() {
        
   const {productId} =useParams();

 
 // const [categories, setCategories] = useState([]);
//  const [name, setName] = useState(""); //category
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

     const [alertOpen, setAlertOpen] = useState(false);

     const [messages, setMessages] = useState("");


 
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imagePath, setImagePath] = useState(null);

 



  // Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("category_image")
      .eq("id", productId)
      .single();
        
       
    if(!error){
setLoading(false);
     }
    if (!error && data?.category_image) {
const { data: urlData } = supabase.storage
       .from("category-images")
      
      .getPublicUrl(data.category_image);
       setImagePath(data.category_image);   // file path (truth)

    setImageUrl(urlData.publicUrl);      // display URL
     setLoading(false);
   //setImagePath(data?.category_image || null);
     }else{

   setImagePath(null);
    setImageUrl(null);
       setLoading(false);
  
    }
    setLoading(false);
    
  };

  
  

  useEffect(() => {
    fetchCategories();
  }, []);

 

  /////////////
   const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  ////////////
  const handleUpload = async () => {
    if (!image) return alert("Select an image first");

    setLoading(true);

    const fileExt = image.name.split(".").pop();
    const filePath = `categories/${productId}/${Date.now()}.${fileExt}`;

    // upload (overwrite old image)
    const { error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(filePath, image, { upsert: true });

    if (uploadError) {
      setLoading(false);
          //  console.log("uploadError.message",uploadError.message)
     // console.log("uploadError",uploadError)

      return alert("there some problem");
    }

    // save file path in DB
    const { error: dbError } = await supabase
      .from("categories")
      .update({ category_image: filePath })
      .eq("id", productId);

    setLoading(false);

    if (dbError) {
      alert(dbError.message);
    } else {
      setImage(null);
      setPreview(null);        // ✅ reset preview
      fetchCategories();    // ✅ refetch stored image
     // setPreview();
      alert("Image uploaded");
    }
  };


  const handleWarning = async()=>{
      alert("image already exist!")
  }
  //////////// 
    const handleDelete = async () => {
    if (!imagePath) return;

    setLoading(true);

    // delete from storage
    const { error: storageError } = await supabase.storage
      .from("category-images")
      .remove([imagePath]);

    if (storageError) {
      setLoading(false);
      return alert(storageError.message);
    }

    // clear DB
    const { error: dbError } = await supabase
      .from("categories")
      .update({ category_image: null })
      .eq("id", productId);

    setLoading(false);

    if (!dbError) {
      setImagePath(null);
      setPreview(null);
      fetchCategories();
      alert("Image deleted");
    }
  };
  ////////////
 // ✅ Decide what image to show
  const displayImage = preview || imageUrl;
    

  ///////////


  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Product Category edit </h1>
            </div>
            <hr />
          </div>
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

         <FullScreenLoader loading={loading}
      message=" loading..."/>

  
 <Alert
          message={messages}
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
        />


     
      {/* Category List */}
      

  {/*image*/}  
              {console.log("displayImage",displayImage)}
      <div className="border border-gray-500 flex items-center gap-4 p-5 rounde rounded mt-2">
      {/* Circular Image */}
      <div className="w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center bg-gray-100">
        {
        displayImage ? (

          <img src={displayImage} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={handleSelectImage}
        />

      {imagePath ? 
         <p onClick={handleWarning}>Choose Image</p> :(
        <button
          onClick={() => fileRef.current.click()}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Choose Image
        </button>)}


        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-2 py-1 border border-blue-600 text-blue-600 rounded   disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

          {/* Delete Button (only when image exists) */}
        {imagePath && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-2 py-1 border border-red-500 text-red-500 rounded  disabled:opacity-50"
          >
            Remove Image
          </button>

         
        )}
        
      </div>
    

    </div>
          
             <p>note: if you want to upload new image then delete the existing imge first.</p>



            {/*image*/}  


       
    </div>

    
       </div >

  );
}