import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/downloade_categories_icon_default.png";
import LazyImage from "../placeHolder/lazyImage";
import CategoryBarSkeleton from "../placeHolder/CategoryBarPlaceholder";

function CategoryBar({ cat_id, onChange }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const res = await fetch("/.netlify/functions/categories");
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.error || "Fetch failed");
        }

        setCategories(data);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleClick = (id) => {
    if (!cat_id) {
      navigate(`/CategoryProducts/${id}`, { replace: true });
    } else {
      onChange(id);
    }

    if (id === "all") {
      navigate("/CategoriesPage", { replace: true });
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-hide py-2">

      {loading ? (
        <CategoryBarSkeleton />
      ) : (
        <div className="flex ml-2">

          <div
            onClick={() => handleClick("all")}
            className="flex-shrink-0 cursor-pointer w-20 flex flex-col items-center"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full border-1 border-[#bcb8ab] text-white font-bold">
              <img src={icon} alt="icon" className="w-8 h-8 object-contain p-1" />
            </div>
            <p className="mt-1 text-xs font-medium text-center">
              All Categories
            </p>
          </div>

          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="flex-shrink-0 cursor-pointer w-20 flex flex-col items-center"
            >
              {cat.category_image ? (
                <LazyImage
                  src={cat.category_image}
                  alt={cat.name}
                  className="w-14 h-14 object-cover rounded-full"
                />
              ) : (
                <div className="h-14 w-14 bg-gray-200 flex items-center justify-center rounded-full">
                  <p className="text-gray-500 text-xs text-center">
                    No Image
                  </p>
                </div>
              )}

              <p className="mt-1 text-xs font-medium text-center">
                {cat.name}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default CategoryBar;