// SkeletonSlider.jsx
export default function OfferPosterPlcehoder() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Scrollable skeleton slider */}
      <div className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex-shrink-0 w-full snap-center">
            <div className="w-full h-40 bg-gray-200 animate-pulse rounded-md" />
          </div>
        ))}
      </div>

      {/* Dots indicator skeleton */}
      <div className="flex justify-center mt-1 space-x-2">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
