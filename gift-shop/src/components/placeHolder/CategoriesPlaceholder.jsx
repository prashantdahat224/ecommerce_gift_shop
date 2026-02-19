export default function CategoriesPlaceholder() {
  return (
    <div>
      {/* HEADER SKELETON */}
      <div className="sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2 ml-4 p-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <hr />
      </div>

      <div className="px-2 py-4">
        {/* Title Skeleton */}
        <div className="flex justify-center mb-5">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center animate-pulse"
            >
              {/* Circle Image Skeleton */}
              <div className="w-20 h-20 rounded-full bg-gray-200"></div>

              {/* Text Skeleton */}
              <div className="mt-2 h-3 w-14 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
