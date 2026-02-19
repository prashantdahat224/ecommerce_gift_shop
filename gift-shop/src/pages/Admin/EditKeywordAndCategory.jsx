import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useParams } from "react-router-dom";
import FullScreenLoader from "../../utils/FullScreenLoader";
import back from "../../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";


 
export default function KeywordCategoryPage() {
 
    const {productId} = useParams();
    

  const [inputText, setInputText] = useState("");
  const [keywords, setKeywords] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [newCategory, setNewCategory] = useState("");

 
  const [loading, setLoading] = useState(false);

  //const [edit_category, setEdit_category] = useState(true);
  //const [edit_kyeword, setEdit_kyeword] = useState(true);

  const [error, setError] = useState(true);

  const [cat_name, setCat_name] = useState("");

  const [existingData_now, setExistingData_now] = useState(null);

  const navigate = useNavigate();

  //setCategory_now(null)



  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      let { data, error } = await supabase.from("categories").select("id,name").order("name");
      if (!error && data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories_t = async () => {
       const { data, error } = await supabase
          .from("products")
          .select("*")
          //.select("category_id,category_name,search_keywords")
          .eq("id", productId)
          .single();
      if (!error && data) {
        setExistingData_now(data);
        console.log(data)
      } 
    };
    
    
    fetchCategories_t();
  }, []);


  

  // Handle keyword add
  const handleAddKeywords = () => {
    const cleaned = inputText
    //   .replace(/[.,]/g, "") // remove commas and periods
    //     split(/[\s,]+/) // split by spaces or comma
    //   .filter((word) => word.length > 0);
    .split(/[\s,]+/) // split by space or comma
       .map(k => k.trim().toLowerCase()
       .replace(/\./g, "") ) // remove full stop
       .filter(Boolean);

     setKeywords((prev) => [...prev, ...cleaned]);
     setInputText("");
      
 
    
  };

  // Clear keywords
  const handleClearKeywords = () => {
    setKeywords([]);
  };

  // Upload keywords (example: log or send to Supabase)
//   const handleUploadKeywords = async () => {
   
//     console.log("Uploading keywords:", keywords);
//     addKeywordsToProduct(productID,keywords)
//     // Example: await supabase.from("keywords").insert(keywords.map(k => ({ word: k })));
//   };
  

   

