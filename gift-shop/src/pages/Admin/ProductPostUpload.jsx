import { useState, useRef } from "react";
import { supabase } from "../../supabaseClient";
import back from "../../assets/icon_download_back.png";
import { Navigate } from "react-router-dom";
import FullScreenLoader from "../../utils/FullScreenLoader";
import { useNavigate } from "react-router-dom";

const ProductPostUpload = () => {

  const [mainPage, setMainPage] = useState(true);
  const [ProductId_last, setproductId_last] = useState(null);
  //const [product_code_last, setProductCode_last] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");
  const [stock, setStock] = useState("");

  const [featuredFile, setFeaturedFile] = useState(null);
  const [ProductFile, setProductFile] = useState(null);//

  const [additionalFiles, setAdditionalFiles] = useState([]);

  const [featuredPreview, setFeaturedPreview] = useState(null);
  const [ProductPreview, setProductPreview] = useState(null);//

  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const [currency, setCurrency] = useState("₹");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [goBack, setGoBack] = useState(false);
  //const [keywords, setKeywords] = useState("");

  const [loading_spinner, setLoading_spinner] = useState(false);

  const navigate = useNavigate();

  const featuredInputRef = useRef(null);
  const productInputRef = useRef(null);//
  const additionalInputRef = useRef(null);


  // ===== Handle file selection =====
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFeaturedFile(file);
    setFeaturedPreview(URL.createObjectURL(file)); // preview only
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductFile(file);
    setProductPreview(URL.createObjectURL(file)); // preview only
  };


  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setAdditionalFiles((prev) => [...prev, ...files]);
    setAdditionalPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleCancel = () => {
    setFeaturedFile(null);
    setProductFile(null);

    setAdditionalFiles([]);
    setAdditionalPreviews([]);

    setFeaturedPreview(null);
    setProductPreview(null);

    if (featuredInputRef.current) featuredInputRef.current.value = "";
    if (additionalInputRef.current) additionalInputRef.current.value = "";

    setName("");
      setPrice("");
      setDescription("");
      setAbout("");
      setStock("");
     // setKeywords("");  //added
  };

  // ===== Submit / Upload =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading_spinner(true);
    if (!name || !price || !featuredFile || !ProductFile) {
      setLoading_spinner(false);
      alert("Product name, price, and featured image are required!");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // 1️⃣ Upload featured image
      let featuredPath = `featured/${Date.now()}-${featuredFile.name}`;
      await supabase.storage.from("products").upload(featuredPath, featuredFile);

      // 1️⃣ Upload featured image
      let productPath = `product/${Date.now()}-${ProductFile.name}`;
      await supabase.storage.from("products").upload(productPath, ProductFile);

      // 2️⃣ Upload additional images
      const additionalPaths = [];
      for (const file of additionalFiles) {
        const path = `additional/${Date.now()}-${file.name}`;
        await supabase.storage.from("products").upload(path, file);
        additionalPaths.push(path);
      }

         //added
         const product_code=generateProductCode(name);
         //const search_keywords=parseKeywords(keywords,name);
         //added

      // 3️⃣ Insert product record (save storage paths, not blob URLs)
      const { data,error: insertError } = await supabase.from("products").insert([
        {
          name,
          price: parseFloat(price),
          description,
          about,
          stock,
          currency,
          product_code,
          //search_keywords,
          featured_image: featuredPath,
          product_image: productPath,
          additional_images: additionalPaths,
        },
      ]).select("id").single();  //added this .select();
      if (insertError) throw insertError;
      
       setproductId_last(data.id) //added

    //               // Prepare keyword rows
    //    const keywordRows = search_keywords.map((k) => ({
    //    product_id: productId,
    //    keyword: k,
    //     }));

    //   // Insert into product_keywords table
    //   const { error: keywordError } = await supabase
    //  .from("product_keywords")
    //   .insert(keywordRows);

    //   if (keywordError) throw keywordError;
    //   //////////////added

      
      setLoading_spinner(false);
      //setMessage("Product uploaded successfully!");
      handleCancel();
      
      //alert("Product uploaded successfully!"); //added
    



    } catch (err) {
      setLoading_spinner(false);
      console.error("Error uploading product:", err);
      setError("Failed to upload product");
    } finally {
      setLoading_spinner(false);
      setLoading(false);
    // setMainPage(false)
    // setProductCode_last(product_code)
     setMainPage(false)

    }
    setLoading_spinner(false);
  };


  function generateProductCode(productName) { //added
  const safeName =
    typeof productName === "string" && productName.trim()
      ? productName
      : "product";

  const cleanName = safeName
    .trim().toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");

  const timestamp = Date.now().toString().slice(-8);  

  return `${cleanName}-${timestamp}`;
}

