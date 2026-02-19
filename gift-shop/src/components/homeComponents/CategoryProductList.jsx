import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ProductCard from "../ProductCard";
 


const PAGE_SIZE =30; 

export default function CategoryProductList({categoryId}) {
     
  //console.log("categoryId",categoryId);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading_for_refresh, setLoading_for_refresh] = useState(true); //added 

       // console.log("✅categoryId",categoryId)

  

  const fetchProducts = async (reset=false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setLoading_for_refresh(true)

    // if reset, start from next page
    const nextPage = reset ? page + 1 : page; 
    const from = nextPage * PAGE_SIZE; 
    const to = from + PAGE_SIZE - 1; 

    const { data, error } = await supabase
      .from("products")
      .select("id,name,currency,price,about,product_image") 
      .eq("category_id",categoryId)
      .order("priority_score", { ascending: false,nullsFirst: false })
      .range(from, to);

      console.log("data",data)


    if (error) {
      console.error(error);
      setLoading(false);
      setLoading_for_refresh(false)

      return;
    }
  
 
    if (!data || data.length === 0) 
      { setHasMore(false); 
        setLoading(false);
        setLoading_for_refresh(false)
         return; 
        }
    


    if (reset) { // replace with new batch 
     setProducts(data);
      setPage(nextPage);
     } else { // initial load
      setProducts(data); 
      setPage(nextPage);
    }
    

  setLoading(false);
  setLoading_for_refresh(false)
  };

     useEffect(() => {
    fetchProducts(); //true
  }, [categoryId]);


   

// if (loading) return <HomePlaceholder />;


  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Product Grid */}
      {(products.length === 0) && <p className=" text-gray-500">No items in Category.</p>}
      <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
          
   
        {/* {hasMore && (
        <div className="flex justify-center mt-5">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg font-medium
              bg-blue-600 text-white
              hover:bg-blue-800
              disabled:bg-gray-400
              disabled:cursor-not-allowed
              transition
            "
          >
            {loading ? "Loading..." : "Load More Products"}
          </button>
        </div>
      )} */}

    <div>
      {loading && hasMore && (
  <div 
  className="grid grid-cols-2 gap-6 mt-6 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-64 bg-gray-200 rounded-lg" />
    ))}
    
  </div>
)}
  </div>


  {/* Refresh Button */}
      {(!loading_for_refresh) && hasMore && (
        <div className="flex justify-center mt-5">
          <button onClick={() =>{ fetchProducts(true)}}
           // disabled={loading}
            className="
              px-4 py-1 rounded-lg text-sm
              text-blue-500
              border border-gray-200
              hover:bg-gray-200
              transition
            "
          >
              Refresh page  {/* {loading ? "Refreshing..." : "Refresh page"} */}
          </button>
        </div>
      )}


    </section>

  );
}
