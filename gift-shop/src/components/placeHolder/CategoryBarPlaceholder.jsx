export default function CategoryBarSkeleton() {
  return (
    <div className="flex ml-2 animate-pulse">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-20 flex flex-col items-center"
        >
          {/* Circle Image Skeleton */}
          <div className="w-14 h-14 rounded-full bg-gray-200"></div>

          {/* Text Skeleton */}
          <div className="mt-2 h-3 w-12 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
