import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import back from "../../assets/icon_download_back.png";
import { generateFileName } from "../../components/generateFileName";
import FullScreenLoader from "../../utils/FullScreenLoader"; //Added //spinner



const OfferPage = () => {
  const { offerId } = useParams(); // offer1 / offer2 / offer3 / offer4
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); //added
  const [previewUrl, setPreviewUrl] = useState(null); //added

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [productCode, setProductCode] = useState("");
  const [offer_product_id, setOffer_product_id] = useState(null);
  const [product_code_linked, setProduct_code_linked] = useState(null); // to track offerId changes
  
  const [loading_spinner, setLoading_spinner] = useState(false);

  

  const fileInputRef = useRef(null);


  const offer_number = {
    offer1: "Offer 1",
    offer2: "Offer 2",
    offer3: "Offer 3",
    offer4: "Offer 4",
  };


  // Function to link offer to product using product_code
  const linkOfferToProduct = async (offerId, productCode) => {
    setLoading_spinner(true);
    try {
      // 1️⃣ Get product id from product_code
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id")
        .eq("product_code", productCode)
        .single();

      if (productError) throw productError;
      if (!product) {
        setLoading_spinner(false);
        console.warn("Product not found for code:", productCode);
        
        return;
      }

      // 2️⃣ Update offer with product_id
      const { data: updatedOffer, error: updateError } = await supabase
        .from("offers")
        .update({
          product_id: product.id
          , product_code: productCode
        })
        .eq("id", offerId)
        .single();

      if (updateError) throw updateError;

      // console.log("Offer linked to product successfully:", updatedOffer);

      // Update local state

      //setOffer((prev) => ({ ...prev, product_id: updatedOffer.product_id }));
      setOffer_product_id(product.id);
      setProduct_code_linked(productCode);

       setLoading_spinner(false);
      //console.log( " value:", product.id);
    } catch (err) {
       setLoading_spinner(false);
      console.error("Error linking offer to product:", err.message);
    }
  };





  // Handle click → go to product details
  const handleClickLink = () => {
    if (!offer_product_id) {
      alert("Offer is not linked to a product yet!");
      return;
    }
    navigate(`/product/${offer_product_id}`);


  };


  const handleSubmitCode = (e) => {
    // e.preventDefault();
    if (!productCode.trim()) {
      alert("Product code cannot be empty!");
      return;
    }
    linkOfferToProduct(offerId, productCode.trim());
  };



  /* ================= UNIQUE FILE NAME ================= */
  // const generateFileName = (file) => {
  //   const ext = file.name.split(".").pop();
  //   const name = `${offerId}-${Date.now()}.${ext}`;
  //   console.log("Generated file name:", name);
  //   return name;
  // };

  /* ================= FETCH OFFER ================= */
  const fetchOffer = async () => {
    
    setLoading_spinner(true); //added
    console.log("Fetching offer with id:", offerId);
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("image_url,product_id,product_code")
        .eq("id", offerId)
        .maybeSingle();

      console.log("Fetch result:", data, "Error:", error);

      if (error) throw error;

      setImageUrl(data?.image_url || null);
      setOffer_product_id(data?.product_id || null);
      setProduct_code_linked(data?.product_code || null);
      
    } catch (err) {
       
      console.error("Fetch error:", err.message);
    }
    setLoading_spinner(false); //added
  };

  useEffect(() => {
    console.log("useEffect triggered with offerId:", offerId);
    fetchOffer();
  }, [offerId]);

  /* ================= UPLOAD (SINGLE BUTTON) ================= */
  const handleUpload = async (file) => {
    setLoading_spinner(true);
    if (!file) {
      setLoading_spinner(false);
      console.log("No file selected for upload");
      return;
    }



    console.log("Uploading file:", file);

    setLoading(true);
    setMessage("");

    try {
      const fileName = generateFileName(file);

      // 1️⃣ Upload to public bucket
      const uploadRes = await supabase.storage
        .from("offers")
        .upload(fileName, file, { upsert: true });
      console.log("Upload response:", uploadRes);

      // 2️⃣ Get public URL
      const { data: urlData } = supabase.storage
        .from("offers")
        .getPublicUrl(fileName);
      console.log("Public URL data:", urlData);

      const publicUrl = urlData.publicUrl;
      console.log("Public URL:", publicUrl);

      // 3️⃣ Save PUBLIC URL in table
      const upsertRes = await supabase.from("offers").upsert(
        {
          id: offerId,
          image_url: publicUrl,
          create_date: new Date().toISOString(),
        },
        { onConflict: ["id"] }
      );
      console.log("Upsert response:", upsertRes);

      setImageUrl(publicUrl);
      setLoading_spinner(false); //added
      setMessage("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
    setLoading_spinner(false); //added
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    setLoading_spinner(true);
    if (!imageUrl) {
      setLoading_spinner(false);
      console.log("No image to delete");
      return;
    }

    console.log("Deleting image:", imageUrl);

    setLoading(true);
    setMessage("");

    try {
      // Extract file path from public URL
      const filePath = imageUrl.split("/offers/")[1];
      console.log("File path extracted:", filePath);

      // Delete from storage
      const removeRes = await supabase.storage.from("offers").remove([filePath]);
      console.log("Remove response:", removeRes);

      // Delete from table
      const deleteRes = await supabase.from("offers").delete().eq("id", offerId);
      console.log("Delete response:", deleteRes);

      setImageUrl(null);
      // setMessage("Offer deleted");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Delete failed");
    } finally {
      setLoading_spinner(false);
      setLoading(false);
      alert("Product deleted successfully!");
      navigate(-1);
    }
    setLoading_spinner(false);
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      //console.log("Selected jfhjsdfjkdfjbhfhdfhhj file:", file);
      setPreviewUrl(URL.createObjectURL(file)); // preview only  
    }
    e.target.value = ""; // reset input
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    // setLoading(true);
    try {
      await handleUpload(selectedFile); // your Supabase upload logic
      setSelectedFile(null);
      //setPreviewUrl(null);
    } finally {
      //   setLoading(false);
    }
  };

  return (

    <div>
      {/* HEADER */}
      <div className="sticky top-0 bg-white z-50">
        <div className="p-2 flex items-center gap-2 ml-">
          <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
          <p className="text-lg font-bold">Offer poster Management</p>
        </div>
        <hr />
      </div>

      

      <div className="p-6 max-w-md mx-auto">


      

        <h2 className="text-xl font-bold mb-6">{offer_number[offerId]}</h2>

    
        <FullScreenLoader loading={loading_spinner}
      message=" please wait..."/>

        {/* IMAGE */}
        <div className="border border-gray-400 p-2 rounded">
          <div className="mb-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={offerId}
                className="w-full h-40 object-cover rounded"
              />
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt={offerId}
                className="w-full h-40 object-cover rounded"
              />

            ) : (

              (<div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                No image uploaded
              </div>)
            )}
          </div>

          {/* HIDDEN INPUT */}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* BUTTONS */}

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (!imageUrl) fileInputRef.current.click();
              }}
              disabled={loading || !!imageUrl}
              className={`px-4 py-2  rounded text-green-500 ${imageUrl
                ? "bg-gray-400 text-white "
                : "bg-white border border-green-500"
                }`}
            >
              Select Image
            </button>



            {/* Submit button */}
            {selectedFile && (

              <button onClick={handleSubmit}
                // disabled={loading} 
                className="px-4 py-2  text-green-500 border border-green-500 rounded " >

                Upload Image
              </button>

            )}



          </div>

        </div>

        <div >



          <button
            onClick={() => {
              console.log("Delete button clicked");
              handleDelete();
            }}
            disabled={loading || !imageUrl}
            className="mt-7 border boreder-red-500 text-red-500 px-4 py-2 rounded disabled:opacity-50"
          >
            Delete Offer
          </button>


        </div>



        {message && (
          <p className="mt-4 text-sm font-medium text-blue-600">
            {message}
          </p>
        )}
        {(imageUrl && <p className="mt-6 text-base text-gray-500 border border-gray-400 p-4 rounded">


          Instruction - If you want to change the current offer, first delete the current offer then upload new one.




        </p>)}


        <div>

          {imageUrl && (offer_product_id ? (
            <div className="mt-4 border border-gray-500 p-2 rounded">
              <p className="text-gray-600">
                this is linked product with this offer
              </p>

              <div className="">
                <button
                  onClick={handleClickLink}
                  className="mt-1 border border-blue-500  text-blue-500 px-4 py-2 rounded"
                >
                  Go to linked Product Details
                </button>
              </div>
              <p className="bg-gray-200 p-2 mt-2">{product_code_linked || "no prduct code"}</p>
            </div>

          ) : (
            <div className="mt-5 border border-gray-500 p-4 rounded">

              <p className="font-semibold">Link the product with offer-</p>
              <p className="text-gray-500 " >copy the product code from edit the existing product post page of admin panel</p>




              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)} // React updates state
                placeholder="Enter or paste product code here"
                className="mt-2 border border-gray-300 px-3 py-2 w-70 rounded mb-2"
              />
              <button
                onClick={handleSubmitCode}
                className="border boreder-blue-500 text-blue-500 px-4 py-2 rounded disabled:opacity-50"
                type="submit">Link to Product</button>
            </div>
          ))}








        </div>




      </div>
    </div>
  );
};

export default OfferPage;
