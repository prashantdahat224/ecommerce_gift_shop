export default function ProductDetailsPlaceholder() {
  return (
    <div className="flex flex-col min-h-screen bg-white animate-pulse">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md h-12 mb-2" />

      {/* Image Slider */}
      <div className="w-full h-80 bg-gray-300 rounded-b-2xl mb-2" />

      {/* Indicators */}
      <div className="flex justify-center space-x-2 mt-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      </div>

      {/* Product Info */}
      <div className="px-4 space-y-3 mt-4">
        <div className="h-6 bg-gray-300 w-1/2 rounded" />
        <div className="h-4 bg-gray-300 w-1/3 rounded" />
        <div className="h-6 bg-gray-300 w-1/4 rounded mt-2" />
        <div className="h-4 bg-gray-300 w-1/6 rounded mt-1" />
        <div className="h-32 bg-gray-300 w-full rounded mt-3" />
      </div>

      {/* Sticky Bottom Buttons */}
      <div className="sticky bottom-0 flex w-full gap-2 p-2 bg-white">
        <div className="flex-1 h-12 bg-gray-300 rounded" />
        <div className="flex-1 h-12 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