const addKeywordsToProduct = async () => {

     if(keywords.length === 0 || !productId ||productId.trim() ==="" ){ 

    alert("product id or keyword, something is not exist",typeof keywords, productId);
    return;
   } 
   
setLoading(true);
  for (const keyword of keywords) {
    // 1. Try to get existing keyword
    const { data: existingKeyword } = await supabase
      .from("keywords")
      .select("id")
      .eq("name", keyword)
      .maybeSingle();

    let keywordId;

    // 2. Insert if not exists
    if (!existingKeyword) {
      const { data: newKeyword, error } = await supabase
        .from("keywords")
        .insert({ name : keyword })
        .select()
        .single();

      if (error) {
         setLoading(false);
        throw error;
      }
      keywordId = newKeyword.id;
    } else {
      keywordId = existingKeyword.id;
    }

    // 3. Link keyword to product
    const { error } = await supabase
      .from("product_keywords")
      .insert({
        keyword_id: keywordId,
        product_id: productId,
      });




    if (error){
        setLoading(false);
        setKeywords([]);
        setError("Their is some problem or duplicate etries")
       // setEdit_kyeword(false);
        throw error;
        return; 
    } 
    
    
    
  }
let add_keywords = (Array.isArray(setExistingData_now) && setExistingData_now.search_keywords.length) 
? [...new Set([...setExistingData_now.search_keywords, ...keywords])] : [...keywords];

console.log("add_keywords",add_keywords);
  const { error } = await supabase
      .from("products")
      .update({
        search_keywords: add_keywords
      })
       .eq("id",productId);
      if(error){
         setLoading(false);
        setKeywords([]);
        //setEdit_kyeword(false);
        console.log("error",error);

        return;
      }else{
        setLoading(false);
        setKeywords([]);
               alert("keyword added succesfully");

        setExistingData_now(prev=>({...(prev || {}),search_keywords:add_keywords}))
      }
 
};

 //setEdit_kyeword 

  // Upload category
  const handleUploadCategory = async () => {
      
     
    if(selectedCategory.trim()==="" && newCategory.trim()==="" ){
        alert("please select or enter the new the category");
        return;
    } 
    if(selectedCategory.trim() !=="" && newCategory.trim() !==""){
        alert("please choose only one");
        return;
    }
    setCat_name(selectedCategory || newCategory)

    setLoading(true); 

           
       let categoryId = selectedCategory;
       let categoryname="";

    // If user typed a new category
    if (newCategory.trim()) {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name: newCategory })
        .select()
        .single()

       

      if (error) {
        alert("Failed to create category")
        setLoading(false)
        return
      }

      categoryId = data.id
      categoryname =newCategory;
     // console.log("1",categoryname)
    }else{
      categoryname=categories.find(cat => cat.id === Number(selectedCategory))?.name || "";
    }           
           //console.log("2",categories,)


 
       const { error } = await supabase
      .from("products")
      .update({ category_id: categoryId,
                 category_name:categoryname
                })
      .eq("id", productId)

    setLoading(false)

    if (error) {
      setLoading(false);
      alert("Error saving category")
      {console.log(error)}
    } else {
       setLoading(false);
        setExistingData_now(prev =>({...(prev || {}),category_name:categoryname}))
      alert("Category saved successfully");

    }

    
    setLoading(false);
  };


//   const handleRemoveCategory = async () => {
//     setLoading(true);
//   const { error } = await supabase
//     .from("products")
//     .update({
//       category_id: null,
//       category_name: null
//     })
//     .eq("id", productId)

//   if (error) {
//      setLoading(false);
//     alert("Failed to remove category")

//   } else {
//      setLoading(false);
//      setEdit_category(true)
//      setExistingData_now(prev =>({...(prev || {}),category_name:"no category found"}))
//      //setCategory_now(null)
//     alert("Category removed")
//   }
//    setLoading(false);
// }


const handleDeleteAllKeywords = async () => {
  setLoading(true)

  if(!existingData_now.search_keywords || Array.isArray(existingData_now.search_keywords) || existingData_now.search_keywords ===0){
      setLoading(false)

        alert("no keywords found")

    return;
  }
  
  const permission = window.confirm("are you sure to delete all keywords?")

  if(!permission){
      setLoading(false)

    return;
  }

  const { error } = await supabase
    .from("product_keywords")
    .delete()
    .eq("product_id", productId)

  setLoading(false)

  if (error) {
    setKeywords([]);
    alert("Failed to delete keywords")
  } else {

  const { error } = await supabase
  .from('products')
  .update({ search_keywords: [] })
  .eq('id', productId);

  if(error){
   setKeywords([]);
  }else{
    //setEdit_kyeword(true)
     setKeywords([]);
    setExistingData_now(prev=>({...prev,search_keywords:[]}))
    alert("All keywords removed from product")
}
  }
}




  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4">
              <img src={back} className="h-10 w-10" onClick={() => navigate("/AdminOption")} />
                           <h1 className="text-lg font-semibold"> Edit Cetegory and Keywords </h1>
            </div>
            <hr />
          </div>
    <div className="p-6 max-w-lg mx-auto space-y-6">
      {/* Keywords input */} 

         <FullScreenLoader loading={loading}
      message=" loading..."/>


       {(productId && productId !=="") ? (<button
          onClick={()=>navigate(`/product/${productId}`)}
          
          className="border border-blue-500 text-blue-500 bg-gray-100 px-4 py-1 rounded"
        >
          
          View Product
        </button>):
        (<p className="bg-gray-100">not product id exist !</p>)}
      
      <div className="border border-gray-500 p-2 bg-gray-100">
      <p className="text-lg font-semibold">current stauts </p>
      <p>existing keywords of product:</p>
      <p> {(existingData_now?.search_keywords?.join(", ") ?? "no keywords exist") || "no any keyword found"  }  </p>
      <p></p>
