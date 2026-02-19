import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import back from "../../assets/icon_download_back.png";

import FullScreenLoader from "../../utils/FullScreenLoader"; //added loading spinner
import PogressCompleteBox from "../../components/ProgressCompleteBox"


export default function EditProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(null);
  const [goBack, setGoBack] = useState(false);

  const [featuredFile, setFeaturedFile] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState(null);

  const [productFile, setProductFile] = useState(null);
  const [productPreview, setProductPreview] = useState(null);

  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]); //added

  const [loading, setLoading] = useState(false);//added //spinner

  const [toast_mssage, setTeoast_message] = useState(""); //added toast



  

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setOriginal(data);
        setForm({
          name: data.name,
          description: data.description,
         // search_keywords: (data.search_keywords || []).join(", "),
          price: data.price,
          about: data.about || "",
          stock: data.stock,
          currency: data.currency,
          product_code:data.product_code,
          featured_image: data.featured_image,
          product_image: data.product_image,
          additional_images: data.additional_images || [],
        });
      }
    };
    fetchProduct();
  }, [id]);

  if (!form) return <div className="p-4">Loading…</div>;
  if (goBack) return <Navigate to="../AdminOption" />;

  //added

  //added

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProductDetails = async () => {
    const updates = {};


    if(!form.name || form.name.trim() === "") {
      alert("name should not empty"); //empty name or price
      return;
    }
    
      
     if(isInvalidPrice(form.price)) {
      alert(" price should not empty"); //empty name or price
      return;
    }
     


    ["name", "description", "price", "about", "stock", "currency"].forEach(
      (key) => {
        if (form[key] !== original[key]) {
          updates[key] = form[key];
        }
      }
    );

    // handle keywords separately
    // if (form.search_keywords !== original.search_keywords?.join(", ")) {
    // //updates.search_keywords = parseKeywords(form.search_keywords,form.name);
    // form.search_keywords = parseKeywords(form.search_keywords,form.name);
    // updates.search_keywords = form.search_keywords;

    //  const keywordRows = form.search_keywords.map((k) => ({
    //    product_id: id,
    //    keyword: k,
    //     }));

    //   // Insert into product_keywords table
    //   const { error: keywordError } = await supabase
    //  .from("product_keywords")
    //   .insert(keywordRows);

    //   if (keywordError) throw keywordError;
    //   //////////////added

    // }


    if (Object.keys(updates).length === 0) {
      alert("No product details changed");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) return alert("Failed to save details");
    alert("Product details updated");
    setOriginal({ ...original, ...updates });

    navigate("../AdminOption");

  };

  // < fetured image 
  const saveFeaturedImage = async () => {
    setLoading(true); //added
    if (!featuredFile) {
      setLoading(false); //added
      alert("No new featured image selected");
      return;
    }

    if (form.featured_image) {
      await supabase.storage.from("products").remove([form.featured_image]);
    }

    const newPath = `featured/${Date.now()}-${featuredFile.name}`;
    await supabase.storage.from("products").upload(newPath, featuredFile);

    await supabase
      .from("products")
      .update({ featured_image: newPath })
      .eq("id", id);

    setLoading(false); //added
    alert("Featured image updated");
    setForm({ ...form, featured_image: newPath });
    setFeaturedFile(null);
    setFeaturedPreview(null);
  };
 /// featured image />

 ////// <product image
 const saveProductImage = async () => {
    setLoading(true); //added
    if (!productFile) {
      setLoading(false); //added
      alert("No new product image selected");
      return;
    }

    if (form.product_image) {
      await supabase.storage.from("products").remove([form.product_image]);
    }

    const newPath_p = `product/${Date.now()}-${productFile.name}`;
    await supabase.storage.from("products").upload(newPath_p, productFile);

    await supabase
      .from("products")
      .update({ product_image: newPath_p })
      .eq("id", id);

    setLoading(false); //added
    //alert("products image updated");
    setTeoast_message("products image updated")
    setForm({ ...form, product_image: newPath_p });
    setProductFile(null);
    setProductPreview(null);
  };
 /////// product image/>


  const deleteAdditionalImage = async (path) => {

    setLoading(true); //added
    if (!window.confirm("Delete this image?")){
      setLoading(false); //added
       return;
    }

    await supabase.storage.from("products").remove([path]);

    const updated = form.additional_images.filter((p) => p !== path);
    await supabase
      .from("products")
      .update({ additional_images: updated })
      .eq("id", id);

    setForm({ ...form, additional_images: updated });
    
    setLoading(false); //added
  };

  const uploadAdditionalImages = async () => {
 
   setLoading(true); //added
   //added
    const existingCount = form.additional_images.length;  
    const newCount = additionalFiles.length;  

    if (existingCount + newCount > 8) {
    alert(`You can upload only ${8 - existingCount} more image(s). Total images limit is 8.`);
    return;
  }                
   //added

    if (!additionalFiles.length) {
      setLoading(false); //added
      alert("No images selected");
      return;
    }

    const newPaths = [];

    for (const file of additionalFiles) {
      const path = `additional/${Date.now()}-${file.name}`;
      await supabase.storage.from("products").upload(path, file);
      newPaths.push(path);
    }

    const updated = [...form.additional_images, ...newPaths];

    await supabase
      .from("products")
      .update({ additional_images: updated })
      .eq("id", id);

    setLoading(false); //added
    alert("Additional images uploaded");
    setForm({ ...form, additional_images: updated });
    setAdditionalFiles([]);
    setAdditionalPreviews([]); // clear preview after upload

  };

  //featured image
  const featuredUrl =
    featuredPreview || 
    (form.featured_image &&
    (supabase.storage
      .from("products")
      .getPublicUrl(form.featured_image).data.publicUrl))
   //featured image />   

    //product image
  const productUrl =
    productPreview ||
   (form.product_image && (supabase.storage
      .from("products")
      .getPublicUrl(form.product_image).data.publicUrl))
   //product image />   



   const closePreview = () =>{
     setAdditionalPreviews([]); 
      setAdditionalFiles([]); 
   }
   
   function isInvalidPrice(price) {  //added
  return (
    price === "" ||
    price === null ||
    price === undefined ||
    Number.isNaN(Number(price)) ||
    Number(price) < 0
  );
}

