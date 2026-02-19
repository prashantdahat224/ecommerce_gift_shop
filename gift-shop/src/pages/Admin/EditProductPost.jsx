import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import back from "../../assets/icon_download_back.png";
import { Navigate } from "react-router-dom";

export default function EditProductPosts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [goBack, setGoBack] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProducts = async () => {
      
      setLoading(true);  //added
      const { data, error } = await supabase
        .from("products")
        .select("id,name,product_image,product_code")
        .limit(20);
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      // Convert stored paths to public URLs
      const productsWithUrls = data.map((p) => {
        let publicUrl = "";
        if (p.product_image) {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(p.product_image);
          publicUrl = urlData.publicUrl;
        }
        return { ...p, product_image: publicUrl };
      });

      setProducts(productsWithUrls);

      setLoading(false);  //added
    };

    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.product_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category_of_product || "").toLowerCase().includes(search.toLowerCase()) 
  );

  if (goBack) return <Navigate to="../AdminOption" />;

  return (
    <div>

      <div className="sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-2 text-left text-lg font-medium text-gray-900 my-2 ml-4">
          <img
            src={back}
            alt="Back"
            className="h-10 w-10"
            onClick={() => setGoBack(true)}
          />
          Edit Product Posts
        </div>
        <hr className="border-gray-300" />
      </div>

      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Edit Product Posts</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or product code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

         {loading && (
          <p className="text-center text-gray-500 font-medium my-4">Loading...</p>
        )}


        {/* Product List */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((product) => (
            <Link key={product.id} to={`/admin/product/${product.id}`}>
              <div className="border rounded p-2 hover:shadow">
                {product.product_image ? (
                  <img
                    src={product.product_image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500">
                    No Image
                  </div>
                )}
                <h2 className="text-sm font-semibold mt-2">{product.name}</h2>
                <p className="text-xs text-gray-500">{product.product_code}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
