import { useRef, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import back from "../../assets/icon_download_back.png";
import { data, useNavigate } from "react-router-dom";
import FullScreenLoader from "../../utils/FullScreenLoader";
import Alert from "../../components/ProgressCompleteBox"
import { useDispatch } from "react-redux";
import { setSelectedProductIds } from "../../redux/productSlice";


export default function Manage_category() {
  const dispatch = useDispatch();

  //  console.log("fshdjfh")

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);

  const [messages, setMessages] = useState("");



  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [preview, setPreview] = useState([]);
  const [imagePath, setImagePath] = useState(null);

  const [item_name, setItem_name] = useState(null);
  const [item_id, setItem_id] = useState(null);

 



  // Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("trending_score", { ascending: false });

    if (!error) {
      setLoading(false);
      setCategories(data);

      const categoriesWithUrls = data.map(cat => {
        if (cat.category_image) {
          const { data: urlData } = supabase.storage
            .from("category-images")
            .getPublicUrl(cat?.category_image);

          return { ...cat, category_image: urlData.publicUrl };
        } else {
          return { ...cat, category_image: null };
        }
      });

      setCategories(categoriesWithUrls);


    } else {
      setImagePath(null);
      setImageUrl(null);
      setLoading(false);

    }

    console.log(data)




    setLoading(false);

  };

  // Add Category
  const addCategory = async () => {

   if(categories.length > 0 && categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())){
    alert("category already exist");
    return;
   }
     
    const name_lower = name.toLowerCase();
    if (!name.trim() || name.includes(" ") || name.includes(",")) {
      alert("spaces or comma not allowed!");
      return;
    }
    //console.log(!name.trim(), name.includes(" "), name.includes(","))


    setLoading(true);

    const { data, error } = await supabase.from("categories").insert([{ name: name_lower }]);
    if (error) {
      setLoading(false);
    } else {
     alert("new category created!")
    setName("");
    fetchCategories();
    setLoading(false);
    }
    setName("");
    setLoading(false);
  };

  // Delete Category
  const deleteCategory = async (id) => {

    const confirmAction = window.confirm("Are you sure to delete ? ");

    if (!confirmAction) return;

    setLoading(false);
    const { data, error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      setLoading(false);
    }else{
      alert("category deleted.");
    fetchCategories();
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  ///////////
  const fetchProductsByCategoryID = async (catId) => {
    setLoading(true);
    // Step 1: Get product IDs from product_keywords table
    const { data: productLinks, error: Error } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", catId);

    console.log("data", productLinks)
    console.log("catId", catId)

    if (Error) {
      setLoading(false);
      console.error(Error);
      return;
    }

    // Extract product IDs into an array
    const productIds = productLinks.map((link) => link.id);

    if (productIds.length === 0) {
      setLoading(false);
      alert("product not found");
      // setProducts([]); // No products for this keyword
      return;
    } else {
      setLoading(false)
      console.log("productIds", productIds)
      console.log("productIds", productIds)


      dispatch(setSelectedProductIds(productIds));

      navigate("/Admin/SearchProductID");
    }
  };
  ///////////


  /////////////


  ////////////
  // const handleUpload = async (categoryId) => {
  //   if (!image) return alert("Select an image first");

  //   setLoading(true);

  //   const fileExt = image.name.split(".").pop();
  //   const filePath = `categories/${categoryId}/image.${fileExt}`;

  //   // upload (overwrite old image)
  //   const { error: uploadError } = await supabase.storage
  //     .from("category-images")
  //     .upload(filePath, image, { upsert: true });

  //   if (uploadError) {
  //     setLoading(false);
  //     return alert(uploadError.message);
  //   }

  //   // save file path in DB
  //   const { error: dbError } = await supabase
  //     .from("categories")
  //     .update({ category_image: filePath })
  //     .eq("id", categoryId);

  //   setLoading(false);

  //   if (dbError) {
  //     alert(dbError.message);
  //   } else {
  //     setImage(null);
  //     setPreview(null);        // ✅ reset preview
  //     fetchCategoryImage();    // ✅ refetch stored image
  //     alert("Image uploaded");
  //   }
  // };



  //////////// 
  //   const handleDelete = async () => {
  //   if (!imagePath) return;

  //   setLoading(true);

  //   // delete from storage
  //   const { error: storageError } = await supabase.storage
  //     .from("category-images")
  //     .remove([imagePath]);

  //   if (storageError) {
  //     setLoading(false);
  //     return alert(storageError.message);
  //   }

  //   // clear DB
  //   const { error: dbError } = await supabase
  //     .from("categories")
  //     .update({ category_image: null })
  //     .eq("id", categoryId);

  //   setLoading(false);

  //   if (!dbError) {
  //     setImagePath(null);
  //     alert("Image deleted");
  //   }
  // };
  ////////////
  // Decide what image to show
  //const displayImage = preview || imageUrl;

  const ChangeScoreCount = async (number_s =0,id) => {

    setLoading(true);

    const { data, error } = await supabase.from("categories")
    .update({ trending_score: number_s })
    .eq("id",id);
    if (error) {
      setLoading(false);
       setLoading(false);
       setItem_id(null);
       setItem_name(null);
    } else {
    setItem_id(null);
    setItem_name(null);
    fetchCategories();
    setLoading(false);
    setScore("");
    alert("score count changed!")
    }
    setItem_id(null);
    setItem_name(null);
     setLoading(false);
   
  };

  ///////////
  const handleScore = (id) => {
    
    if(!item_id && !item_name){
      alert("no category selected")
      return;
    }

    if (!isNaN(score) && score ) {
      const number_s = Number(score);
      ChangeScoreCount(number_s,id);
    }else{
      alert("number required!")
    }
  };

  const handleEditsScoreClick = (id,name) => {
    
    if (id && name) {
       setItem_id(id);
       setItem_name(name);
    }else{
      alert("something went wrong!")
    }
  };
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
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Categories</h1>

        <FullScreenLoader loading={loading}
          message=" loading..." />

        <Alert
          message={messages}
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
        />

        
        {/* Add Category */}
        <p className="font-semibold">Add new category:</p>
        <div className="mb-4" >
        <div className="flex gap-2 mb-2  mt-1">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={addCategory}
            className="border border-blue-500 text-blue-500 px-4 rounded"
          >
            Add
          </button>
          
        </div>
        <hr></hr>
        <div className=" border-2 border-gray-500 p-2 mt-2">
          <p className="font-semibold">{item_name || "no category selected"}</p>
           <input
                   type="number"
                   value={score} onChange={(e) => setScore(e.target.value)}
                   placeholder="Enter scroe number"
                   className=" border border-black p-1  placeholder-gray-500" />
                    
                 <button

                onClick={()=>handleScore(item_id)}
                className="ml-3   px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                save score
              </button>
         </div>

                </div>

        <hr></hr>
        {/* Category List */}

        <div className="space-y-2 mt-5">
          <p className="font-semibold">Existing categories:</p>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col   border p-1 rounded"
            >
              <p className="font-semibold text-lg">{cat.name}</p>

               <div className="p-2">
              <p className=" ">score count: {cat.trending_score || "no score"}</p>
              <button className="px-2 py-1 bg-gray-200 rounded"
               onClick={()=>{handleEditsScoreClick(cat.id,cat.name)}}>select for edit score count</button>
              </div>
              <p className="p-2 ">click count: {cat.clicks_count || "not fount"}</p>

              <div className="flex justify-between mt-2">
                <button
                  onClick={() => fetchProductsByCategoryID(cat.id)}
                  className="border border-blue-500 text-blue-500  px-3 py-1 rounded"
                >
                  View linked products
                </button>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="border border-red-500 text-red-500  px-3 py-1 rounded"
                >
                  Delete category
                </button>
              </div>

              {/*image*/}

              <div className="border border-gray-500 flex items-center gap-4 p-5 rounde rounded mt-2">
                {/* Circular Image */}

                <div className="w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center bg-gray-100">

                  {
                    cat.category_image ? (
                      <div>

                        <img src={cat.category_image} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                </div>

               
                <button

                  onClick={() => navigate(`/ManageImageCategory/${cat.id}`)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Manage Image for category
                </button>


              </div>

               
              





              {/*image*/}

            </div>
          ))}
        </div>
      </div>
    </div >

  );
}