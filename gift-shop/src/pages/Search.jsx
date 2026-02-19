import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import searchIcon from "../assets/search.png";
import backIcon from "../assets/icon_download_back.png";
import { Navigate } from "react-router-dom";


export default function Search() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [goBack, setGoBack] = useState(false);

  const [page, setPage] = useState(0); //added pagination
  const pageSize = 30;       //added pagination 
  const [hasMore, setHasMore] = useState(true);      //added pagination 


  const debounceRef = useRef(null);

  const [popularKeywords, setPopularKeywords] = useState([]);


  /* -------------------------------
     Fetch autocomplete keyword suggestions
 -------------------------------- */
  const handleInputChange = (value) => {
    setQuery(value);
    setShowResults(false);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const { data, error } = await supabase
        .from("keywords")
        .select("name")
        .ilike("name", `${value}%`)
        .limit(12);

      if (!error && data) {
        const uniqueKeywords = [...new Set(data.map(k => k.name))];
        setSuggestions(uniqueKeywords);
      }
    }, 300);
  };
  /* -------------------------------
      Handle final search by keyword
  -------------------------------- */
  const handleSearch = async (keyword, pageNumber = 0) => {
    keyword = keyword.toLowerCase();
    setQuery(keyword);
    setShowResults(true);
    setSuggestions([]);

    setPage(pageNumber);//added pagination
    const from = pageNumber * pageSize; //added pagination
    const to = from + pageSize - 1;//added pagination

    const { data, error } = await supabase
      .from("product_keywords")
      .select(`
      products ("id,name,currency,price,about,product_image"),
      keywords!inner (name)
    `)
      .eq("keywords.name", keyword)
      .order("priority_score", { ascending: false,nullsFirst: false })
      .range(from, to); //added pagination

    if (error) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    // extract products (remove duplicates just in case)
    const uniqueProducts = [
      ...new Map(data.map(item => [item.products.id, item.products])).values()
    ];


    //added pagination
    if (pageNumber === 0) {
      setProducts(uniqueProducts);
    } else {
      setProducts(prev => [...prev, ...uniqueProducts]);
    }
    setHasMore(uniqueProducts.length === pageSize);
    //added pagination
    //setProducts(uniqueProducts);   //added pagination
  };


  const fetchPopularKeywords = async () => {
    if (popularKeywords.length > 0) return; // already fetched
     
    
    const { data, error } = await supabase
      .from("trending_keywords")
      .select("id,keyword_name")
      .order("id", { ascending: true }) // or count desc
      .limit(8);

    if (!error && data) {
      setPopularKeywords(data.map(k => k.keyword_name));
    }
  };


  if (goBack) {

    return <Navigate to="/home" />;
  }



  return (
    <div className="">
      {/* Search Bar */}
      <div className="p-4  bg-[#E8E4E0]">
        <div className="w-full flex items-center gap-1 ">

          {/* Back Arrow (outside search bar) */}
          <div className="w-10 h-10 cursor-pointer rounded-full   p-1">
            <img
              src={backIcon}
              alt="Back"
              className=" "
              onClick={() => setGoBack(true)}
            />
          </div>

          <div className="
              flex items-center 
              flex-1 
              border border-gray-300 
              bg-white rounded-full    
              
            ">
            {/* Search Icon */}
            <img
              src={searchIcon}
              alt="Search Icon"
              className="w-5 h-5 ml-3 text-gray-400"
            />

            <input
              autoFocus
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={fetchPopularKeywords} //added


              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(query);
                }
              }}

              placeholder="Search products or about it..."
              className="
            flex-1 px-3 py-2
            bg-transparent text-gray-700 placeholder-gray-400
            text-base sm:text-base text-gray-700
            focus:outline-none rounded-full
             
             
          "
            />
          </div>




        </div>
      </div>


      {/*trending */}
      {query === "" && !showResults && popularKeywords.length > 0 && (
        <div className="bg-white">
          {popularKeywords.map((keyword, indx) => (
            <div
              key={indx}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSearch(keyword)}
            >
              <div className="flex items-center  gap-2 border-b border-gray-300">
                <img
                  src={searchIcon}
                  alt="icon"
                  className="w-4 h-4 ml-4"
                />
                <span>{keyword}</span>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Autocomplete Suggestions */}
      {!showResults && suggestions.length > 0 && (
        <div className=" bg-white ">
          {suggestions.map((keyword) => {
            return (
              <div

                key={keyword}
                className="p-1 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSearch(keyword)}//tolowecase()
              >
                <div className="flex items-center  gap-2 border-b border-gray-300 ">
                  <img
                    src={searchIcon}
                    alt="Search Icon"
                    className="w-4 h-4 ml-4 mb-2"

                  />
                  <div className="mb-2">
                    {keyword}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products */}
      {showResults && (
        <div className="mt-4">
          {products.length > 0 ? (

            //added pagination
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            //added pagination
            //{/*<ProductList products={products} />*/} //added pagination


          ) : (
            <div className="p-3 text-gray-500">No products found.</div>
          )}
        </div>
      )}
      {/*//added pagination*/}
      {showResults && products.length > 0 && hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSearch(query, page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More
          </button>
        </div>
      )}
      {/*//added pagination*/}

    </div>
  );
}
