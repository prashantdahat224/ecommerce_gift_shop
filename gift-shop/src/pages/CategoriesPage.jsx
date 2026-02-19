import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CategoriesPlaceholder from "../components/placeHolder/CategoriesPlaceholder";
import back from "../assets/icon_download_back.png";
import LazyImage from "../components/placeHolder/lazyImage";
 
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true );
    const { data ,error} = await supabase
      .from("categories")
      .select("id, name, category_image")
      .order("trending_score", { ascending: false });
        
       if (error) {
              setLoading(false);
              console.error(error);
            } 
            //////////////////
            else

               {
               
              //console.log("1",data)
             const withUrls = data.map(cat => {
              let publicUrl = null;
              if (cat.category_image) {
                const { data: urlData ,error} = supabase
                  .storage
                  .from("category-images")
                  .getPublicUrl(cat.category_image);
                publicUrl = urlData.publicUrl;
               // console.log("1",publicUrl);
               setLoading(false);
              }else{
              //  console.log(error)
                 setLoading(false);
              }
              return {
                ...cat,
                category_image: publicUrl || ""  
                 
              };
              
             
            });
           // console.log("2",withUrls)
            setCategories(withUrls || []);
              setLoading(false);
          }
          /////////////////////////////
    setLoading(false);
  };

  if (loading) return <CategoriesPlaceholder />;

  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-2">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Product Categories </h1>
            </div>
            <hr />
          </div>

    <div className="px-2 py-4">
      <h1 className="text-lg font-semibold mb-3 text-center mb-5">Categories</h1>

      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/CategoryProducts/${category.id}`)}
            className="cursor-pointer flex flex-col items-center"
          >
            {/* Image */}
            <div className="w-20 h-20 aspect-square overflow-hidden rounded-full bg-gray-100">
              {!(category.category_image ==="") &&(<LazyImage
                src={category.category_image}
                alt={category.name}
                className="w-20 h-20 object-cover transition-transform group-hover:scale-105"
              />)}
            </div>

            {/* Name */}
            <p className="text-sm mt-1 text-center truncate">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
      </div >
  );
}