//  function parseKeywords(input, product_name_input) { //added
//   const result = `${input},${product_name_input}`;

//   return [...new Set(
//     result
//       .split(/[\s,]+/) 
//       .map(k => k.trim().toLowerCase()
//       .replace(/\./g, "") )   //
//       .filter(Boolean)
//   )];
// }


  return (
    <div>
      {/* HEADER */}
      <div className="sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2 ml-4">
          <img src={back} className="h-10 w-10" onClick={() => setGoBack(true)} />
          Edit Product Details
        </div>
        <hr />
      </div>
         
       <FullScreenLoader loading={loading}
      message=" loading..."/>   
      
      <div className="p-4">
        <p className="font-bold text-xl">Product Details-</p>
        <p className="font-bold mt-2">Product code-</p>
        <p className=" p-2 text-sm bg-gray-100 radius">{form.product_code}</p>

        <p className="font-semibold mt-5">Keywords and Category-</p>
         <button onClick={()=>{navigate(`/editKeywordAndCategory/${id}`)}} className="w-full border border-blue-600 text-blue-600 py-2 rounded mt-1">
          Edit keywords and category
        </button>

        <p className="font-semibold mt-4">name-</p>
        <input name="name" value={form.name}  placeholder="product name" 
        onChange={handleChange} className="w-full border p-2" 
        required/>

        <p className="font-semibold mt-3">description-</p>
        <textarea name="description" value={form.description}  placeholder="Enter product details"
         onChange={handleChange} className="w-full border p-2" />



            
        <p className="font-semibold mt-1 ">price-</p>
        <div className="flex space-x-2">
          <input name="currency" value={form.currency} onChange={handleChange} className="w-12 border px-3 py-2" />
          <input name="price" type="number" value={form.price}  placeholder="Price" 
          onChange={handleChange} className="w-full border p-2" 
          required/>
        </div>

        <p className="font-semibold mt-3">about-</p>
        <input name="about" value={form.about} placeholder="eg. Nike, etc (OPTIONAL)"
         onChange={handleChange} className="w-full border p-2" />
        
        <p className="font-semibold mt-3">stock-</p>
        <input name="stock" value={form.stock}  placeholder="Stock (OPTIONAL)" onChange={handleChange} className="w-full border p-2" />

        <button onClick={saveProductDetails} className="w-full bg-blue-600 text-white py-2 rounded mt-4">
          Save Product Details
        </button>

        <hr className="mt-5 border-gray-400" />


        
          {/* < Product Image */}
        <p className="font-bold text-xl mt-5">Product image-</p>
        <img src={productUrl} className="w-36 h-22 object-cover rounded"  />

        <button
          type="button"
          onClick={() => document.getElementById("productInput").click()}
          className="w-full mt-2 border border-blue-600 text-blue-600 py-2 rounded"
        >
          change Product Image
        </button>

        <input
          id="productInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setProductFile(file);
            setProductPreview(URL.createObjectURL(file));
          }}
        />

        <button onClick={saveProductImage} className="w-full mt-2 bg-blue-600 text-white py-2 rounded">
          Save Product Image
        </button>

         {/* Procduct image />*/}

         

        <hr className="mt-5 border-gray-400" />




        {/* < FEATURED */}
        <p className="font-bold text-xl mt-5">Product FEATURED image-</p>
        <img src={featuredUrl} className="w-36 h-22 object-cover rounded" />

        <button
          type="button"
          onClick={() => document.getElementById("featuredInput").click()}
          className="w-full mt-2 border border-blue-600 text-blue-600 py-2 rounded"
        >
          change Featured Image
        </button>

        <input
          id="featuredInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setFeaturedFile(file);
            setFeaturedPreview(URL.createObjectURL(file));
          }}
        />

        <button onClick={saveFeaturedImage} className="w-full mt-2 bg-blue-600 text-white py-2 rounded">
          Save Featured Image
        </button>

         {/* FEATURED />*/}

         

        <hr className="mt-5 border-gray-400" />

        {/* ADDITIONAL */}
        <p className="font-bold text-xl mt-5">Product Additional image-</p>
        <div className="grid grid-cols-2 gap-3">
          {form.additional_images.map((p) => (
            <div key={p}>
              <img
                src={supabase.storage.from("products").getPublicUrl(p).data.publicUrl}
                className="h-32 w-full object-cover rounded"
              />
              <button onClick={() => deleteAdditionalImage(p)} className="mt-1 w-full text-red-500 border border-red-500 mb-2">
                Delete
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => document.getElementById("additionalInput").click()}
          className="w-full border border-blue-600 text-blue-600 py-2 rounded mt-2"
        >
          Choose Additional Images
        </button>

        <input
          id="additionalInput"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          //onChange={(e) => setAdditionalFiles([...e.target.files])}
            onChange={(e) => {
              const files = [...e.target.files];
             setAdditionalFiles(files);
             setAdditionalPreviews(files.map((f) => URL.createObjectURL(f)));
           }}

        />
        {additionalPreviews.length > 0 && (<div className="mt-6 bg-gray-200 p-6">
     <div className="grid grid-cols-2 gap-3 ">
          {additionalPreviews.map((url, i) => (
              <img
               key={i}
                src={url}
               className="h-32 w-full object-cover rounded border"
             />
              
               
            ))}
         </div>
         <div>
          <button className="block mx-auto border text-red-500 p-1 rounded mt-8 justify-center"
          onClick={closePreview}>cancel changes</button>
          <p className="mt-2">this images are just preview, click on "Save Additional Images" button to upload images</p>
         </div>
         </div>
            )}

        <button onClick={uploadAdditionalImages} className="mt-2 w-full bg-blue-600 text-white py-2 rounded">
          Save Additional Images
        </button>

        
      </div>
       <PogressCompleteBox
    message={toast_mssage}
    onClose={()=>setTeoast_message("")}
    >

    </PogressCompleteBox>
    </div>
  );
}