//  function parseKeywords(input, product_name_input) { //added
//   const result = `${input},${product_name_input}`;

//   return [...new Set(
//     result
//       .split(/[\s,]+/) // split by space or comma
//       .map(k => k.trim().toLowerCase()
//       .replace(/\./g, "") ) // remove full stop
//       .filter(Boolean)
//   )];
// }



 

  if (goBack) return <Navigate to="../AdminOption" />;

  // ===== Render =====
  return (
    <div>
      <h2 className="flex items-center gap-5 text-lg font-medium my-2 ml-4">
        <img
          src={back}
          alt="Back"
          className="h-10 w-10"
          onClick={() => setGoBack(true)}
        />
        Upload Product
      </h2>
      <hr className="border-gray-300" />

       
        <FullScreenLoader loading={loading_spinner}
      message=" Post Uploading..."/>

      {mainPage?
      (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
        {/* Cancel Button */}
        {(ProductFile || featuredFile || additionalFiles.length > 0) && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleCancel}
              className="border border-red-600 px-3 py-1 bg-white text-red-600 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">




          {/* Product Image */}
          <div>
            <label className="block font-medium mb-1">Product Image</label>
            <button
              type="button"
              onClick={() => productInputRef.current.click()}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-gray-300"
            >
              Choose Product Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={productInputRef}
              onChange={handleProductImageChange}
              className="hidden"
            />
            {ProductPreview && (
              <img
                src={ProductPreview}
                alt="Featured Preview"
                className="mt-2 w-45 h-48 object-cover rounded"
              />
            )}
          </div>
            {/* product Image />*/}

         <hr></hr>

          {/* Featured Image */}
          <div>
            <label className="block font-medium mb-1">Featured Image</label>
            <button
              type="button"
              onClick={() => featuredInputRef.current.click()}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-gray-300"
            >
              Choose Featured Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={featuredInputRef}
              onChange={handleFeaturedImageChange}
              className="hidden"
            />
            {featuredPreview && (
              <img
                src={featuredPreview}
                alt="Featured Preview"
                className="mt-2 w-full h-48 object-cover rounded"
              />
            )}
          </div>
            {/* Featured Image />*/}

            <hr></hr>



          {/* Additional Images */}
          <div>
            <label className="block font-medium mb-1">Additional Images</label>
            <button
              type="button"
              onClick={() => additionalInputRef.current.click()}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-gray-300"
            >
              Choose Additional Images
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={additionalInputRef}
              onChange={handleAdditionalImagesChange}
              className="hidden"
            />
            {additionalPreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {additionalPreviews.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Additional Preview ${idx}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <hr></hr>

          {/* Product Details */}
          <div>
          <p className="font-semibold">Product name -</p>
          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 placeholder-gray-600"
            required
          />
          </div>

           <div>
          <p className="font-semibold">Price -</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-12 border rounded px-3 py-2 "
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 border rounded px-3 py-2 placeholder-gray-600"
              required
            />
            
          </div>
          </div>

           <div>
          <p className="font-semibold">About -</p>
          <input
              type="text"
              placeholder="eg. Nike, etc (OPTIONAL)"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="flex-1 border rounded px-3 py-2 placeholder-gray-600"
             // required
            />
            </div>

             <div>
          <p className="font-semibold">Description -</p>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 placeholder-gray-600"
            //required
          />
          </div>

           <div>
          <p className="font-semibold">Stock -</p>
          <input
            type="text"
            placeholder="Stock (OPTIONAL)"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border rounded px-3 py-2 placeholder-gray-600"
            //required
          />
          </div>

          {/* <div>
          <p className="font-semibold mt-5">Keywords</p>
          
          <textarea
            placeholder="watch, gift, luxury, handmade, craft, etc"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border rounded px-3 py-2 placeholder-gray-600"
            //required
          />
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-5 py-2 rounded ${
              loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </form>

        {/* Messages */}
        {loading && <div className="mt-4 text-blue-600 font-medium">Uploading… please wait</div>}
        {message && <div className="mt-4 text-green-600 font-medium">{message}</div>}
        {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
      </div>
      )
      :
      (<div>
         
 
    <div className="min-h-screen flex flex-col items-center   bg-gray-100">
      
      <h1 className="text-lg font-semibold text-gray-800 mb-2 mt-50">
        Product uploaded successfully...
      </h1>
      
      
      <div className="flex gap-4"
      
        >
        <button className="px-4 py-2 mt-6 bg-blue-500 text-white rounded hover:bg-blue-600"
         onClick={()=>{navigate(`/editKeywordAndCategory/${ProductId_last}`)}}
         >
          Set Keywords and Category
        </button >

      </div>

    </div>
  


 



      </div>)
      }

      


    </div>
  );
};

export default ProductPostUpload;
