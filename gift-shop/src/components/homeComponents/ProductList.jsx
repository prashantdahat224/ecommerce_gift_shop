 import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

const PAGE_SIZE = 30;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading_for_refresh, setLoading_for_refresh] = useState(true);

  const fetchProducts = async (reset = false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setLoading_for_refresh(true);

    const nextPage = reset ? page + 1 : page;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      const res = await fetch(
        `/.netlify/functions/products?from=${from}&to=${to}`
      );

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        throw new Error(data?.error || "Fetch failed");
      }

      if (data.length === 0) {
        setHasMore(false);
        setLoading(false);
        setLoading_for_refresh(false);
        return;
      }

      setProducts(data);
      setPage(nextPage);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
    setLoading_for_refresh(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4">

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div>
        {loading && hasMore && (
          <div className="grid grid-cols-2 gap-6 mt-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg" />
            ))}
          </div>
        )}
      </div>

      {!loading_for_refresh && hasMore && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => fetchProducts(true)}
            className="
              px-4 py-1 rounded-lg text-sm
              text-blue-500
              border border-gray-200
              hover:bg-gray-200
              transition
            "
          >
            Refresh page
          </button>
        </div>
      )}

    </section>
  );
}