</div>
     
       <div className="space-y-3">
      <div>
      <p className="text-lg font-semibold">Keywords for products</p>
      <p className="text-sm text-gray-500">Keywords are words that users 
            type in a search bar to find specific products, keyword should- Clearly describe the
             product, simple, commonly used-</p>
      <p className="text-sm text-blue-500">keywords must include the product name</p>       
      <p className="text-sm text-blue-500"> duplicate keywords for same product are not allow</p>       
      </div>

      <textarea
        className="w-full border rounded p-2 placeholder-gray-500"
        rows="3"
        placeholder="Enter keywords..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={handleAddKeywords}
          className="border border-blue-500 text-blue-500  px-4 py-2 rounded"
        >
          Add
        </button>

        {(keywords.length>0) &&(<button
          onClick={handleClearKeywords}
          className="border border-red-500 text-red-500 px-4 py-2 rounded"
        >
          Clear Keywords
        </button>)}
        
      </div>

      {/* Show keywords */}
      <div className="flex flex-wrap gap-2">
        {keywords.map((k, i) => (
          <span key={i} className="bg-gray-200 px-2 py-1 rounded">
            {k}
          </span>
        ))}

    
      </div>
        
      {/* Upload keywords   */}

      {(keywords.length>0) && 
      ( 
        
        <button
        onClick={addKeywordsToProduct}
        disabled={loading}
        className="border border-green-500 text-green-500 px-4 py-2 rounded"
      > 
        Upload Keywords
      </button>
       
    )}
       </div>
       

      <div  className="space-y-1">
       <p>you can delete all keywords for product</p>
       {/* Show keywords */}
      <div className="flex flex-wrap gap-2">
    
      </div>

      <button
          onClick={handleDeleteAllKeywords}
          className="border border-red-500 text-red-500 px-4 py-2 rounded"
          disabled={loading}
        >
          delete all keywords

        </button> 
      
      </div>
        

         <p className="text-red-400">{error}</p>
   


    <hr></hr>

        <div className="border border-gray-500 p-2 bg-gray-100 mt-10">
      <p className="text-lg font-semibold">current stauts </p>
      <p>existing category of product: {existingData_now?.category_name ?? "no category exist"} </p>
      <p></p>
</div>
 
      {/* Category selection */}
       <div className="flex flex-col gap-2 ">
        <div className="border border-gray-500 p-2 rounded">
      <p className="text-lg font-semibold">Category of product</p>
      <p className="text-sm text-gray-500">select the category or create the new one by entering name of category</p>
      <div>
        <select
          className="w-full border rounded p-2 mt-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        
      </div>
      
  {/* Create new category */}
         <div className="text-center text-gray-500 text-sm ">OR</div>
        <input  
          type="text"
          placeholder="Create new category"
          className="w-full border rounded px-3 py-2 placeholder-gray-500"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value)
            setSelectedCategory("")
          }}
        />
      </div>
      {/* Upload category */}

      <button
        onClick={handleUploadCategory}
        disabled={loading}
        className="border border-green-500 text-green-500 px-4 py-2 rounded mt-3"
      >
        Upload Category
      </button>

        
        

    </div>
     
    {/* <div  className="flex flex-col gap-2 mt-10">
      <p>product category : { ( categories.find(cat =>cat.id === Number(selectedCategory))?.name || "no category found")}</p>
       
 
    <button
          onClick={handleRemoveCategory}
          className="border border-red-500 text-red-500 px-4 py-2 rounded"
          disabled={edit_category || loading}
        >
          delete category
        </button> 
        </div> */}

    </div>

       </div >

  );
}
